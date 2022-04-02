/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Global } from '../../../source/types';
declare const global: Global;

import { App } from '../../../source/app';
import { buffered } from '../../../source/functions';
import { Amount, NftLevel, NftLevels } from '../../../source/redux/types';

const { Tooltip } = global.bootstrap as any;

$('#connect-metamask').on('connected', async function initAmounts() {
    const nft_wait = new Promise<void>((resolve) => {
        const un = App.onNftChanged(buffered(() => {
            un(); resolve();
        }));
    });
    const ppt_wait = new Promise<void>((resolve) => {
        const un = App.onPptChanged(buffered(() => {
            un(); resolve();
        }));
    });
    await Promise.all([nft_wait, ppt_wait]).then(
        syncAmounts
    );
    App.onNftChanged(syncAmounts);
    App.onPptChanged(syncAmounts);
});
async function syncAmounts() {
    for (const level of NftLevels()) {
        const nft_total = App.getNftTotalBy({ level });
        const ppt_total = App.getPptTotalBy({ level });
        sync(level, nft_total, ppt_total);
    }
    function sync(
        level: NftLevel,
        { amount: nft_amount }: { amount: Amount },
        { amount: ppt_amount }: { amount: Amount },
    ) {
        const $nft_minter = $(`.nft-minter[data-level=${NftLevel[level]}]`);
        $nft_minter.find('.increase').prop(
            'disabled', true
        );
        $nft_minter.find('.decrease').prop(
            'disabled', nft_amount === 0n && ppt_amount === 0n
        );
        if (nft_amount > 0) {
            const $toggle = $nft_minter.find('.toggle');
            if ($toggle.attr('data-state') === 'off') {
                $toggle.attr('data-state', 'on');
                $toggle.trigger('click');
            }
            $nft_minter.show();
        }
        const $amount = $nft_minter.find('.amount');
        $amount.data('max', `${nft_amount}`);
        $amount.data('min', `${-ppt_amount}`);
        $amount.text(`${nft_amount}`);
        $amount.trigger('change', {
            amount: nft_amount,
            max: nft_amount,
            min: -ppt_amount
        });
    }
}
$('.increase')
    .on('mousedown', startIncreaseAmount)
    .on('touchstart', startIncreaseAmount);
$('.increase')
    .on('mouseup', stopIncreaseAmount)
    .on('touchend', stopIncreaseAmount)
    .on('touchcancel', stopIncreaseAmount);
function startIncreaseAmount(ev: JQuery.TriggeredEvent) {
    if (global.TID_INCREASE) {
        clearTimeout(global.TID_INCREASE);
        delete global.TID_INCREASE;
    }
    global.TID_INCREASE = setTimeout(() => {
        if (global.IID_INCREASE) {
            clearTimeout(global.IID_INCREASE);
            delete global.IID_INCREASE;
        }
        global.IID_INCREASE = setInterval(() => {
            increaseAmount(ev);
        }, 10);
    }, 600);
    increaseAmount(ev);
    return false;
}
function stopIncreaseAmount() {
    if (global.TID_INCREASE) {
        clearTimeout(global.TID_INCREASE);
        delete global.TID_INCREASE;
    }
    if (global.IID_INCREASE) {
        clearTimeout(global.IID_INCREASE);
        delete global.IID_INCREASE;
    }
    return false;
}
function increaseAmount(ev: JQuery.TriggeredEvent) {
    const delta = BigInt(ev.ctrlKey ? 100 : ev.shiftKey ? 10 : 1);
    const $nft_minter = $(ev.target).parents('.nft-minter');
    const $amount = $nft_minter.find('.amount');
    const amount = BigInt($amount.text());
    const max = BigInt($amount.data('max'));
    const min = BigInt($amount.data('min'));
    if (amount + delta <= max) {
        $amount.text(`${amount + delta}`);
        $amount.trigger('change', {
            amount: amount + delta, max, min
        });
    }
}
$('.decrease')
    .on('mousedown', startDecreaseAmount)
    .on('touchstart', startDecreaseAmount);
$('.decrease')
    .on('mouseup', stopDecreaseAmount)
    .on('touchend', stopDecreaseAmount)
    .on('touchcancel', stopDecreaseAmount);
