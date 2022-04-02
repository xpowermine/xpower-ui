import { Blockchain } from '../../../source/blockchain';
import { Transaction } from 'ethers';
import { Amount } from '../../../source/redux/types';
import { NftLevel, NftLevels } from '../../../source/redux/types';
import { NftWallet, OnTransferBatch } from '../../../source/wallet';

$('#connect-metamask').on('connected', function initMinter() {
    const $minter = $('#batch-minter');
    const $approval = $('#burn-approval');
    $approval.on('approved', async () => {
        $minter.prop('disabled', !positives($amounts));
        $minter.addClass('show');
    });
    const $amounts = $('.amount');
    $amounts.on('change', (el, { amount }) => {
        if (amount > 0n) {
            $minter.prop('disabled', false);
        } else if (amount === 0n) {
            $minter.prop('disabled', !positives($amounts));
        }
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
    const nft_wallet = new NftWallet(address);
    let tx: Transaction | undefined;
    try {
        $minter.trigger('minting');
        nft_wallet.onTransferBatch(on_batch_tx);
        tx = await nft_wallet.mintBatch(levels, amounts);
    } catch (ex) {
        $minter.trigger('error', {
            error: ex
        });
        console.error(ex);
    }
});
$('#connect-metamask').on('connected', function toggleMinter() {
    const $minter = $('#batch-minter');
    $minter.on('minting', () => {
        $minter.prop('disabled', true);
    });
    $minter.on('error', async () => {
        $minter.prop('disabled', false);
    });
});
$('#connect-metamask').on('connected', function toggleMinterSpinner() {
    const $minter = $('#batch-minter');
    const $text = $minter.find('.text');
    const $spinner = $minter.find('.spinner');
    $minter.on('minting', () => {
        $spinner.css('visibility', 'visible');
        $spinner.addClass('spinner-grow');
        $text.text('Minting NFTs…');
    });
    $minter.on('minted', () => {
        $spinner.css('visibility', 'hidden');
        $spinner.removeClass('spinner-grow');
        $text.text('Mint NFTs');
    });
    $minter.on('error', () => {
        $spinner.css('visibility', 'hidden');
        $spinner.removeClass('spinner-grow');
        $text.text('Mint NFTs');
    });
});
function positives($amounts: JQuery<HTMLElement>) {
    const amounts = Array.from(
        $amounts.map((i, el) => BigInt($(el).text() || 0n))
    );
    const positives = amounts.filter((a) => a > 0n);
    return positives.length > 0;
}
