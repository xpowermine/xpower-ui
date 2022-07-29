import { delayed } from '../../../source/functions';
import { Nft } from '../../../source/redux/types';
import { NftLevel } from '../../../source/redux/types';

import React from 'react';
import { InfoCircle } from '../../../public/images/tsx';

type Props = {
    level: NftLevel,
}
export class NftTxExpander extends React.Component<
    Props
> {
    render() {
        const { level } = this.props;
        return this.$expander(level);
    }
    $expander(
        nft_level: NftLevel
    ) {
        return <React.Fragment>
            <div className='btn-group nft-sender-expander d-sm-none'
                data-level={Nft.nameOf(nft_level)} role='group'
                style={{ marginTop: '1em', width: '100%' }}
            >
                <button
                    className='btn btn-outline-warning toggle-old no-ellipsis'
                    data-bs-placement='top' data-bs-toggle='tooltip' data-state='off'
                    title='Show older NFTs' type='button'
                >
                    <i className='bi-eye-fill' />
                </button>
                <button
                    className='btn btn-outline-warning sender-expander'
                    type='button'
                >
                    <i className='bi-chevron-down' />
                </button>
                <button
                    className='btn btn-outline-warning info'
                    data-bs-placement='top'
                    data-bs-toggle='tooltip'
                    style={{ width: '43px' }}
                    title='Show send to & amount'
                    type='button'
                >
                    <InfoCircle fill={true} />
                </button>
            </div>
        </React.Fragment>;
    }
}
$(window).on('load', delayed(() => {
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
}));
export default NftTxExpander;
