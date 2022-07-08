/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Global } from '../../../source/types';
declare const global: Global;

import { App } from '../../../source/app';
import { Blockchain } from '../../../source/blockchain';
import { Alerts, Alert, alert } from '../../../source/functions';
import { range } from '../../../source/functions';
import { HashManager } from '../../../source/managers';
import { IntervalManager } from '../../../source/managers';
import { MiningManager } from '../../../source/managers';
import { Tooltip } from '../../tooltips';
import { Tokenizer } from '../../../source/token';
import { Level, Token } from '../../../source/redux/types';
import { MoeWallet, OnTransfer, OtfWallet } from '../../../source/wallet';

import React, { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { nice } from '../../../filters';

type Row = {
    disabled: boolean,
    display: boolean,
    nn_counter: number,
    tx_counter: number
};
export class Minting extends React.Component<{
    token: Token
}, {
    token: Token, rows: Row[]
}> {
    static get levels() {
        return Array.from(range(1, 65)) as Level[];
    }
    static get rows() {
        return {
            rows: this.levels.map((level) => this.empty({
                display: level === App.level.min
            }))
        };
    }
    static empty(
        row: Partial<Row> = {}
    ) {
        return {
            disabled: true,
            display: false,
            nn_counter: 0,
            tx_counter: 0,
            ...row
        };
    }
    constructor(props: {
        token: Token
    }) {
        super(props);
        this.state = {
            ...Minting.rows, ...props
        };
        this.events();
    }
    getRow(
        index: number
    ) {
        if (index >= this.state.rows.length) {
            throw new Error('index out-of-range');
        }
        return this.state.rows[index];
    }
    setRow(
        index: number, new_row: Partial<Row>
    ) {
        const rows = this.state.rows.map((row, i) =>
            (index !== i) ? { ...row } : { ...row, ...new_row }
        );
        return new Promise<void>(
            (resolve) => this.setState({ rows }, resolve)
        );
    }
    events() {
        App.onTokenSwitch(/*initialize*/(token) => {
            this.setState({ ...Minting.rows, token });
        });
        Blockchain.onceConnect(/*synchronize*/({
            address
        }) => {
            App.onNonceChanged(address, (
                nonce, { amount, token }, total
            ) => {
                if (token !== this.state.token) {
                    return;
                }
                const amount_min = Tokenizer.amount(
                    token, App.level.min
                );
                const level = Tokenizer.level(token, amount);
                const { tx_counter } = this.getRow(level - 1);
                this.setRow(level - 1, {
                    disabled: !total,
                    display: amount === amount_min || total > 0n || tx_counter > 0n,
                    nn_counter: Number(total / amount),
                });
            });
        });
    }
    render() {
        const { token, rows } = this.state;
        return <React.Fragment>
            <label className='form-label'>
                Mined Amounts (not minted yet)
            </label>
            {rows.map(
                (row, i) => this.$mint(token, i + 1, row)
            )}
        </React.Fragment>;
    }
    $mint(
        token: Token, level: Level, row: Row
    ) {
        return <div
            className='btn-group mint' key={level - 1} role='group'
            style={{ display: row.display ? 'block' : 'none' }}
        >
            {this.$minter(token, level, row)}
            {this.$nn_counter(token, level, row)}
            {this.$tx_counter(token, level, row)}
            {this.$forget(token, level, row)}
        </div>;
    }
    $minter(
        token: Token, level: Level, { disabled }: Row
    ) {
        const amount = nice(Tokenizer.amount(token, level));
        return <button className='btn btn-outline-warning minter'
            onClick={this.mint.bind(this, token, level)}
            type='button' disabled={disabled}
        >
            {`Mint ${amount}`} <span className='d-none d-sm-inline'>{
                token
            }</span>
        </button>;
    }
    async mint(
        token: Token, level: Level
    ) {
        const address = await Blockchain.selectedAddress;
        if (!address) {
            throw new Error('missing selected-address');
        } else {
            Alerts.hide();
        }
        const amount = Tokenizer.amount(token, level);
        const block_hash = HashManager.latestHash({
            slot: Tokenizer.lower(token)
        });
        if (!block_hash) {
            throw new Error('missing block-hash');
        }
        const { nonce } = App.getNonceBy({
            address, amount, block_hash, token
        });
        if (!nonce) {
            throw new Error(`missing nonce for amount=${amount}`);
        }
        const moe_wallet = new MoeWallet(address, token);
        try {
            const on_transfer: OnTransfer = async (
                from, to, amount, ev
            ) => {
                if (ev.transactionHash !== mint.hash) {
                    return;
                }
                moe_wallet.offTransfer(on_transfer);
                if (token !== this.state.token) {
                    return;
                }
                const { tx_counter } = this.getRow(level - 1);
                if (tx_counter > 0) this.setRow(level - 1, {
                    tx_counter: tx_counter - 1
                });
            };
            const mint = await moe_wallet.mint(
                block_hash, nonce
            );
            console.debug('[mint]', mint);
            moe_wallet.onTransfer(on_transfer);
            const { tx_counter } = this.getRow(level - 1);
            const inc = this.setRow(level - 1, {
                tx_counter: tx_counter + 1
            });
            inc.then(() => App.removeNonce(nonce, {
                address, block_hash, token
            }));
        } catch (ex: any) {
            /* eslint no-ex-assign: [off] */
            if (ex.error) {
                ex = ex.error;
            }
            if (ex.message && ex.message.match(
                /internal JSON-RPC error/i
            )) {
                if (ex.data && ex.data.message && ex.data.message.match(
                    /gas required exceeds allowance/i
                )) {
                    if (OtfWallet.enabled) {
                        const miner = MiningManager.miner(address, {
                            token
                        });
                        if (miner.running) {
                            miner.pause();
                        }
                    }
                }
                if (ex.data && ex.data.message && ex.data.message.match(
                    /empty nonce-hash/i
                )) {
                    App.removeNonce(nonce, {
                        address, block_hash, token
                    });
                }
            }
            if (ex.message) {
                if (ex.data && ex.data.message) {
                    ex.message = `${ex.message} [${ex.data.message}]`;
                }
                const $mints = document.querySelectorAll<HTMLElement>(
                    '.mint'
                );
                alert(ex.message, Alert.warning, {
                    id: `${nonce}`, style: { margin: '-0.5em 0 0.5em 0' },
                    after: $mints[level - 1]
                });
            }
            console.error(ex);
        }
    }
    $nn_counter(
        token: Token, level: Level, { disabled, nn_counter }: Row
    ) {
        return <span
            className='d-inline-block'
            data-bs-toggle='tooltip' data-bs-placement='left'
            title={`Number of level ${level} ${token} tokens mined`}
        >
            <button
                className='btn btn-outline-warning nn-counter'
                type='button' disabled={disabled}
            >{nn_counter}</button>
        </span>;
    }
    $tx_counter(
        token: Token, level: Level, { disabled, tx_counter }: Row
    ) {
        return <span
            className='d-inline-block'
            data-bs-toggle='tooltip' data-bs-placement='left'
            title={`Number of level ${level} ${token} tokens minted`}
        >
            <button
                className='btn btn-outline-warning tx-counter'
                type='button' disabled={disabled}
            >{tx_counter}</button>
        </span>;
    }
    $forget(
        token: Token, level: Level, { disabled }: Row
    ) {
        return <span
            className='d-inline-block'
            data-bs-toggle='tooltip' data-bs-placement='top'
            title='Forget the tokens mined so far (w/o minting them)'
        >
            <button
                onClick={this.forget.bind(this, token, level)}
                className='btn btn-outline-warning forget'
                type='button' disabled={disabled}
            >&times;</button>
        </span>;
    }
    async forget(
        token: Token, level: Level
    ) {
        const address = await Blockchain.selectedAddress;
        if (!address) {
            throw new Error('missing selected-address');
        }
        const result = App.getNoncesBy({
            address, amount: Tokenizer.amount(token, level), token
        });
        for (const { item } of result) {
            App.removeNonceByAmount(item);
        }
    }
    componentDidUpdate() {
        const $forget = document.querySelectorAll<HTMLElement>(
            '.mint button.forget'
        );
        $forget.forEach(($el) => {
            const $tip = $el.parentElement;
            if ($tip) Tooltip.getInstance($tip)?.hide();
        });
    }
}
App.onTokenSwitched(function forgetNonces() {
    App.removeNonces();
});
Blockchain.onceConnect(function forgetNonces() {
    const im = new IntervalManager({ start: true });
    im.on('tick', () => App.removeNonces());
});
Blockchain.onceConnect(function autoMint({
    address, token
}) {
    const miner = MiningManager.miner(address, {
        token
    });
    miner.on('stopping', () => {
        if (global.MINTER_IID) {
            clearInterval(global.MINTER_IID);
            delete global.MINTER_IID;
        }
    });
    miner.on('started', ({ running }: {
        running: boolean;
    }) => {
        if (global.MINTER_IID) {
            clearInterval(global.MINTER_IID);
            delete global.MINTER_IID;
        }
        if (running && App.auto_mint > 0) {
            global.MINTER_IID = setInterval(on_tick, App.auto_mint);
        }
    });
    function on_tick() {
        if (OtfWallet.enabled) {
            const $minters = document.querySelectorAll<HTMLButtonElement>(
                '.minter'
            );
            for (const $minter of $minters) {
                if ($minter.getAttribute('disabled') === null) {
                    $minter.click();
                }
            }
        }
    }
}, {
    per: () => App.token
});
if (require.main === module) {
    const $minting = document.querySelector('form#minting');
    createRoot($minting!).render(createElement(Minting, {
        token: App.token
    }));
}
export default Minting;
