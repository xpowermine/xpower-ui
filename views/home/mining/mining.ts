import { Global } from '../../../source/types';
declare const global: Global;
import './mining-speed';

import { App } from '../../../source/app';
import { Tokenizer } from '../../../source/token';
import { Blockchain } from '../../../source/blockchain';
import { Connect } from '../../../source/blockchain';
import { Reconnect } from '../../../source/blockchain';
import { x64 } from '../../../source/functions';
import { HashManager } from '../../../source/managers';
import { IntervalManager } from '../../../source/managers';
import { Address } from '../../../source/redux/types';
import { BlockHash } from '../../../source/redux/types';
import { OnInit } from '../../../source/wallet';
import { MoeWallet } from '../../../source/wallet';

$(window).on('load', async function refreshBlockHash() {
    if (Blockchain.isInstalled()) {
        Blockchain.onceConnect(({ address }) => {
            const on_init: OnInit = (block_hash, timestamp) => {
                console.debug('[on:init]', x64(block_hash), timestamp);
                const suffix = Tokenizer.suffix(App.token);
                HashManager.set(block_hash, timestamp, {
                    slot: suffix
                });
            };
            const wallet = new MoeWallet(address);
            wallet.onInit(on_init);
        });
    }
});
$(window).on('load', function restartMining() {
    if (Blockchain.isInstalled()) {
        const im = new IntervalManager({ start: true });
        Blockchain.onceConnect(({ address }: Connect) => {
            im.on('tick', async () => {
                const miner = App.miner(address);
                const running = miner.running;
                if (running) {
                    await miner.stop();
                }
                if (running) {
                    $('#toggle-mining').trigger('click');
                }
            });
        });
    }
});
$('#toggle-mining').on('click', async function toggleMining() {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const miner = App.miner(address);
    if (miner.running) {
        return miner.stop();
    }
    miner.emit('initializing', {
        block_hash: null
    });
    //
    // if: recent(block-hash?) => mine
    //
    const suffix = Tokenizer.suffix(App.token);
    const block_hash = HashManager.latestHash({
        slot: suffix
    });
    if (block_hash !== null) {
        const timestamp = HashManager.get(block_hash, {
            slot: suffix
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
    const moe_wallet = new MoeWallet(address);
    try {
        const init = await moe_wallet.init();
        console.debug('[init]', init);
    } catch (ex) {
        HashManager.me.removeAllListeners('block-hash');
        miner.emit('initialized', { block_hash: null });
        console.error(ex);
    }
    async function mine(
        address: Address, block_hash: BlockHash
    ) {
        miner.emit('initialized', { block_hash });
        const { min, max } = App.amount;
        if (miner.running) {
            await miner.stop();
        }
        miner.start(block_hash, ({ nonce, amount, worker }) => {
            if (amount >= min && amount <= max) {
                App.addNonce(nonce, {
                    address, block_hash, amount, worker
                });
            }
        });
    }
});
$(window).on('load', function resetMiningToggle() {
    if (Blockchain.isInstalled()) {
        Blockchain.onConnect(reset);
        Blockchain.onReconnect(({ address }: Reconnect) => {
            const miner = App.miner(address);
            if (!miner.running) {
                reset();
            }
        });
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
$('#connect-metamask').on('connected', async function toggleMiningSpinner(
    ev, { address }: Connect
) {
    const $mine = $('#toggle-mining');
    const $text = $mine.find('.text');
    const $spinner = $mine.find('.spinner');
    const miner = App.miner(address);
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
});
$('#connect-metamask').on('connected', async function benchmarkMining(
    ev, { address }: Connect
) {
    const miner = App.miner(address);
    global.ON_STARTED = global.ON_STARTED ?? function (
        { now: beg_ms }: { now: number; }
    ) {
        global.OFF_STARTED = global.OFF_STARTED ?? function (
            { now: end_ms }: { now: number; }
        ) {
            const ms = (end_ms - beg_ms).toFixed(3);
            console.debug('[mining.duration]', ms, '[ms]');
        };
        miner.off('stopped', global.OFF_STARTED);
        miner.once('stopped', global.OFF_STARTED);
    };
    miner.off('started', global.ON_STARTED);
    miner.on('started', global.ON_STARTED);
});
