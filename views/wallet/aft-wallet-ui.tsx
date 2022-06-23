import { App } from '../../source/app';
import { Blockchain } from '../../source/blockchain';
import { x40 } from '../../source/functions';
import { Address, Amount, Token } from '../../source/redux/types';
import { MoeWallet, OnTransfer } from '../../source/wallet';
import { Tooltip } from '../tooltips';

import React from 'react';
import { InfoCircle } from '../../public/images/tsx';

export class AftWalletUi extends React.Component<{
    onToggled: (toggled: boolean) => void,
    toggled: boolean,
    token: Token,
}, {
    address: Address | null,
    amount: Amount | null,
    token: Token,
}> {
    constructor(props: {
        onToggled: (toggled: boolean) => void,
        toggled: boolean,
        token: Token,
    }) {
        super(props);
        this.state = {
            address: null, amount: null, ...this.props
        };
        this.events();
    }
    events() {
        Blockchain.onceConnect(function onTransfer({
            address, token
        }) {
            const on_transfer: OnTransfer = async (
                from, to, amount
            ) => {
                if (App.token !== token) {
                    return;
                }
                console.debug(
                    '[on:transfer]', x40(from), x40(to), amount
                );
                if (address === from || address === to) {
                    const [amount, supply] = await Promise.all([
                        moe_wallet.balance, moe_wallet.supply
                    ]);
                    App.setToken(token, { amount, supply });
                }
            };
            const moe_wallet = new MoeWallet(address, token);
            moe_wallet.onTransfer(on_transfer);
        }, {
            per: () => App.token
        });
        Blockchain.onceConnect(async function initialize({
            address, token
        }) {
            const moe_wallet = new MoeWallet(address, token);
            const [amount, supply] = await Promise.all([
                moe_wallet.balance, moe_wallet.supply
            ]);
            App.setToken(token, { amount, supply });
        }, {
            per: () => App.token
        });
        Blockchain.onConnect(function synchronize({
            token
        }) {
            const tokens = App.getTokens(token);
            const item = tokens.items[token];
            if (item) {
                App.setToken(token, item);
            }
        });
        Blockchain.onceConnect(({ address }) =>
            this.setState({ address })
        );
        App.onTokenSwitch((token) =>
            this.setState({ token })
        );
        App.onTokenChanged((token: Token, {
            amount
        }) => {
            if (token === this.state.token) {
                this.setState({ amount });
            }
        });
    }
    render() {
        const { address, amount, token } = this.state;
        const { toggled } = this.props;
        return <form
            id='aft-wallet' onSubmit={(e) => e.preventDefault()}
        >
            <label className='form-label'>
                Wallet Address and {token} Balance
            </label>
            <div className='input-group wallet-address'>
                {this.$toggle(toggled)}
                {this.$address(address)}
                {this.$balance(amount, token)}
                {this.$info(token)}
            </div>
        </form>;
    }
    $toggle(
        toggled: boolean
    ) {
        return <button
            className='form-control input-group-text'
            data-bs-toggle='tooltip' data-bs-placement='top'
            id='otf-wallet-toggle'
            onClick={this.toggle.bind(this, toggled)}
            role='button'
            title={this.title(toggled)}
        >
            <i className={this.icon(toggled)} />
        </button>;
    }
    toggle(
        toggled: boolean
    ) {
        this.props.onToggled(!toggled);
    }
    title(
        toggled: boolean
    ) {
        if (toggled) {
            return 'Disable minter wallet & hide balance of AVAX';
        } else {
            return 'Enable minter wallet & show balance of AVAX';
        }
    }
    icon(
        toggled: boolean
    ) {
        return toggled ? 'bi-wallet2' : 'bi-wallet';
    }
    $address(
        address: Address | null
    ) {
        return <input readOnly
            className='form-control' id='aft-wallet-address'
            data-bs-toggle='tooltip' data-bs-placement='top'
            title='Wallet address' type='text'
            value={x40(address ?? 0n)}
        />;
    }
    $balance(
        amount: Amount | null, token: Token
    ) {
        return <input readOnly
            className='form-control' id='aft-wallet-balance'
            data-bs-toggle='tooltip' data-bs-placement='top'
            type='text' value={(amount ?? 0n).toString()}
            title={`Balance of proof-of-work ${token} tokens`}
        />;
    }
    $info(
        token: Token
    ) {
        return <button
            className='form-control input-group-text info'
            data-bs-toggle='tooltip' data-bs-placement='top'
            role='tooltip'
            title={`Wallet address & balance of ${token} tokens`}
        >
            {InfoCircle({ fill: true })}
        </button>;
    }
    componentDidUpdate() {
        const $otf_toggle = document.getElementById(
            'otf-wallet-toggle'
        );
        if ($otf_toggle) setTimeout(() => {
            Tooltip.getInstance($otf_toggle)?.dispose();
            Tooltip.getOrCreateInstance($otf_toggle);
        }, 200);
    }
}
export default AftWalletUi;
