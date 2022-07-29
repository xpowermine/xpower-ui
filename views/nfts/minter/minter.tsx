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

type Props = {
    token: Token;
    list: List;
}
type List = Record<NftLevel, {
    amount: Amount;
    max: Amount;
    min: Amount;
    toggled: boolean;
}>
type State = {
    approved: boolean
}
export class NftMinter extends React.Component<
    Props, State
> {
    constructor(props: {
        token: Token, list: List
    }) {
        super(props);
        this.state = {
            approved: false
        };
        this.events();
    }
    events() {
        Blockchain.onConnect(async/*check-allowance*/({
            address, token
        }) => {
            const moe_wallet = new MoeWallet(address, token);
            const nft_wallet = new NftWallet(address, token);
            const nft_contract = await nft_wallet.contract;
            const allowance = await moe_wallet.allowance(
                address, nft_contract.address
            );
            this.setState({
                approved: allowance > MID_UINT256
            });
        });
        Blockchain.onceConnect(/*init-minter*/() => {
            const $approval = $('#burn-approval');
            /**
             * @todo remove jQuery listener!
             */
            $approval.on('approved', () => {
                this.setState({ approved: true });
            });
        });
    }
    render() {
        const { token, list } = this.props;
        const { approved } = this.state;
        return <div
            className='btn-group nft-batch-minter'
            role='group'
        >
            {this.$toggleAll()}
            {this.$burnApproval(token)}
            {this.$batchMinter(approved, list)}
            {this.$info(token)}
        </div>;
    }
    $toggleAll() {
        return <button type='button' id='toggle-all'
            className='btn btn-outline-warning no-ellipsis'
            data-bs-placement='top' data-bs-toggle='tooltip'
            data-state='off' title='Show all NFT levels'
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
            {Spinner({
                show: false, grow: true
            })}
            <span className='text'>
                Approve NFT Minting
            </span>
        </button>;
    }
    $batchMinter(
        approved: boolean, list: List
    ) {
        const classes = [
            'btn btn-outline-warning', approved ? 'show' : ''
        ];
        return <button
            type="button" id='batch-minter'
            className={classes.join(' ')}
            disabled={!this.positives(list)}
        >
            {Spinner({
                show: false, grow: true
            })}
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
    positives(
        list: List
    ) {
        const amounts = Object.values(list).map(
            ({ amount }) => amount
        );
        const positives = amounts.filter(
            (amount) => amount > 0n
        );
        return positives.length > 0;
    }
}
function Spinner(
    { show, grow }: { show: boolean, grow?: boolean }
) {
    const classes = [
        'spinner spinner-border spinner-border-sm',
        'float-start', grow ? 'spinner-grow' : ''
    ];
    return <span
        className={classes.join(' ')} role='status'
        style={{ visibility: show ? 'visible' : 'hidden' }}
    />;
}
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
