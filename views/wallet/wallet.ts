import './wallet.scss';

import { App } from '../../source/app';
import { Blockchain } from '../../source/blockchain';
import { x40 } from '../../source/functions';
import { Amount, Token } from '../../source/redux/types';
import { MoeWallet, OnTransfer, OtfWallet } from '../../source/wallet';

import { Web3Provider } from '@ethersproject/providers';
import { formatUnits } from '@ethersproject/units';
import { parseUnits } from '@ethersproject/units';
import { Tooltip } from '../tooltips';

$('#selector').on('switch', async function relabelWallet(ev, {
    token, old_token
}: {
    token: Token, old_token: Token
}) {
    function text(rx: RegExp, el: HTMLElement) {
        const value = $(el).text();
        if (value?.match(rx)) {
            $(el).text(value.replace(rx, token));
        }
    }
    const $wallet = $('#wallet');
    const rx = new RegExp(old_token, 'g');
    const $labels = $wallet.find('label');
    $labels.each((_, el) => text(rx, el));
});
Blockchain.onceConnect(async function initWallet({
    address, token
}) {
    const moe_wallet = new MoeWallet(address, token);
    App.setToken(token, {
        amount: await moe_wallet.balance,
        supply: await moe_wallet.supply
    });
    const $address = $('#wallet-address');
    $address.val(x40(address));
}, {
    per: () => App.token
});
Blockchain.onConnect(async function syncWallet({
    token
}) {
    const tokens = App.getTokens(token);
    const item = tokens.items[token];
    if (item) App.setToken(token, item);
});
Blockchain.onceConnect(async function onTransfer({
    address, token
}) {
    const on_transfer: OnTransfer = async (from, to, amount) => {
        if (App.token !== token) {
            return;
        }
        console.debug(
            '[on:transfer]', x40(from), x40(to), amount
        );
        if (address === from || address === to) {
            const amount = await moe_wallet.balance;
            const supply = await moe_wallet.supply;
            App.setToken(token, { amount, supply });
        }
    };
    const moe_wallet = new MoeWallet(address, token);
    moe_wallet.onTransfer(on_transfer);
}, {
    per: () => App.token
});
App.onTokenChanged(function setBalance(
    token: Token, { amount }: { amount: Amount }
) {
    const $balance = $('#wallet-balance');
    $balance.val(amount.toString());
});
$(window).on('load', async function initOtfWalletUi() {
    if (OtfWallet.enabled) {
        showOtfWallet();
    } else {
        hideOtfWallet();
    }
});
Blockchain.onConnect(async function initOtfWallet() {
    const otf_wallet = await OtfWallet.init();
    const $otf_address = $('#otf-wallet-address');
    const otf_address = await otf_wallet.getAddress();
    $otf_address.val(otf_address);
    const $otf_balance = $('#otf-wallet-balance');
    const otf_balance = await otf_wallet.getBalance();
    $otf_balance.val(formatUnits(otf_balance));
});
Blockchain.onceConnect(async function syncOtfBalance() {
    const on_block = async () => {
        const otf_balance = await otf_wallet.getBalance();
        $otf_balance.val(formatUnits(otf_balance));
    };
    const $otf_balance = $('#otf-wallet-balance');
    const otf_wallet = await OtfWallet.init();
    otf_wallet.provider?.on('block', on_block);
});
Blockchain.onceConnect(async function resumeMiningIf({
    address
}) {
    const on_block = async () => {
        if (OtfWallet.enabled) {
            const otf_balance = await otf_wallet.getBalance();
            if (otf_balance.gt(min_balance)) {
                const miner = App.miner(address, {
                    token: App.token
                });
                if (miner.running) {
                    miner.resume();
                }
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
    Tooltip.getInstance($otf_toggle[0])?.dispose();
    Tooltip.getOrCreateInstance($otf_toggle[0]);
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
    Tooltip.getInstance($otf_toggle[0])?.dispose();
    Tooltip.getOrCreateInstance($otf_toggle[0]);
    const $otf_toggle_i = $otf_toggle.find('>i');
    $otf_toggle_i.removeClass('bi-wallet2');
    $otf_toggle_i.addClass('bi-wallet');
}
Blockchain.onceConnect(async function toggleOtfTransfer() {
    const $otf_transfer = $('#otf-wallet-transfer');
    const $otf_transfer_i = $otf_transfer.find('i');
    const on_block = async () => {
        const otf_balance = await otf_wallet.getBalance();
        if (otf_balance.gt(min_balance)) {
            $otf_transfer.removeClass('deposit');
            $otf_transfer.addClass('withdraw');
            $otf_transfer_i.removeClass('bi-circle');
            $otf_transfer_i.removeClass('bi-plus-circle');
            $otf_transfer_i.addClass('bi-dash-circle');
            $otf_transfer.attr(
                'title', 'Withdraw AVAX from minter to wallet address'
            );
            $otf_transfer.off('click').on('click', withdrawOtf);
        } else {
            $otf_transfer.removeClass('withdraw');
            $otf_transfer.addClass('deposit');
            $otf_transfer_i.removeClass('bi-circle');
            $otf_transfer_i.removeClass('bi-dash-circle');
            $otf_transfer_i.addClass('bi-plus-circle');
            $otf_transfer.attr(
                'title', 'Deposit AVAX from wallet to minter address'
            );
            $otf_transfer.off('click').on('click', depositOtf);
        }
        Tooltip.getInstance($otf_transfer[0])?.dispose();
        Tooltip.getOrCreateInstance($otf_transfer[0]);
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
    const provider = new Web3Provider(await Blockchain.provider);
    const mmw_signer = provider.getSigner(x40(address));
    const mmw_balance = await mmw_signer.getBalance();
    const gas_limit = await mmw_signer.estimateGas({
        to: x40(address), value: unit
    });
    const gas_price_base = await mmw_signer.getGasPrice();
    const gas_price = gas_price_base.mul(1125).div(1000);
    const fee = gas_limit.mul(gas_price);
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
    const gas_price_base = await otf_signer.getGasPrice();
    const gas_price = gas_price_base.mul(1125).div(1000);
    const fee = gas_limit.mul(gas_price);
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
