/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Global } from '../../../source/types';
declare const global: Global;

import './list.scss';
import './amounts';

import { App } from '../../../source/app';
import { NftLevel, NftLevels } from '../../../source/redux/types';
import { Nft, NftFullId } from '../../../source/redux/types';
import { Amount, Supply } from '../../../source/redux/types';
import { Tokenizer } from '../../../source/token';

const { Tooltip } = global.bootstrap as any;

App.onPptChanged(function setLevelHeader(
    id: NftFullId,
    item: { amount: Amount, supply: Supply },
    total_by: { amount: Amount, supply: Supply }
) {
    const $nft_minter = $(
        `.nft-minter[data-level=${NftLevel[Nft.level(id)]}]`
    );
    if (total_by.amount > 0) {
        $nft_minter.show();
    }
    const $balance = $nft_minter.find('.balance');
    if (document.body.clientWidth > 576) {
        $balance.text(`${total_by.amount} / ${total_by.supply}`);
    } else {
        $balance.text(`${total_by.amount}`);
    }
});
$('.nft-minter .toggle').on('click', function toggleDetails(ev) {
    const $nft_minter = $(ev.target).parents('.nft-minter');
    const level = $nft_minter.data('level') as NftLevels;
    const $nft_details = $(`.nft-details[data-level=${level}]`);
    const display = $nft_details.css('display');
    if (display === 'none') {
        $nft_details.show();
    } else {
        $nft_details.hide();
    }
    if (display === 'none') {
        $nft_minter.trigger('expanded', {
            level: NftLevel[level]
        });
    } else {
        $nft_minter.trigger('collapsed', {
            level: NftLevel[level]
        });
    }
    const $toggle = $nft_minter.find('.toggle');
    if (display === 'none') {
        $toggle.html('<i class="bi-chevron-up"></i>');
        $toggle.attr('title', `Hide ${level} NFTs`);
    } else {
        $toggle.html('<i class="bi-chevron-down"></i>');
        $toggle.attr('title', `Show ${level} NFTs`);
    }
    const state = $toggle.data('state');
    if (state === 'on') {
        $toggle.data('state', 'off');
    } else {
        $toggle.data('state', 'on');
    }
    Tooltip.getInstance($toggle).dispose();
    Tooltip.getOrCreateInstance($toggle);
});
$('#toggle-all').on('click', function toggleList() {
    const $toggle_all = $('#toggle-all');
    const state = $toggle_all.data('state');
    if (state === 'off') {
        $toggle_all.data('state', 'on');
        $toggle_all.attr('title', `Hide higher NFT levels`);
        $toggle_all.html('<i class="bi-chevron-up"></i>');
    } else {
        $toggle_all.data('state', 'off');
        $toggle_all.attr('title', `Show all NFT levels`);
        $toggle_all.html('<i class="bi-chevron-down"></i>');
    }
    if (state === 'off') {
        $('.nft-minter').show();
    } else {
        const token = Nft.token(
            Tokenizer.suffix(App.token)
        );
        $('.nft-minter').each((i, el) => {
            const $nft_minter = $(el);
            const $amount = $nft_minter.find('.amount');
            const amount = BigInt($amount.text());
            if (amount === 0n) {
                const level = $nft_minter.data('level') as NftLevels;
                const { amount: balance } = App.getPptTotalBy({
                    level: NftLevel[level], token
                });
                if (balance === 0n) {
                    $nft_minter.hide();
                    $nft_minter.next().hide();
                    $nft_minter.find('.toggle').html(
                        '<i class="bi-chevron-down"></i>'
                    );
                }
            }
        });
    }
    Tooltip.getInstance($toggle_all).dispose();
    Tooltip.getOrCreateInstance($toggle_all);
});
