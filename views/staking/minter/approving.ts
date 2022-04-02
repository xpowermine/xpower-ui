/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Global } from '../../../source/types';
declare const global: Global;

$(window).on('load', function toggleApproval() {
    const $approval = $('#burn-approval');
    $approval.on('approving', () => {
        $approval.prop('disabled', true);
    });
    $approval.on('approved', () => {
        $approval.prop('disabled', false);
        $approval.hide();
    });
    $approval.on('error', () => {
        $approval.prop('disabled', false);
    });
});
$(window).on('load', function toggleApprovalSpinner() {
    const $approval = $('#burn-approval');
    const $text = $approval.find('.text');
    const $spinner = $approval.find('.spinner');
    $approval.on('approving', () => {
        $spinner.css('visibility', 'visible');
        $spinner.addClass('spinner-grow');
        $text.text('Approving NFT Staking…');
    });
    $approval.on('approved', () => {
        $spinner.css('visibility', 'hidden');
        $spinner.removeClass('spinner-grow');
        $text.text('Approve NFT Staking');
    });
    $approval.on('error', () => {
        $spinner.css('visibility', 'hidden');
        $spinner.removeClass('spinner-grow');
        $text.text('Approve NFT Staking');
    });
});
$(window).on('load', function toggleApprovalTooltip() {
    const { Tooltip } = global.bootstrap as any;
    const $approval = $('#burn-approval');
    $approval.on('approved', () => {
        Tooltip.getInstance($approval)?.disable();
    });
    $approval.on('error', () => {
        Tooltip.getInstance($approval)?.enable();
    });
});
