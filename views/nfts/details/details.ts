/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Global } from '../../../source/types';
declare const global: Global;

import { App } from '../../../source/app';
import { Blockchain } from '../../../source/blockchain';
import { Transaction } from 'ethers';
import { alert, Alert, x40 } from '../../../source/functions';
import { Amount, NftCoreId, Supply } from '../../../source/redux/types';
import { Nft, NftFullId } from '../../../source/redux/types';
import { NftLevel, NftLevels } from '../../../source/redux/types';
import { NftWallet, NftWalletMock } from '../../../source/wallet';
import { OnTransferSingle } from '../../../source/wallet';
import { DeltaYears } from '../../../source/years';

const { Tooltip } = global.bootstrap as any;

App.onNftChanged(async function setLevelDetails(
    id: NftFullId, { amount, supply }: {
        amount: Amount, supply: Supply
    }
) {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const $nft_details = $(
        `.nft-details[data-level=${NftLevel[Nft.level(id)]}]`
    );
    const $row = $nft_details.find(
        `.row[data-year=${Nft.issue(id)}]`
    );
    const $supply = $row.find('.nft-total-supply>input');
    $supply.val(supply.toString());
    $supply.trigger('change');
    const $balance = $row.find('.nft-balance>input');
    $balance.val(amount.toString());
    $balance.trigger('change');
});
$('.nft-minter').on('expanded', async function setImage(
    ev, { level }: { level: NftLevel }
) {
    const address = await Blockchain.selectedAddress;
    if (address) {
        await set_image(new NftWallet(address));
    } else {
        await set_image(new NftWalletMock());
    }
    async function set_image(nft_wallet: NftWallet) {
        const $nft_details = $(
            `.nft-details[data-level=${NftLevel[level]}]`
        );
        for (const dy of DeltaYears()) {
            const nft_year = await nft_wallet.year(dy);
            const nft_id = await nft_wallet.idBy(nft_year, level);
            const $row = $nft_details.find(
                `.row[data-year=${nft_year}]`
            );
            const meta = await nft_wallet.meta(nft_id);
            const $image = $row.find('.nft-image');
            if ($image.attr('src') !== meta.image) {
                $image.attr('src', meta.image);
                $image.show();
            }
        }
    }
});
$('.nft-image').on('load', async function clearImageSpinner(ev) {
    const $image = $(ev.target);
    $image.siblings('.spinner').hide();
});
$('.nft-image').on('load', async function setCollectionUrl(ev) {
    const $image = $(ev.target);
    const nft_id = $image.data('id');
    const url = await href(nft_id);
    if (url) {
        $image.parent('a').attr('href', url.toString());
        $image.css('cursor', 'pointer');
    }
    async function href(nft_id: NftCoreId): Promise<URL | null> {
        const address = await Blockchain.selectedAddress;
        if (!address) {
            throw new Error('missing selected-address');
        }
        const nft_wallet = new NftWallet(address);
        const supply = await nft_wallet.totalSupply(nft_id);
        if (supply > 0) {
            const market = 'https://nftrade.com/assets/avalanche';
            const nft_contract = await nft_wallet.contract.then((c) => c);
            return new URL(`${market}/${nft_contract.address}/${nft_id}`);
        }
        return null;
    }
});
$('.nft-balance>input').on(
    'change', enableTransferToAndAmount
);
function enableTransferToAndAmount(
    ev: JQuery.TriggeredEvent
) {
    const $balance = $(ev.target);
    const balance = BigInt($balance.val() as string);
    if (balance > 0) {
        const $row = $balance.parents('.row')
        const $transfer_to = $row.find('.nft-transfer-to>input');
        $transfer_to.prop('disabled', false);
        $transfer_to.css('cursor', 'text');
        const $transfer_amount = $row.find('.nft-transfer-amount>input');
        $transfer_amount.prop('disabled', false);
        $transfer_amount.css('cursor', 'text');
    }
}
$('.nft-transfer-to>input').on(
    'change', validateTransferTo
);
$('.nft-transfer-to>input').on(
    'input', validateTransferTo
);
async function validateTransferTo(ev: JQuery.TriggeredEvent) {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    // get tx-address:
    const $transfer_to = $(ev.target).parents('.nft-transfer-to');
    const $address_to = $transfer_to.find('>input');
    const address_to = $address_to.val() as string;
    // validate tx-address:
    if (!address_to) {
        $address_to.removeClass('is-valid');
        $address_to.removeClass('is-invalid');
    } else if (
        address_to.match(/^0x([0-9a-f]{40})/i) &&
        !address_to.match(new RegExp(x40(address), 'i'))
    ) {
        $address_to.addClass('is-valid');
        $address_to.removeClass('is-invalid');
    } else {
        $address_to.removeClass('is-valid');
        $address_to.addClass('is-invalid');
    }
}
$('.nft-transfer-to>input').on(
    'change', toggleSenderTxTo
);
$('.nft-transfer-to>input').on(
    'input', toggleSenderTxTo
);
function toggleSenderTxTo(ev: JQuery.TriggeredEvent) {
    // get tx-address:
    const $transfer_to = $(ev.target).parents('.nft-transfer-to');
    const $address_to = $transfer_to.find('>input');
    const address_to = $address_to.val() as string;
    // get tx-amount:
    const $transfer_amount = $transfer_to.siblings('.nft-transfer-amount');
    const $amount = $transfer_amount.find('>input');
    const amount = BigInt($amount.val() as string);
    // get nft-balance:
    const $nft_balance = $transfer_to.siblings('.nft-balance');
    const $balance = $nft_balance.find('>input');
    const balance = BigInt($balance.val() as string);
    // toggle sender:
    const $nft_sender = $transfer_to.siblings('.nft-sender');
    const $sender = $nft_sender.find('.sender');
    if (amount > 0 && amount <= balance &&
        address_to.match(/^0x([0-9a-f]{40})/i)
    ) {
        $sender.prop('disabled', false);
    } else {
        $sender.prop('disabled', true);
    }
}
$('.nft-transfer-amount>input').on(
    'change', validateTransferAmount
);
$('.nft-transfer-amount>input').on(
    'input', validateTransferAmount
);
function validateTransferAmount(ev: JQuery.TriggeredEvent) {
    // get tx-amount:
    const $transfer_amount = $(ev.target).parents('.nft-transfer-amount');
    const $amount = $transfer_amount.find('>input');
    const amount = BigInt($amount.val() as string);
    // get nft-balance:
    const $nft_balance = $transfer_amount.siblings('.nft-balance');
    const $balance = $nft_balance.find('>input');
    const balance = BigInt($balance.val() as string);
    // validate tx-amount:
    if (!$amount.val()) {
        $amount.removeClass('is-valid');
        $amount.removeClass('is-invalid');
    } else if (amount <= 0 || amount > balance) {
        $amount.removeClass('is-valid');
        $amount.addClass('is-invalid');
    } else {
        $amount.addClass('is-valid');
        $amount.removeClass('is-invalid');
    }
}
$('.nft-transfer-amount>input').on(
    'input', toggleSenderTxAmount
);
$('.nft-transfer-amount>input').on(
    'change', toggleSenderTxAmount
);
function toggleSenderTxAmount(ev: JQuery.TriggeredEvent) {
    // get tx-amount:
    const $transfer_amount = $(ev.target).parents('.nft-transfer-amount');
    const $amount = $transfer_amount.find('>input');
    const amount = BigInt($amount.val() as string);
    // get tx-address:
    const $transfer_to = $transfer_amount.siblings('.nft-transfer-to');
    const $address_to = $transfer_to.find('>input');
    const address_to = $address_to.val() as string;
    // get nft-balance:
    const $nft_balance = $transfer_amount.siblings('.nft-balance');
    const $balance = $nft_balance.find('>input');
    const balance = BigInt($balance.val() as string);
    // toggle sender:
    const $nft_sender = $transfer_amount.siblings('.nft-sender');
    const $sender = $nft_sender.find('.sender');
    if (amount > 0 && amount <= balance &&
        address_to.match(/^0x([0-9a-f]{40})/i)
    ) {
        $sender.prop('disabled', false);
    } else {
        $sender.prop('disabled', true);
    }
}
$('.nft-sender>.sender').on('click', async function transferNft(ev) {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const $nft_sender = $(ev.target).parents('.nft-sender');
    const id = $nft_sender.data('id') as NftCoreId;
    const level = $nft_sender.data('level') as NftLevels;
    const $sender = $nft_sender.find('.sender');
    const $transfer_to = $nft_sender.siblings('.nft-transfer-to');
    const $address_to = $transfer_to.find('>input');
    const address_to = BigInt($address_to.val() as string);
    const $transfer_amount = $nft_sender.siblings('.nft-transfer-amount');
    const $amount = $transfer_amount.find('>input');
    const amount = BigInt($amount.val() as string);
    const nft_wallet = new NftWallet(address);
    const on_single_tx: OnTransferSingle = async (
        op, from, to, id, value, ev
    ) => {
        if (ev.transactionHash !== tx?.hash) {
            return;
        }
        $sender.trigger('sent', { level, id });
    };
    let tx: Transaction | undefined;
    try {
        $('.alert').remove();
        $sender.trigger('sending', { level, id });
        nft_wallet.onTransferSingle(on_single_tx);
        tx = await nft_wallet.safeTransfer(
            address_to, id, amount
        );
    } catch (ex: any) {
        /* eslint no-ex-assign: [off] */
        if (ex.error) {
            ex = ex.error;
        }
        if (ex.message) {
            if (ex.data && ex.data.message) {
                const message = `${ex.message} [${ex.data.message}]`;
                const $alert = $(alert(message, Alert.warning));
                $alert.insertAfter($sender.parents('.row'));
                $alert.find('.alert').css('margin-top', '0.5em');
            } else {
                const $alert = $(alert(ex.message, Alert.warning));
                $alert.insertAfter($sender.parents('.row'));
                $alert.find('.alert').css('margin-top', '0.5em');
            }
        }
        $sender.trigger('error', {
            level, id, error: ex
        });
        console.error(ex);
    }
});
$(window).on('load', function toggleSender() {
    const $sender = $('.nft-sender>.sender');
    $sender.on('sending', (ev) => {
        $(ev.target).data('state', 'sending');
    });
    $sender.on('sent', (ev) => {
        $(ev.target).data('state', 'sent');
    });
    $sender.on('error', (ev) => {
        $(ev.target).data('state', 'error');
    });
    $sender.on('sending', disableSender);
    $sender.on('sent', disableSender);
    $sender.on('sent', resetAmount);
    $sender.on('error', enableSender);
    function enableSender(
        ev: JQuery.TriggeredEvent
    ) {
        const $sender = $(ev.target);
        $sender.prop('disabled', false);
    }
    function disableSender(
        ev: JQuery.TriggeredEvent
    ) {
        const $sender = $(ev.target);
        $sender.prop('disabled', true);
    }
    function resetAmount(
        ev: JQuery.TriggeredEvent
    ) {
        const $sender = $(ev.target);
        const $nft_sender = $sender.parents('.nft-sender');
        const $transfer_amount = $nft_sender.siblings('.nft-transfer-amount');
        const $amount = $transfer_amount.find('>input');
        $amount.removeClass('is-valid');
        $amount.removeClass('is-invalid');
        $amount.val('');
    }
});
$(window).on('load', function toggleSenderSpinner() {
    const $sender = $('.nft-sender>.sender');
    $sender.on('sending', showSpinner);
    $sender.on('error', hideSpinner);
    $sender.on('sent', hideSpinner);
    function showSpinner(
        ev: JQuery.TriggeredEvent, { level }: { level: string }
    ) {
        const $sender = $(ev.target);
        const $spinner = $sender.find('.spinner');
        $spinner.css('visibility', 'visible');
        $spinner.addClass('spinner-grow');
        $sender.prop('disabled', true);
        const $text = $sender.find('.text');
        $text.text(`Sending ${level} NFTs…`);
    }
    function hideSpinner(
        ev: JQuery.TriggeredEvent, { level }: { level: string }
    ) {
        const $sender = $(ev.target);
        const $spinner = $sender.find('.spinner');
        $spinner.css('visibility', 'hidden');
        $spinner.removeClass('spinner-grow');
        const $text = $sender.find('.text');
        $text.text(`Send ${level} NFTs`);
    }
});
$('.sender-expander').on('click', function showSender(ev) {
    const $expander = $(ev.target).parents('.nft-sender-expander');
    $expander.hide();
    const $transfer_label = $expander.siblings('.nft-transfer-to-label');
    $transfer_label.removeClass('d-none');
    const $transfer = $expander.siblings('.nft-transfer-to');
    $transfer.removeClass('d-none');
    const $amount_label = $expander.siblings('.nft-transfer-amount-label');
    $amount_label.removeClass('d-none');
    const $amount = $expander.siblings('.nft-transfer-amount');
    $amount.removeClass('d-none');
    const $sender = $expander.siblings('.nft-sender');
    $sender.removeClass('d-none');
});
$('.toggle-old').on('click', function toggleOldNfts(ev) {
    const $nft_details = $(ev.target).parents(`.nft-details`);
    const $rows_off = $nft_details.find(`.row.year[data-state=off]`);
    const $rules = $nft_details.find(`.row.year[data-state=off]+hr`);
    const state = $rows_off.data('state');
    if (state === 'off') {
        $rows_off.data('state', 'on');
    } else {
        $rows_off.data('state', 'off');
    }
    if (state === 'off') {
        $rows_off.show();
        $rules.show();
    } else {
        $rows_off.hide();
        $rules.hide();
    }
    const $rows_all = $nft_details.find('.row.year');
    const $toggles = $rows_all.find('.toggle-old');
    if (state === 'off') {
        $toggles.attr('title', 'Hide older NFTs');
        $toggles.each((_, el) => {
            Tooltip.getInstance(el)?.dispose();
            Tooltip.getOrCreateInstance(el);
        });
    } else {
        $toggles.attr('title', 'Show older NFTs');
        $toggles.each((_, el) => {
            Tooltip.getInstance(el)?.dispose();
            Tooltip.getOrCreateInstance(el);
        });
    }
    const $icons = $toggles.find('i');
    if (state === 'off') {
        $icons.removeClass('bi-eye-fill')
        $icons.addClass('bi-eye-slash-fill')
    } else {
        $icons.removeClass('bi-eye-slash-fill')
        $icons.addClass('bi-eye-fill')
    }
});
