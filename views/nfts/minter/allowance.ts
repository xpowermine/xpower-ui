import { App } from '../../../source/app';
import { Blockchain } from '../../../source/blockchain';
import { Transaction } from 'ethers';
import { NftWallet, OnApproval, MoeWallet } from '../../../source/wallet';

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
    const $approval = $('#burn-approval');
    const approved = allowance > MID_UINT256;
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
$('#burn-approval').on('click', async function increaseAllowance() {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const token = App.token;
    const moe_wallet = new MoeWallet(address, token);
    const nft_wallet = new NftWallet(address, token);
    const nft_contract = await nft_wallet.contract;
    const old_allowance = await moe_wallet.allowance(
        address, nft_contract.address
    );
    const $approval = $('#burn-approval');
    const approved = old_allowance > MID_UINT256;
    if (approved) {
        $approval.trigger('approved');
    } else {
        const on_approval: OnApproval = (
            owner, spender, value, ev
        ) => {
            if (ev.transactionHash !== tx?.hash) {
                return;
            }
            $approval.trigger('approved');
        };
        let tx: Transaction | undefined;
        try {
            $approval.trigger('approving');
            moe_wallet.onApproval(on_approval);
            const nft_contract = await nft_wallet.contract;
            tx = await moe_wallet.increaseAllowance(
                nft_contract.address, MAX_UINT256 - old_allowance
            );
        } catch (ex) {
            $approval.trigger('error', {
                error: ex
            });
            console.error(ex);
        }
    }
});
