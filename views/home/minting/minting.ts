/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Global } from '../../../source/types';
declare const global: Global;

import { App } from '../../../source/app';
import { Blockchain } from '../../../source/blockchain';
import { Alert, alert } from '../../../source/functions';
import { HashManager, IntervalManager } from '../../../source/managers';
import { Tooltip } from '../../tooltips';
import { Tokenizer } from '../../../source/token';
import { Amount, Nonce } from '../../../source/redux/types';
import { MoeWallet, OnTransfer, OtfWallet } from '../../../source/wallet';

$(window).on('load', function initMinters() {
    resetMinters(App.level);
});
App.onTokenSwitch(function syncMinters() {
    resetMinters(App.level);
});
App.onTokenSwitched(function syncMinters() {
    App.removeNonces();
});
function resetMinters(
    { min, max }: { min: number, max: number }
) {
    const $mint = $('.mint');
    $mint.filter(`[data-level=${min}]`).show();
    $mint.filter((_, el) => $(el).data('level') < min).remove();
    $mint.filter((_, el) => $(el).data('level') > max).remove();
    $mint.each((i, el) => resetMinter(i, $(el)));
}
function resetMinter(
    i: number, $mint: JQuery
) {
    if (i > App.level.min) {
        $mint.hide();
    }
    const token = App.token;
    const level = $mint.data('level');
    const amount = Tokenizer.amount(token, level);
    $mint.find('.minter').html(
        `Mine ${amount} <span class="d-none d-sm-inline">${token}</span>`
    );
    $mint.find('.nn-counter').html('0');
    $mint.find('.tx-counter').html('0');
    $mint.find('.btn').prop('disabled', true);
}
Blockchain.onceConnect(function syncMinters({
    address
}) {
    App.onNonceChanged(address, (
        nonce: Nonce, { amount }: { amount: Amount }, total: Amount
    ) => {
        const token = App.token; // *deferred*!
        const token_lc = Tokenizer.lower(token);
        const amount_min = Tokenizer.amount(token, App.level.min);
        const $mint = $(`.mint[data-amount-${token_lc}=${amount}]`);
        $mint.find(`.nn-counter`).text(`${total / amount}`);
        $mint.find(`button`).prop('disabled', !total);
        if (total || amount === amount_min) {
            $mint.show();
        }
    });
});
$('.mint>button.minter').on('click', async function mint(
    ev
) {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const $alerts = $('.alert');
    if ($alerts.length) {
        $alerts.remove();
    }
    const $mint = $(ev.target).parent('.mint');
    const level = Number($mint.data('level'));
    const token = App.token;
    const token_lc = Tokenizer.lower(token);
    const amount = Tokenizer.amount(token, level);
    const block_hash = HashManager.latestHash({
        slot: token_lc
    });
    if (!block_hash) {
        throw new Error('missing block-hash');
    }
    const nonce = App.getNonceBy({
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
            if (ev.transactionHash === mint.hash) {
                moe_wallet.offTransfer(on_transfer);
                decreaseTxCounter($mint);
            }
        };
        const mint = await moe_wallet.mint(block_hash, nonce);
        moe_wallet.onTransfer(on_transfer);
        console.debug('[mint]', mint);
        increaseTxCounter($mint);
        App.removeNonce(nonce, {
            address, block_hash, token
        });
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
                    const miner = App.miner(address, {
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
                const message = `${ex.message} [${ex.data.message}]`;
                const $alert = $(alert(message, Alert.warning, {
                    id: `${nonce}`
                }));
                $alert.insertAfter($mint);
            } else {
                const $alert = $(alert(ex.message, Alert.warning, {
                    id: `${nonce}`
                }));
                $alert.insertAfter($mint);
            }
        }
        console.error(ex);
    }
});
function increaseTxCounter($mint: JQuery<HTMLElement>) {
    const counter = Number($mint.data('tx-counter')) + 1;
    $mint.find('.tx-counter').text(counter);
    $mint.data('tx-counter', counter);
}
function decreaseTxCounter($mint: JQuery<HTMLElement>) {
    const counter = Number($mint.data('tx-counter')) - 1;
    $mint.find('.tx-counter').text(counter);
    $mint.data('tx-counter', counter);
}
Blockchain.onceConnect(function autoMint({
    address, token
}) {
    const miner = App.miner(address, {
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
            const $minters = $('.minter').filter((i, el) => {
                return !$(el).prop('disabled');
            });
            $minters.trigger('click');
        }
    }
}, {
    per: () => App.token
});
Blockchain.onceConnect(function forgetNonces() {
    const im = new IntervalManager({ start: true });
    im.on('tick', () => App.removeNonces());
});
$('.mint button.forget').on('click', async function forgetNonces(
    ev
) {
    const $forget = $(ev.target);
    const $mint = $forget.parents('.mint');
    const level = Number($mint.data('level'));
    const token = App.token;
    const token_lc = Tokenizer.lower(token);
    const amount = Tokenizer.amount(token, level);
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const block_hash = HashManager.latestHash({
        slot: token_lc
    });
    if (!block_hash) {
        throw new Error('missing block-hash');
    }
    App.removeNonceByAmount({
        address, block_hash, amount, token
    });
    const [tip] = $forget.parent('span');
    Tooltip.getInstance(tip)?.hide();
});
