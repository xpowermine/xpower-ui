/* eslint @typescript-eslint/no-explicit-any: [off] */
import { App } from '../../../source/app';
import { Blockchain } from '../../../source/blockchain';
import { Transaction } from 'ethers';
import { Alert, alert, delayed } from '../../../source/functions';
import { Amount, Nft, Token } from '../../../source/redux/types';
import { NftLevel, NftLevels, NftName } from '../../../source/redux/types';
import { MoeWallet, NftWallet, OnTransferBatch } from '../../../source/wallet';
import { Tooltip } from '../../tooltips';

export const MAX_UINT256 = 2n ** 256n - 1n;
export const MID_UINT256 = 2n ** 255n - 1n;

import React from 'react';
import { InfoCircle } from '../../../public/images/tsx';

import './allowance';
import './approving';

export class NftMinter extends React.Component<{
    token: Token
}, {
    token: Token
}> {
    constructor(props: {
        token: Token
    }) {
        super(props);
        this.state = {
            ...this.props
        };
        this.events();
    }
    events() {
        App.onTokenSwitch((token) => this.setState({
            token
        }));
    }
    render() {
        const { token } = this.state;
        return <div className='btn-group nft-batch-minter'
            role='group'
        >
            {this.$toggleAll()}
            {this.$burnApproval(token)}
            {this.$batchMinter()}
            {this.$info(token)}
        </div>;
    }
    $toggleAll() {
        return <button type='button' id='toggle-all'
            className='btn btn-outline-warning no-ellipsis'
            data-bs-placement='top'
            data-bs-toggle='tooltip'
            data-state='off'
            title='Show all NFT levels'
        >
            <i className='bi-chevron-down' />
        </button>;
    }
    $burnApproval(
        token: Token
    ) {
        return <button type='button' id='burn-approval'
            className='btn btn-outline-warning' disabled
            data-bs-placement='top' data-bs-toggle='tooltip'
            title={`Approve burning of ${token}s to enable NFT minting`}
        >
            <span
                className='spinner spinner-border spinner-border-sm float-start'
                role='status' style={{ visibility: 'hidden' }}
            />
            <span className='text'>
                Approve NFT Minting
            </span>
        </button>;
    }
    $batchMinter() {
        return <button type="button" id='batch-minter'
            className='btn btn-outline-warning' disabled
        >
            <span
                className='spinner spinner-border spinner-border-sm float-start'
                role='status' style={{ visibility: 'hidden' }}
            />
            <span className='text'>
                Mint NFTs
            </span>
        </button>;
    }
    $info(
        token: Token
    ) {
        return <button type='button'
            className='btn btn-outline-warning info'
            data-bs-placement='top' data-bs-toggle='tooltip'
            title={`(Batch) mint stakeable ${token} NFTs`}
        >
            <InfoCircle fill={true} />
        </button>;
    }
}
Blockchain.onConnect(async function checkAllowance({
    address, token
}) {
    const moe_wallet = new MoeWallet(address, token);
    const nft_wallet = new NftWallet(address, token);
    const nft_contract = await nft_wallet.contract;
    const allowance = await moe_wallet.allowance(
        address, nft_contract.address
    );
    const $minter = $('#batch-minter');
    const approved = allowance > MID_UINT256;
    if (approved) {
        $minter.addClass('show');
    } else {
        $minter.removeClass('show');
    }
});
Blockchain.onceConnect(function initMinter() {
    function positives($amounts: JQuery<HTMLElement>) {
        const amounts = Array.from(
            $amounts.map((i, el) => BigInt($(el).text() || 0n))
        );
        const positives = amounts.filter((a) => a > 0n);
        return positives.length > 0;
    }
    const $minter = $('#batch-minter');
    const $approval = $('#burn-approval');
    $approval.on('approved', async () => {
        $minter.prop('disabled', !positives($amounts));
        $minter.addClass('show');
    });
    const $amounts = $('.amount');
    $amounts.on('change', () => {
        $minter.prop('disabled', !positives($amounts));
    });
});
$(window).on('load', delayed(() => {
    $('#toggle-all').on('click', function toggleList() {
        const $toggle_all = $('#toggle-all');
        const state = $toggle_all.data('state');
        if (state === 'off') {
            $toggle_all.data('state', 'on');
            $toggle_all.attr('title', 'Hide higher NFT levels');
            $toggle_all.html('<i class="bi-chevron-up"/>');
        } else {
            $toggle_all.data('state', 'off');
            $toggle_all.attr('title', 'Show all NFT levels');
            $toggle_all.html('<i class="bi-chevron-down"/>');
        }
        if (state === 'off') {
            $('.nft-minter').show();
        } else {
            const nft_token = Nft.token(
                App.token
            );
            $('.nft-minter').each((i, el) => {
                const $nft_minter = $(el);
                const $amount = $nft_minter.find('.amount');
                const amount = BigInt($amount.text());
                if (amount === 0n) {
                    const nft_name = $nft_minter.data('level') as NftName;
                    const { amount: balance } = App.getNftTotalBy({
                        level: NftLevel[nft_name], token: nft_token
                    });
                    if (balance === 0n) {
                        $nft_minter.hide();
                        $nft_minter.next().hide();
                        $nft_minter.find('.toggle').html(
                            '<i class="bi-chevron-down"/>'
                        );
                    }
                }
            });
        }
        Tooltip.getInstance($toggle_all[0])?.hide();
        delayed(() => {
            Tooltip.getInstance($toggle_all[0])?.dispose();
            Tooltip.getOrCreateInstance($toggle_all[0]);
        });
    });
}));
$(window).on('load', delayed(() => {
    $('#batch-minter').on('click', async function batchMintNfts() {
        const address = await Blockchain.selectedAddress;
        if (!address) {
            throw new Error('missing selected-address');
        }
        const nfts = [] as Array<{ level: NftLevel; amount: Amount; }>;
        for (const level of NftLevels()) {
            const $nft_minter = $(`.nft-minter[data-level=${NftLevel[level]}]`);
            const amount = BigInt($nft_minter.find('.amount').text());
            if (amount > 0) {
                nfts.push({ level: level, amount });
            }
        }
        const levels = nfts.map((nft) => nft.level);
        const amounts = nfts.map((nft) => nft.amount);
        const on_batch_tx: OnTransferBatch = async (
            op, from, to, ids, values, ev
        ) => {
            if (ev.transactionHash !== tx?.hash) {
                return;
            }
            $minter.trigger('minted');
        };
        const $minter = $('#batch-minter');
        const nft_wallet = new NftWallet(address, App.token);
        let tx: Transaction | undefined;
        try {
            $('.alert').remove();
            $minter.trigger('minting');
            nft_wallet.onTransferBatch(on_batch_tx);
            tx = await nft_wallet.mintBatch(levels, amounts);
        } catch (ex: any) {
            /* eslint no-ex-assign: [off] */
            if (ex.error) {
                ex = ex.error;
            }
            if (ex.message) {
                if (ex.data && ex.data.message) {
                    ex.message = `${ex.message} [${ex.data.message}]`;
                }
                const $alert = $(alert(ex.message, Alert.warning, {
                    style: { margin: '-0.5em 0 0.5em 0' }
                }));
                $alert.insertAfter($minter.parents('div'));
            }
            $minter.trigger('error', {
                error: ex
            });
            console.error(ex);
        }
    });
}));
Blockchain.onceConnect(function toggleMinter() {
    const $minter = $('#batch-minter');
    $minter.on('minting', () => {
        $minter.prop('disabled', true);
    });
    $minter.on('error', async () => {
        $minter.prop('disabled', false);
    });
});
Blockchain.onceConnect(function toggleMinterSpinner() {
    const $minter = $('#batch-minter');
    const $text = $minter.find('.text');
    const $spinner = $minter.find('.spinner');
    $minter.on('minting', () => {
        $spinner.css('visibility', 'visible');
        $spinner.addClass('spinner-grow');
        $text.html('Minting NFTs…');
    });
    $minter.on('minted', () => {
        $spinner.css('visibility', 'hidden');
        $spinner.removeClass('spinner-grow');
        $text.html('Mint NFTs');
    });
    $minter.on('error', () => {
        $spinner.css('visibility', 'hidden');
        $spinner.removeClass('spinner-grow');
        $text.html('Mint NFTs');
    });
});
export default NftMinter;