function startDecreaseAmount(ev: JQuery.TriggeredEvent) {
    if (global.TID_DECREASE) {
        clearTimeout(global.TID_DECREASE);
        delete global.TID_DECREASE;
    }
    global.TID_DECREASE = setTimeout(() => {
        if (global.IID_DECREASE) {
            clearTimeout(global.IID_DECREASE);
            delete global.IID_DECREASE;
        }
        global.IID_DECREASE = setInterval(() => {
            decreaseAmount(ev);
        }, 10);
    }, 600);
    decreaseAmount(ev);
    return false;
}
function stopDecreaseAmount() {
    if (global.TID_DECREASE) {
        clearTimeout(global.TID_DECREASE);
        delete global.TID_DECREASE;
    }
    if (global.IID_DECREASE) {
        clearTimeout(global.IID_DECREASE);
        delete global.IID_DECREASE;
    }
    return false;
}
function decreaseAmount(ev: JQuery.TriggeredEvent) {
    const delta = BigInt(ev.ctrlKey ? 100 : ev.shiftKey ? 10 : 1);
    const $nft_minter = $(ev.target).parents('.nft-minter');
    const $amount = $nft_minter.find('.amount');
    const amount = BigInt($amount.text());
    const max = BigInt($amount.data('max'));
    const min = BigInt($amount.data('min'));
    if (amount - delta >= min) {
        $amount.text(`${amount - delta}`);
        $amount.trigger('change', {
            amount: amount - delta, max, min
        });
    }
}
$('.amount').on('click', function toggleAmount(ev) {
    const $nft_minter = $(ev.target).parents('.nft-minter');
    const $amount = $nft_minter.find('.amount');
    const amount = BigInt($amount.text());
    const max = BigInt($amount.data('max'));
    const min = BigInt($amount.data('min'));
    if (amount === max) {
        $amount.text(`${min}`);
        $amount.trigger('change', {
            amount: min, max, min
        });
    }
    if (amount === min || amount < max) {
        $amount.text(`${max}`);
        $amount.trigger('change', {
            amount: max, max, min
        });
    }
});
$('.amount').on('change', function onAmountChanged(ev, {
    amount, max, min
}: {
    amount: Amount, max: Amount, min: Amount
}) {
    if (amount >= max) {
        if (global.TID_INCREASE) {
            clearTimeout(global.TID_INCREASE);
            delete global.TID_INCREASE;
        }
        if (global.IID_INCREASE) {
            clearTimeout(global.IID_INCREASE);
            delete global.IID_INCREASE;
        }
    }
    if (amount <= min) {
        if (global.TID_DECREASE) {
            clearTimeout(global.TID_DECREASE);
            delete global.TID_DECREASE;
        }
        if (global.IID_DECREASE) {
            clearTimeout(global.IID_DECREASE);
            delete global.IID_DECREASE;
        }
    }
    const $nft_minter = $(ev.target).parents('.nft-minter');
    const $increase = $nft_minter.find('.increase');
    $increase.prop('disabled', amount >= max);
    const $decrease = $nft_minter.find('.decrease');
    $decrease.prop('disabled', amount <= min);
});
$('.amount').on('change', function onAmountChanged(ev, {
    amount
}: {
    amount: Amount
}) {
    const $nft_minter = $(ev.target).parents('.nft-minter');
    const $amount = $nft_minter.find('.amount');
    const $minter = $nft_minter.find('.minter');
    const level = $nft_minter.data('level');
    if (amount > 0) {
        $amount.attr('title', `${level} NFTs to stake`);
        $minter.attr('title', `Stake ${level} NFTs`);
    } else if (amount < 0) {
        $amount.attr('title', `${level} NFTs to unstake`);
        $minter.attr('title', `Unstake ${level} NFTs`);
    } else {
        $amount.attr('title', `${level} NFTs to (un)stake`);
        $minter.attr('title', `(Un)stake ${level} NFTs`);
    }
    Tooltip.getInstance($amount).dispose();
    Tooltip.getOrCreateInstance($amount);
    Tooltip.getInstance($minter).dispose();
    Tooltip.getOrCreateInstance($minter);
});
