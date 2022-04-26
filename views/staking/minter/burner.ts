/* eslint @typescript-eslint/no-explicit-any: [off] */
import { App } from '../../../source/app';
import { Blockchain } from '../../../source/blockchain';
import { OnUnstakeBatch, PptTreasuryFactory } from '../../../source/contract';
import { Transaction } from 'ethers';
import { alert, Alert, x40 } from '../../../source/functions';
import { Amount, NftCoreId } from '../../../source/redux/types';
import { Nft, NftLevel, NftLevels } from '../../../source/redux/types';
import { OtfWallet } from '../../../source/wallet';
import { Years } from '../../../source/years';

$('#connect-metamask').on('connected', function initBurner() {
    const $burner = $('#batch-burner');
    const $approval = $('#burn-approval');
    $approval.on('approved', () => {
        $burner.prop('disabled', !negatives($amounts));
        $burner.addClass('show');
    });
    const $amounts = $('.amount');
    $amounts.on('change', (el, { amount }) => {
        if (amount < 0n) {
            $burner.prop('disabled', false);
        } else if (amount === 0n) {
            $burner.prop('disabled', !negatives($amounts));
        }
    });
});
$('#batch-burner').on('click', async function batchBurnPpts() {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const ppt_burns = [] as Array<{ ppt_id: NftCoreId; amount: Amount; }>;
    for (const level of NftLevels()) {
        const $nft_burner = $(`.nft-minter[data-level=${NftLevel[level]}]`);
        const amount = BigInt($nft_burner.find('.amount').text());
        if (amount < 0) {
            // unstake from oldest to youngest:
            const issues = Array.from(Years());
            let burn_amount = -amount;
            for (const issue of issues) {
                const ppt_total = App.getPptTotalBy({ level, issue });
                if (ppt_total.amount === 0n) {
                    continue;
                }
                const ppt_id = Nft.coreId({ level, issue });
                if (burn_amount >= ppt_total.amount) {
                    ppt_burns.push({
                        ppt_id, amount: ppt_total.amount
                    });
                    burn_amount -= ppt_total.amount;
                } else {
                    ppt_burns.push({
                        ppt_id, amount: burn_amount
                    });
                    burn_amount = 0n;
                }
                if (burn_amount === 0n) {
                    break;
                }
            }
        }
    }
    const ppt_ids = ppt_burns.map((burn) => burn.ppt_id);
    const amounts = ppt_burns.map((burn) => burn.amount);
    const on_unstake_batch: OnUnstakeBatch = async (
        from, nftIds, amounts, ev
    ) => {
        if (ev.transactionHash !== tx?.hash) {
            return;
        }
        $burner.trigger('burned');
    };
    const $burner = $('#batch-burner');
    const ppt_treasury = PptTreasuryFactory();
    let tx: Transaction | undefined;
    try {
        $('.alert').remove();
        $burner.trigger('burning');
        ppt_treasury.then((c) => c?.on('UnstakeBatch', on_unstake_batch));
        const contract = await OtfWallet.connect(await ppt_treasury);
        tx = await contract.unstakeBatch(
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
                $alert.insertAfter($burner.parents('div'));
                $alert.find('.alert').css('margin-bottom', '1em');
            } else {
                const $alert = $(alert(ex.message, Alert.warning));
                $alert.insertAfter($burner.parents('div'));
                $alert.find('.alert').css('margin-bottom', '1em');
            }
        }
        $burner.trigger('error', {
            error: ex
        });
        console.error(ex);
    }
});
$('#connect-metamask').on('connected', function toggleBurner() {
    const $burner = $('#batch-burner');
    $burner.on('burning', () => {
        $burner.prop('disabled', true);
    });
    $burner.on('error', async () => {
        $burner.prop('disabled', false);
    });
});
$('#connect-metamask').on('connected', function toggleBurnerSpinner() {
    const $burner = $('#batch-burner');
    const $text = $burner.find('.text');
    const $spinner = $burner.find('.spinner');
    $burner.on('burning', () => {
        $spinner.css('visibility', 'visible');
        $spinner.addClass('spinner-grow');
        $text.text('Unstaking NFTs…');
    });
    $burner.on('burned', () => {
        $spinner.css('visibility', 'hidden');
        $spinner.removeClass('spinner-grow');
        $text.text('Unstake NFTs');
    });
    $burner.on('error', () => {
        $spinner.css('visibility', 'hidden');
        $spinner.removeClass('spinner-grow');
        $text.text('Unstake NFTs');
    });
});
function negatives($amounts: JQuery<HTMLElement>) {
    const amounts = Array.from(
        $amounts.map((i, el) => BigInt($(el).text() || 0n))
    );
    const negatives = amounts.filter((a) => a < 0n);
    return negatives.length > 0;
}
