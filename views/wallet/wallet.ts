/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Global } from '../../source/types';
declare const global: Global;
import './wallet.scss';

import { App } from '../../source/app';
import { Blockchain, Connect } from '../../source/blockchain';
import { x40 } from '../../source/functions';
import { Tokenizer } from '../../source/token';
import { Amount, Token } from '../../source/redux/types';
import { OnTransfer, OtfWallet, Wallet } from '../../source/wallet';

import { Web3Provider } from '@ethersproject/providers';
import { formatUnits } from '@ethersproject/units';
import { parseUnits } from '@ethersproject/units';

const { Tooltip } = global.bootstrap as any;

$('#connect-metamask').on('connected', async function initWallet(
    ev, { address }: Connect
) {
    const token = Tokenizer.token(App.params.get('token'));
    const wallet = new Wallet(address);
    App.setToken(token, {
        amount: await wallet.balance,
        supply: await wallet.supply
    });
    const $address = $('#wallet-address');
    $address.val(x40(address));
});
$('#connect-metamask').on('connected', async function onTransfer(
    ev, { address }: Connect
) {
    const on_transfer: OnTransfer = async (from, to, amount) => {
        console.debug('[on:transfer]', x40(from), x40(to), amount);
        if (address === from || address === to) {
            App.setToken(token, {
                amount: await wallet.balance,
                supply: await wallet.supply
            });
        }
    };
    const token = Tokenizer.token(App.params.get('token'));
    const wallet = new Wallet(address);
    wallet.onTransfer(on_transfer);
});
App.onTokenChanged(function setBalance(
    token: Token, { amount: balance }: { amount: Amount }
) {
    const $balance = $('#wallet-balance');
    $balance.val(balance.toString());
});
$(window).on('load', async function initOtfWalletUi() {
    if (OtfWallet.enabled) {
        showOtfWallet();
    } else {
        hideOtfWallet();
    }
});
$('#connect-metamask').on('connected', async function initOtfWallet() {
    const otf_wallet = await OtfWallet.init();
    const $otf_address = $('#otf-wallet-address');
    const otf_address = await otf_wallet.getAddress();
    $otf_address.val(otf_address);
    const $otf_balance = $('#otf-wallet-balance');
    const otf_balance = await otf_wallet.getBalance();
    $otf_balance.val(formatUnits(otf_balance));
});
$('#connect-metamask').on('connected', async function updateOtfBalance() {
    const on_block = async () => {
        const otf_balance = await otf_wallet.getBalance();
        $otf_balance.val(formatUnits(otf_balance));
    };
    const $otf_balance = $('#otf-wallet-balance');
    const otf_wallet = await OtfWallet.init();
    otf_wallet.provider?.on('block', on_block);
});
$('#connect-metamask').on('connected', async function resumeMiningIf(
    ev, { address }: Connect
) {
    const on_block = async () => {
        if (OtfWallet.enabled) {
            const otf_balance = await otf_wallet.getBalance();
            if (otf_balance.gt(min_balance)) {
                const miner = App.miner(address);
                if (miner.running) miner.resume();
            }
        }
    };
    const min_balance = parseUnits('0.005');
    const otf_wallet = await OtfWallet.init();
    otf_wallet.provider?.on('block', on_block);
});
$('#otf-wallet-toggle').on('click', function toggleOtfWallet() {
    if (OtfWallet.enabled) {
        OtfWallet.enabled = false;
        hideOtfWallet({ animate: true });
    } else {
        OtfWallet.enabled = true;
        showOtfWallet({ animate: true });
    }
});
function showOtfWallet({ animate = false } = {}) {
    const $otf_wallet = $('#otf-wallet');
    if (animate) {
        $otf_wallet.slideDown('fast');
    } else {
        $otf_wallet.show();
    }
    const $otf_toggle = $('#otf-wallet-toggle');
    $otf_toggle.attr('title', 'Disable minter wallet & hide balance of AVAX');
    Tooltip.getInstance($otf_toggle).dispose();
    Tooltip.getOrCreateInstance($otf_toggle);
    const $otf_toggle_i = $otf_toggle.find('>i');
    $otf_toggle_i.removeClass('bi-wallet');
    $otf_toggle_i.addClass('bi-wallet2');
}
function hideOtfWallet({ animate = false } = {}) {
    const $otf_wallet = $('#otf-wallet');
    if (animate) {
        $otf_wallet.slideUp('fast');
    } else {
        $otf_wallet.hide();
    }
    const $otf_toggle = $('#otf-wallet-toggle');
    $otf_toggle.attr('title', 'Enable minter wallet & show balance of AVAX');
    Tooltip.getInstance($otf_toggle).dispose();
    Tooltip.getOrCreateInstance($otf_toggle);
    const $otf_toggle_i = $otf_toggle.find('>i');
    $otf_toggle_i.removeClass('bi-wallet2');
    $otf_toggle_i.addClass('bi-wallet');
}
$('#connect-metamask').on('connected', async function toggleOtfTransfer() {
    const $otf_transfer = $('#otf-wallet-transfer');
    const $otf_transfer_i = $otf_transfer.find('i');
    const on_block = async () => {
        const otf_balance = await otf_wallet.getBalance();
        if (otf_balance.gt(min_balance)) {
            $otf_transfer.removeClass('deposit');
            $otf_transfer.addClass('withdraw');
            $otf_transfer_i.removeClass('bi-patch-plus');
            $otf_transfer_i.addClass('bi-patch-minus');
            $otf_transfer.attr(
                'title', 'Withdraw AVAX from minter to wallet address'
            );
            $otf_transfer.off('click').on('click', withdrawOtf);
        } else {
            $otf_transfer.removeClass('withdraw');
            $otf_transfer.addClass('deposit');
            $otf_transfer_i.removeClass('bi-patch-minus');
            $otf_transfer_i.addClass('bi-patch-plus');
            $otf_transfer.attr(
                'title', 'Deposit AVAX from wallet to minter address'
            );
            $otf_transfer.off('click').on('click', depositOtf);
        }
        Tooltip.getInstance($otf_transfer).dispose();
        Tooltip.getOrCreateInstance($otf_transfer);
    };
    const min_balance = parseUnits('0.005');
    const otf_wallet = await OtfWallet.init();
    otf_wallet.provider?.on('block', on_block);
});
async function depositOtf() {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const unit = parseUnits('1.0');
    const provider = new Web3Provider(Blockchain.provider);
    const mmw_signer = provider.getSigner(x40(address));
    const mmw_balance = await mmw_signer.getBalance();
    const gas_limit = await mmw_signer.estimateGas({
        to: x40(address), value: unit
    });
    const gas_price = await mmw_signer.getGasPrice();
    const fee = gas_limit.mul(gas_price)
    const value = mmw_balance.lt(unit.add(fee))
        ? mmw_balance.sub(fee) : unit;
    const otf_wallet = await OtfWallet.init();
    const otf_address = await otf_wallet.getAddress();
    const tx = await mmw_signer.sendTransaction({
        gasLimit: gas_limit, gasPrice: gas_price,
        to: otf_address, value
    });
    tx.wait(1).then(() => {
        $otf_transfer.removeClass('processing');
    });
    const $otf_transfer = $('#otf-wallet-transfer');
    $otf_transfer.addClass('processing');
    $otf_transfer.off('click')
    console.debug('[deposit-otf]', tx);
}
async function withdrawOtf() {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const otf_signer = await OtfWallet.init();
    const otf_balance = await otf_signer.getBalance();
    const gas_limit = await otf_signer.estimateGas({
        to: x40(address), value: otf_balance
    });
    const gas_price = await otf_signer.getGasPrice();
    const fee = gas_limit.mul(gas_price)
    const value = otf_balance.sub(fee);
    const tx = await otf_signer.sendTransaction({
        gasLimit: gas_limit, gasPrice: gas_price,
        to: x40(address), value
    });
    tx.wait(1).then(() => {
        $otf_transfer.removeClass('processing');
    });
    const $otf_transfer = $('#otf-wallet-transfer');
    $otf_transfer.addClass('processing');
    $otf_transfer.off('click')
    console.debug('[withdraw-otf]', tx);
}
export default Wallet;
