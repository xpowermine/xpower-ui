/* eslint @typescript-eslint/no-explicit-any: [off] */
import { App } from '../../../source/app';
import { Blockchain } from '../../../source/blockchain';
import { OnStakeBatch, PptTreasuryFactory } from '../../../source/contract';
import { Transaction } from 'ethers';
import { alert, Alert, x40 } from '../../../source/functions';
import { Amount, NftCoreId } from '../../../source/redux/types';
import { Nft, NftLevel, NftLevels } from '../../../source/redux/types';
import { NftWallet, OtfWallet } from '../../../source/wallet';
import { Years } from '../../../source/years';

Blockchain.onConnect(async function isApproved({
    address, token
}) {
    const ppt_treasury = PptTreasuryFactory({ token });
    const nft_wallet = new NftWallet(address, token);
    const approved = await nft_wallet.isApprovedForAll(
        await ppt_treasury.then((c) => c?.address)
    );
    const $minter = $('#batch-minter');
    if (approved) {
        $minter.addClass('show');
    } else {
        $minter.removeClass('show');
    }
});
Blockchain.onceConnect(function initMinter() {
    const $minter = $('#batch-minter');
    const $approval = $('#burn-approval');
    $approval.on('approved', () => {
        $minter.prop('disabled', !positives($amounts));
        $minter.addClass('show');
    });
    const $amounts = $('.amount');
    $amounts.on('change', () => {
        $minter.prop('disabled', !positives($amounts));
    });
});
$('#batch-minter').on('click', async function batchMintPpts() {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const ppt_mints = [] as Array<{ ppt_id: NftCoreId; amount: Amount; }>;
    for (const level of NftLevels()) {
        const $nft_minter = $(`.nft-minter[data-level=${NftLevel[level]}]`);
        const amount = BigInt($nft_minter.find('.amount').text());
        if (amount > 0) {
            // stake from youngest to oldest (backwards):
            const issues = Array.from(Years()).reverse();
            let mint_amount = amount;
            for (const issue of issues) {
                const ppt_total = App.getNftTotalBy({ level, issue });
                if (ppt_total.amount === 0n) {
                    continue;
                }
                const ppt_id = Nft.coreId({ level, issue });
                if (mint_amount >= ppt_total.amount) {
                    ppt_mints.push({
                        ppt_id, amount: ppt_total.amount
                    });
                    mint_amount -= ppt_total.amount;
                } else {
                    ppt_mints.push({
                        ppt_id, amount: mint_amount
                    });
                    mint_amount = 0n;
                }
                if (mint_amount === 0n) {
                    break;
                }
            }
        }
    }
    const ppt_ids = ppt_mints.map((mint) => mint.ppt_id);
    const amounts = ppt_mints.map((mint) => mint.amount);
    const on_stake_batch: OnStakeBatch = async (
        from, nftIds, amounts, ev
    ) => {
        if (ev.transactionHash !== tx?.hash) {
            return;
        }
        $minter.trigger('minted');
    };
    const $minter = $('#batch-minter');
    const ppt_treasury = PptTreasuryFactory({
        token: App.token
    });
    let tx: Transaction | undefined;
    try {
        $('.alert').remove();
        $minter.trigger('minting');
        ppt_treasury.then((c) => c?.on('StakeBatch', on_stake_batch));
        const contract = await OtfWallet.connect(await ppt_treasury);
        tx = await contract.stakeBatch(
            x40(address), ppt_ids, amounts
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
        $text.html(
            'Staking<span class="d-none d-sm-inline"> NFTs???</span>'
        );
    });
    $minter.on('minted', () => {
        $spinner.css('visibility', 'hidden');
        $spinner.removeClass('spinner-grow');
        $text.html(
            'Stake<span class="d-none d-sm-inline"> NFTs</span>'
        );
    });
    $minter.on('error', () => {
        $spinner.css('visibility', 'hidden');
        $spinner.removeClass('spinner-grow');
        $text.html(
            'Stake<span class="d-none d-sm-inline"> NFTs</span>'
        );
    });
});
function positives($amounts: JQuery<HTMLElement>) {
    const amounts = Array.from(
        $amounts.map((i, el) => BigInt($(el).text() || 0n))
    );
    const positives = amounts.filter((a) => a > 0n);
    return positives.length > 0;
}
