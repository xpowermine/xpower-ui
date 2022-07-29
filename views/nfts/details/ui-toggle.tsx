import { delayed } from '../../../source/functions';
import { Tooltip } from '../../tooltips';

import React from 'react';

export class NftUiToggle extends React.Component {
    render() {
        return this.$toggle();
    }
    $toggle() {
        return <button type='button'
            className='btn btn-outline-warning toggle-old no-ellipsis'
            data-bs-placement='top' data-bs-toggle='tooltip'
            data-state='off' title='Show older NFTs'
        >
            <i className='bi-eye-fill' />
        </button>;
    }
}
$(window).on('load', delayed(() => {
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
}));
export default NftUiToggle;
