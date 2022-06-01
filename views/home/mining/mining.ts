/* eslint @typescript-eslint/no-explicit-any: [off] */
import './mining-speed';

import { App } from '../../../source/app';
import { Tokenizer } from '../../../source/token';
import { Blockchain } from '../../../source/blockchain';
import { alert, Alert, x64 } from '../../../source/functions';
import { HashManager } from '../../../source/managers';
import { IntervalManager } from '../../../source/managers';
import { Address, Token, Tokens } from '../../../source/redux/types';
import { BlockHash } from '../../../source/redux/types';
import { OnInit } from '../../../source/wallet';
import { MoeWallet } from '../../../source/wallet';

Blockchain.onceConnect(function refreshBlockHash({
    address, token
}) {
    const on_init: OnInit = async (block_hash, timestamp, ev) => {
        const contract = await moe_wallet.contract;
        if (contract.address === ev.address) {
            console.debug('[on:init]', x64(block_hash), timestamp, ev);
        } else {
            return;
        }
        const token_lc = Tokenizer.lower(token);
        HashManager.set(block_hash, timestamp, {
            slot: token_lc
        });
    };
    const moe_wallet = new MoeWallet(address, token);
    moe_wallet.onInit(on_init);
}, {
    per: () => App.token
});
Blockchain.onceConnect(function restartMining({
    address, token
}) {
    const im = new IntervalManager({ start: true });
    im.on('tick', async () => {
        const miner = App.miner(address, {
            token
        });
        const running = miner.running;
        if (running) {
            await miner.stop();
        }
        if (running) {
            $('#toggle-mining').trigger('click');
        }
    });
});
Blockchain.onConnect(function stopMining({
    address
}) {
    for (const token of Tokens()) {
        if (token === Token.HELA) {
            continue;
        }
        const miner = App.miner(address, {
            token
        });
        const running = miner.running;
        if (running) miner.stop();
    }
});
$('#toggle-mining').on('click', async function toggleMining() {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const token = App.token;
    const token_lc = Tokenizer.lower(token);
    const miner = App.miner(address, {
        token
    });
    if (miner.running) {
        return await miner.stop();
    }
    miner.emit('initializing', {
        block_hash: null
    });
    //
    // if: recent(block-hash?) => mine
    //
    const block_hash = HashManager.latestHash({
        slot: token_lc
    });
    if (block_hash !== null) {
        const timestamp = HashManager.get(block_hash, {
            slot: token_lc
        });
        if (timestamp !== null) {
            const interval = IntervalManager.intervalFrom(
                new Date(Number(timestamp) * 1000)
            );
            if (interval === IntervalManager.interval) {
                return mine(address, block_hash);
            }
        }
    }
    //
    // else: !recent(block-hash?) => init & mine
    //
    HashManager.me.once('block-hash', ({
        block_hash
    }: {
        block_hash: BlockHash;
    }) => {
        mine(address, block_hash);
    });
    const moe_wallet = new MoeWallet(address, token);
    try {
        const init = await moe_wallet.init();
        console.debug('[init]', init);
    } catch (ex: any) {
        /* eslint no-ex-assign: [off] */
        if (ex.error) {
            ex = ex.error;
        }
        if (ex.message) {
            if (ex.data && ex.data.message) {
                const message = `${ex.message} [${ex.data.message}]`;
                const $alert = $(alert(message, Alert.warning));
                $alert.insertAfter($('#toggle-mining').parent('div'));
                $alert.find('.alert').css('margin', '1em 0 0');
            } else {
                const $alert = $(alert(ex.message, Alert.warning));
                $alert.insertAfter($('#toggle-mining').parent('div'));
                $alert.find('.alert').css('margin', '1em 0 0');
            }
        }
        HashManager.me.removeAllListeners('block-hash');
        miner.emit('initialized', { block_hash: null });
        console.error(ex);
    }
    async function mine(
        address: Address, block_hash: BlockHash
    ) {
        miner.emit('initialized', { block_hash });
        const { min, max } = App.range(token);
        if (miner.running) {
            await miner.stop();
        }
        miner.start(block_hash, ({
            amount, nonce, worker
        }) => {
            if (amount >= min &&
                amount <= max
            ) {
                App.addNonce(nonce, {
                    address,
                    amount,
                    block_hash,
                    token,
                    worker,
                });
            }
        });
    }
});
Blockchain.onConnect(function resetMiningToggle({
    address, token
}) {
    const miner = App.miner(address, {
        token
    });
    if (!miner.running) {
        reset();
    }
    function reset() {
        const $mine = $('#toggle-mining');
        $mine.prop('disabled', false);
        const $spinner = $mine.find('.spinner');
        $spinner.css('visibility', 'hidden');
        $spinner.removeClass('spinner-grow');
        const $text = $mine.find('.text');
        $text.text('Start Mining');
    }
});
Blockchain.onceConnect(async function toggleMiningSpinner({
    address, token
}) {
    const $mine = $('#toggle-mining');
    const $text = $mine.find('.text');
    const $spinner = $mine.find('.spinner');
    const miner = App.miner(address, {
        token
    });
    miner.on('initializing', () => {
        $spinner.css('visibility', 'visible');
        $spinner.addClass('spinner-grow');
        $mine.prop('disabled', true);
        $text.text('Initializing Mining…');
    });
    miner.on('initialized', () => {
        $spinner.css('visibility', 'hidden');
        $spinner.removeClass('spinner-grow');
        $mine.prop('disabled', false);
        $text.text('Start Mining');
    });
    miner.on('starting', () => {
        $spinner.css('visibility', 'visible');
        $spinner.addClass('spinner-grow');
        $mine.prop('disabled', true);
        $text.text('Starting Mining…');
    });
    miner.on('started', () => {
        $spinner.removeClass('spinner-grow');
        $mine.prop('disabled', false);
        $text.text('Stop Mining');
        $spinner.css('visibility', 'visible');
    });
    miner.on('stopped', () => {
        $text.text('Start Mining');
        $spinner.css('visibility', 'hidden');
    });
    miner.on('paused', () => {
        $spinner.css('visibility', 'visible');
        $spinner.addClass('spinner-grow');
    });
    miner.on('resumed', () => {
        $spinner.css('visibility', 'visible');
        $spinner.removeClass('spinner-grow');
    });
}, {
    per: () => App.token
});
Blockchain.onceConnect(function benchmarkMining({
    address, token
}) {
    const miner = App.miner(address, {
        token
    });
    miner.on('started', function (
        { now: beg_ms }: { now: number; }
    ) {
        miner.once('stopped', function (
            { now: end_ms }: { now: number; }
        ) {
            const ms = (end_ms - beg_ms).toFixed(3);
            console.debug('[mining.duration]', ms, '[ms]');
        });
    });
}, {
    per: () => App.token
});
