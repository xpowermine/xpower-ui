/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Global } from '../../../source/types';
declare const global: Global;

import { App } from '../../../source/app';
import { Blockchain } from '../../../source/blockchain';
import { MoeTreasuryFactory, OnClaim } from '../../../source/contract';
import { Transaction } from 'ethers';
import { alert, Alert, x40 } from '../../../source/functions';
import { Amount, NftCoreId, Supply } from '../../../source/redux/types';
import { Nft, NftFullId } from '../../../source/redux/types';
import { NftLevel } from '../../../source/redux/types';
import { OtfWallet, PptWallet, PptWalletMock } from '../../../source/wallet';
import { DeltaYears } from '../../../source/years';

const { Tooltip } = global.bootstrap as any;

App.onPptChanged(async function setLevelDetails(
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
    const moe_treasury = MoeTreasuryFactory();
    const nft_id = Nft.coreId({
        issue: Nft.issue(id),
        level: Nft.level(id)
    });
    const $claimed = $row.find('.nft-claimed>input');
    const claimed = await moe_treasury.then((c) => c?.claimedFor(
        x40(address), nft_id
    ));
    $claimed.val(claimed.toString());
    $claimed.trigger('change');
    const $claimable = $row.find('.nft-claimable>input');
    const claimable = await moe_treasury.then((c) => c?.claimableFor(
        x40(address), nft_id
    ));
    $claimable.val(claimable.toString());
    $claimable.trigger('change');
});
$('.nft-minter').on('expanded', async function setImage(
    ev, { level }: { level: NftLevel }
) {
    const address = await Blockchain.selectedAddress;
    if (address) {
        await set_image(new PptWallet(address));
    } else {
        await set_image(new PptWalletMock());
    }
    async function set_image(nft_wallet: PptWallet) {
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
$('.nft-image').on('click', async function openCollection(ev) {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const $image = $(ev.target);
    const nft_id = $image.data('id');
    const nft_wallet = new PptWallet(address);
    const supply = await nft_wallet.totalSupply(nft_id);
    if (supply > 0) {
        $image.css('cursor', 'pointer');
    } else {
        $image.css('cursor', 'not-allowed');
    }
    if (supply > 0) {
        const market = 'https://nftrade.com/assets/avalanche';
        const nft_contract = await nft_wallet.contract.then((c) => c);
        open(`${market}/${nft_contract.address}/${nft_id}`);
    }
});
$('.nft-claimer>.claimer').on('click', async function claimRewards(ev) {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const $nft_claimer = $(ev.target).parents(`.nft-claimer`);
    const id = $nft_claimer.data('id') as NftCoreId;
    const $claimer = $nft_claimer.find('.claimer');
    const moe_treasury = MoeTreasuryFactory();
    const on_claim_tx: OnClaim = async (
        acc, id, amount, ev
    ) => {
        if (ev.transactionHash !== tx?.hash) {
            return;
        }
        $claimer.trigger('claimed', { id });
    };
    let tx: Transaction | undefined;
    try {
        $('.alert').remove();
        $claimer.trigger('claiming', { id });
        moe_treasury.then((c) => c?.on('Claim', on_claim_tx));
        const contract = await OtfWallet.connect(
            await moe_treasury
        );
        tx = await contract.claimFor(
            x40(address), id
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
                $alert.insertAfter($claimer.parents('.row'));
                $alert.find('.alert').css('margin-top', '0.5em');
            } else {
                const $alert = $(alert(ex.message, Alert.warning));
                $alert.insertAfter($claimer.parents('.row'));
                $alert.find('.alert').css('margin-top', '0.5em');
            }
        }
        $claimer.trigger('error', {
            id, error: ex
        });
        console.error(ex);
    }
});
$('.nft-claimable>input').on('change', function toggleClaimer(ev) {
    const $nft_claimable = $(ev.target).parents(`.nft-claimable`);
    const $claimable = $nft_claimable.find('input');
    const claimable = BigInt($claimable.val() as string);
    const $nft_claimer = $nft_claimable.next('.nft-claimer');
    const $claimer = $nft_claimer.find('.claimer');
    const claiming = $claimer.data('state') === 'claiming';
    $claimer.prop('disabled', claiming || claimable === 0n);
});
$(window).on('load', async function toggleClaimer() {
    const $claimer = $('.nft-claimer>.claimer');
    $claimer.on('claiming', (ev) => {
        $(ev.target).data('state', 'claiming');
    });
    $claimer.on('claimed', (ev) => {
        $(ev.target).data('state', 'claimed');
    });
    $claimer.on('error', (ev) => {
        $(ev.target).data('state', 'error');
    });
    $claimer.on('claiming', disableClaimer);
    $claimer.on('claimed', disableClaimer);
    $claimer.on('claimed', refreshClaimed);
    $claimer.on('claimed', refreshClaimable);
    $claimer.on('refresh', refreshClaimable);
    $claimer.on('error', enableClaimer);
    function enableClaimer(
        ev: JQuery.TriggeredEvent
    ) {
        const $claimer = $(ev.target);
        $claimer.prop('disabled', false);
    }
    function disableClaimer(
        ev: JQuery.TriggeredEvent
    ) {
        const claimer = $(ev.target);
        claimer.prop('disabled', true);
    }
    async function refreshClaimed(
        ev: JQuery.TriggeredEvent, { id }: {
            id: NftCoreId
        }
    ) {
        const address = await Blockchain.selectedAddress;
        if (!address) {
            throw new Error('missing selected-address');
        }
        const $claimer = $(ev.target);
        const $nft_claimer = $claimer.parents('.nft-claimer');
        const moe_treasury = MoeTreasuryFactory();
        const claimed = await moe_treasury.then((c) => c?.claimedFor(
            x40(address), id
        ));
        const $nft_claimed = $nft_claimer.siblings('.nft-claimed');
        const $claimed = $nft_claimed.find('>input');
        $claimed.val(claimed.toString());
        $claimed.trigger('change');
    }
    async function refreshClaimable(
        ev: JQuery.TriggeredEvent, { id }: {
            id: NftCoreId
        }
    ) {
        const address = await Blockchain.selectedAddress;
        if (!address) {
            throw new Error('missing selected-address');
        }
        const $claimer = $(ev.target);
        const $nft_claimer = $claimer.parents('.nft-claimer');
        const moe_treasury = MoeTreasuryFactory();
        const claimable = await moe_treasury.then((c) => c?.claimableFor(
            x40(address), id
        ));
        const $nft_claimable = $nft_claimer.siblings('.nft-claimable');
        const $claimable = $nft_claimable.find('>input');
        $claimable.val(claimable.toString());
        $claimable.trigger('change');
    }
});
$('#connect-metamask').on('connected', async function updateClaimable() {
    const on_block = async () => {
        const $nft_minter = $('.nft-minter');
        const $nft_toggle = $nft_minter.find('.toggle');
        const $nft_toggles_on = $nft_toggle.filter((i, el) => {
            return $(el).data('state') === 'on';
        });
        const $nft_minter_on = $nft_toggles_on.parents('.nft-minter');
        const $nft_details_on = $nft_minter_on.next('.nft-details');
        const $rows = $nft_details_on.find('.row.year');
        const $rows_on = $rows.filter((i, el) => {
            return $(el).data('state') === 'on';
        });
        $rows_on.each((i, el) => {
            const $nft_claimer = $(el).find('.nft-claimer');
            const $claimer = $nft_claimer.find('.claimer');
            $claimer.trigger('refresh', {
                id: $nft_claimer.data('id') as NftCoreId
            });
        });
    };
    const moe_treasury = MoeTreasuryFactory();
    moe_treasury.then((c) => c?.provider?.on('block', on_block));
});
$(window).on('load', function toggleClaimerSpinner() {
    const claimer = $('.nft-claimer>.claimer');
    claimer.on('claiming', showSpinner);
    claimer.on('claimed', hideSpinner);
    claimer.on('error', hideSpinner);
    function showSpinner(
        ev: JQuery.TriggeredEvent
    ) {
        const claimer = $(ev.target);
        const $spinner = claimer.find('.spinner');
        $spinner.css('visibility', 'visible');
        $spinner.addClass('spinner-grow');
        claimer.prop('disabled', true);
        const $text = claimer.find('.text');
        $text.text(`Claiming Rewards…`);
    }
    function hideSpinner(
        ev: JQuery.TriggeredEvent
    ) {
        const claimer = $(ev.target);
        const $spinner = claimer.find('.spinner');
        $spinner.css('visibility', 'hidden');
        $spinner.removeClass('spinner-grow');
        const $text = claimer.find('.text');
        $text.text(`Claim Rewards`);
    }
});
$('.claimer-expander').on('click', function showClaimer(ev) {
    const $expander = $(ev.target).parents('.nft-claimer-expander');
    $expander.hide();
    const $claimed_label = $expander.siblings('.nft-claimed-label');
    $claimed_label.removeClass('d-none');
    const $claimed = $expander.siblings('.nft-claimed');
    $claimed.removeClass('d-none');
    const $claimable_label = $expander.siblings('.nft-claimable-label');
    $claimable_label.removeClass('d-none');
    const $claimable = $expander.siblings('.nft-claimable');
    $claimable.removeClass('d-none');
    const $claimer = $expander.siblings('.nft-claimer');
    $claimer.removeClass('d-none');
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
