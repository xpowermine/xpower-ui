import { Global } from '../../../source/types';
declare const global: Global;

import { Address, Amount, Balance } from '../../../source/redux/types';
import { NftLevel, NftLevels } from '../../../source/redux/types';
import { MoeWallet, OnTransfer } from '../../../source/wallet';

$('#connect-metamask').on('connected', async function initAmounts(ev, {
    address
}: {
    address: Address
}) {
    const on_transfer: OnTransfer = async () => {
        const balance = await moe_wallet.balance;
        syncAmounts(balance);
    };
    const moe_wallet = new MoeWallet(address);
    moe_wallet.onTransfer(on_transfer);
    const balance = await moe_wallet.balance;
    syncAmounts(balance);
});
async function syncAmounts(
    balance: Balance
) {
    for (const level of NftLevels()) {
        const remainder = balance % 10n ** (BigInt(level) + 3n);
        const amount = remainder / 10n ** BigInt(level);
        sync(level, amount);
    }
    function sync(
        level: NftLevel, amount: Amount
    ) {
        const $nft_minter = $(`.nft-minter[data-level=${NftLevel[level]}]`);
        $nft_minter.find('.increase').prop('disabled', true);
        $nft_minter.find('.decrease').prop('disabled', amount === 0n);
        if (amount > 0) {
            const $toggle = $nft_minter.find('.toggle');
            if ($toggle.attr('data-state') === 'off') {
                $toggle.attr('data-state', 'on');
                $toggle.trigger('click');
            }
            $nft_minter.show();
        }
        const $amount = $nft_minter.find('.amount');
        $amount.data('max', `${amount}`);
        $amount.data('min', `${0}`);
        $amount.text(`${amount}`);
        $amount.trigger('change', {
            amount: amount,
            max: amount,
            min: 0
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
function increaseAmount(ev: JQuery.TriggeredEvent | WheelEvent) {
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
$('.amount').map((_, el) => el.addEventListener(
    'wheel', function increaseByWheel(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        if (ev.deltaY < 0) {
            increaseAmount(ev);
        }
        return false;
    }, {
        passive: false
    }
));
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
function decreaseAmount(ev: JQuery.TriggeredEvent | WheelEvent) {
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
$('.amount').map((_, el) => el.addEventListener(
    'wheel', function decreaseByWheel(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        if (ev.deltaY > 0) {
            decreaseAmount(ev);
        }
        return false;
    }, {
        passive: false
    }
));
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
