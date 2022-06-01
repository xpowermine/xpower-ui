/* eslint @typescript-eslint/no-explicit-any: [off] */
import { App } from '../../../source/app';
import { Blockchain } from '../../../source/blockchain';
import { Transaction } from 'ethers';
import { alert, Alert } from '../../../source/functions';
import { Amount } from '../../../source/redux/types';
import { NftLevel, NftLevels } from '../../../source/redux/types';
import { MoeWallet, NftWallet, OnTransferBatch } from '../../../source/wallet';

export const MAX_UINT256 = 2n ** 256n - 1n;
export const MID_UINT256 = 2n ** 255n - 1n;

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
                const message = `${ex.message} [${ex.data.message}]`;
                const $alert = $(alert(message, Alert.warning));
                $alert.insertAfter($minter.parents('div'));
                $alert.find('.alert').css('margin-bottom', '1em');
            } else {
                const $alert = $(alert(ex.message, Alert.warning));
                $alert.insertAfter($minter.parents('div'));
                $alert.find('.alert').css('margin-bottom', '1em');
            }
        }
        $minter.trigger('error', {
            error: ex
        });
        console.error(ex);
    }
});
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
function positives($amounts: JQuery<HTMLElement>) {
    const amounts = Array.from(
        $amounts.map((i, el) => BigInt($(el).text() || 0n))
    );
    const positives = amounts.filter((a) => a > 0n);
    return positives.length > 0;
}
