/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Global } from '../../../source/types';
declare const global: Global;

import { App } from '../../../source/app';
import { Tokenizer } from '../../../source/token';
import { Blockchain, Connect } from '../../../source/blockchain';
import { Alert } from '../../../source/functions';
import { alert } from '../../../source/functions';
import { HashManager } from '../../../source/managers';
import { IntervalManager } from '../../../source/managers';
import { Amount } from '../../../source/redux/types';
import { Nonce } from '../../../source/redux/types';
import { Token } from '../../../source/redux/types';
import { OnTransfer } from '../../../source/wallet';
import { OtfWallet, MoeWallet } from '../../../source/wallet';

const { Tooltip } = global.bootstrap as any;

$(window).on('load', function initMinters() {
    const { min, max } = App.level;
    $(`.mint[data-level=${min}]`).show();
    $(`.mint`).filter((i, el) => $(el).data('level') < min).remove();
    $(`.mint`).filter((i, el) => $(el).data('level') > max).remove();
});
$('#connect-metamask').on('connected', function updateMinters(
    ev, { address }: Connect
) {
    const update_total = (token: Token) => {
        const amount_min = Tokenizer.amount(token, App.level.min);
        const suffix = Tokenizer.suffix(token);
        return (
            nonce: Nonce, { amount }: { amount: Amount }, total: Amount
        ) => {
            const $mint = $(`.mint[data-amount-${suffix}=${amount}]`);
            $mint.find(`.nn-counter`).text(`${total / amount}`);
            $mint.find(`button`).prop('disabled', !total);
            if (total || amount === amount_min) {
                $mint.show();
            }
        };
    };
    App.onNonceChanged(address, update_total(App.token));
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
    const amount = Tokenizer.amount(App.token, level);
    const suffix = Tokenizer.suffix(App.token);
    const block_hash = HashManager.latestHash({
        slot: suffix
    });
    if (!block_hash) {
        throw new Error('missing block-hash');
    }
    const nonce = App.getNonceBy({ address, block_hash, amount });
    if (!nonce) {
        throw new Error(`missing nonce for amount=${amount}`);
    }
    const moe_wallet = new MoeWallet(address);
    try {
        const on_transfer: OnTransfer = async (from, to, amount, ev) => {
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
            address, block_hash
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
                    const miner = App.miner(address);
                    if (miner.running) miner.pause();
                }
            }
            if (ex.data && ex.data.message && ex.data.message.match(
                /empty nonce-hash/i
            )) {
                App.removeNonce(nonce, {
                    address, block_hash
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
$('#connect-metamask').on('connected', function autoMint(
    ev, { address }: Connect
) {
    const miner = App.miner(address);
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
});
$(window).on('load', async function forgetNonces() {
    if (await Blockchain.isInstalled()) {
        const im = new IntervalManager({ start: true });
        Blockchain.onceConnect(() => {
            im.on('tick', () => App.removeNonces());
        });
    }
});
$('.mint button.forget').on('click', async function forgetNonces(
    ev
) {
    const $forget = $(ev.target);
    const $mint = $forget.parents('.mint');
    const level = Number($mint.data('level'));
    const amount = Tokenizer.amount(App.token, level);
    const suffix = Tokenizer.suffix(App.token);
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const block_hash = HashManager.latestHash({
        slot: suffix
    });
    if (!block_hash) {
        throw new Error('missing block-hash');
    }
    App.removeNonceByAmount({
        address, block_hash, amount
    });
    Tooltip.getInstance($forget.parent('span')).hide();
});
