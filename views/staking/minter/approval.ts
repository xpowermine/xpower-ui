import { Blockchain } from '../../../source/blockchain';
import { PptTreasuryFactory } from '../../../source/contract';
import { Transaction } from 'ethers';
import { Address } from '../../../source/redux/types';
import { NftWallet, OnApprovalForAll } from '../../../source/wallet';

$('#connect-metamask').on('connected', async function isApproved(ev, {
    address
}: {
    address: Address
}) {
    const ppt_treasury = PptTreasuryFactory();
    const nft_wallet = new NftWallet(address);
    const approved = await nft_wallet.isApprovedForAll(
        await ppt_treasury.then((c) => c?.address)
    );
    const $approval = $('#burn-approval');
    if (approved) {
        $approval.prop('disabled', true);
        $approval.hide();
    } else {
        $approval.prop('disabled', false);
        $approval.show();
    }
    if (approved) {
        $approval.trigger('approved');
    }
});
$('#burn-approval').on('click', async function setApproval() {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const ppt_treasury = PptTreasuryFactory();
    const nft_wallet = new NftWallet(address);
    const approved = await nft_wallet.isApprovedForAll(
        address
    );
    const $approval = $('#burn-approval');
    if (approved) {
        $approval.trigger('approved');
    } else {
        const on_approval: OnApprovalForAll = (
            account, op, flag, ev
        ) => {
            if (ev.transactionHash !== tx?.hash) {
                return;
            }
            $approval.trigger('approved');
        };
        let tx: Transaction | undefined;
        try {
            $approval.trigger('approving');
            nft_wallet.onApprovalForAll(on_approval);
            tx = await nft_wallet.setApprovalForAll(
                await ppt_treasury.then((c) => c?.address),
                true
            );
        } catch (ex) {
            $approval.trigger('error', {
                error: ex
            });
            console.error(ex);
        }
    }
});
