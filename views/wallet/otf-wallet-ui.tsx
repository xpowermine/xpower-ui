import { Blockchain } from '../../source/blockchain';
import { x40 } from '../../source/functions';
import { Address, Amount } from '../../source/redux/types';
import { OtfWallet } from '../../source/wallet';

import { Web3Provider } from '@ethersproject/providers';
import { formatUnits } from '@ethersproject/units';
import { parseUnits } from '@ethersproject/units';
import { Tooltip } from '../tooltips';

import React from 'react';
import { InfoCircle } from '../../public/images/tsx';

export class OtfWalletUi extends React.Component<{
    toggled: boolean,
}, {
    address: Address | null,
    amount: Amount | null,
    processing: boolean,
}> {
    get threshold() {
        return OtfWallet.threshold;
    }
    constructor(props: {
        toggled: boolean
    }) {
        super(props);
        this.state = {
            address: null, amount: null,
            processing: false, ...this.props
        };
        this.events();
    }
    events() {
        Blockchain.onceConnect(async /*initialize*/() => {
            const otf_wallet = await OtfWallet.init();
            const [otf_address, otf_balance] = await Promise.all([
                otf_wallet.getAddress(), otf_wallet.getBalance()
            ]);
            this.setState({
                address: BigInt(otf_address),
                amount: otf_balance.toBigInt()
            });
        });
        Blockchain.onceConnect(async /*synchronize*/() => {
            const on_block = async () => {
                const otf_balance = await otf_wallet.getBalance();
                this.setState({ amount: otf_balance.toBigInt() });
            };
            const otf_wallet = await OtfWallet.init();
            otf_wallet.provider?.on('block', on_block);
        });
    }
    render() {
        const { address, amount, processing } = this.state;
        const { toggled } = this.props;
        return <form
            className={this.display(toggled)}
            id='otf-wallet' onSubmit={(e) => e.preventDefault()}
        >
            <label className='form-label'>
                Minter Address and AVAX Balance
            </label>
            <div className='input-group otf-wallet-address'>
                {this.$transmitter(amount, processing)}
                {this.$address(address)}
                {this.$balance(amount)}
                {this.$info()}
            </div>
        </form>;
    }
    display(
        toggled: boolean
    ) {
        return !toggled ? 'd-none' : '';
    }
    $transmitter(
        amount: Amount | null, processing: boolean
    ) {
        const outer_classes = [
            'form-control input-group-text',
            this.direction(amount), this.processing(processing)
        ];
        const inner_classes = [
            'spinner spinner-border spinner-border-sm',
            'float-start'
        ];
        return <button
            className={outer_classes.join(' ')}
            data-bs-toggle='tooltip' data-bs-placement='top'
            id='otf-wallet-transfer'
            onClick={this.transact.bind(this, amount, processing)}
            title={this.title(amount)}
        >
            <span
                className={inner_classes.join(' ')}
                role="status"
            />
            <i className={this.icon(amount)} />
        </button>;
    }
    direction(
        amount: Amount | null
    ) {
        if (amount !== null) {
            if (this.threshold.lte(amount)) {
                return 'withdraw';
            }
        }
        return 'deposit';
    }
    icon(
        amount: Amount | null
    ) {
        if (amount !== null) {
            if (this.threshold.lte(amount)) {
                return 'bi-dash-circle';
            }
            return 'bi-plus-circle';
        }
        return 'bi-circle';
    }
    processing(
        processing: boolean
    ) {
        return processing ? 'processing' : '';
    }
    title(
        amount: Amount | null
    ) {
        if (amount !== null) {
            if (this.threshold.lte(amount)) {
                return 'Withdraw AVAX from minter to wallet address';
            }
        }
        return 'Deposit AVAX from wallet to minter address';
    }
    transact(
        amount: Amount | null, processing: boolean
    ) {
        if (amount !== null) {
            if (this.threshold.lte(amount)) {
                withdrawOtf.bind(this)(processing);
            } else {
                depositOtf.bind(this)(processing);
            }
        } else {
            depositOtf.bind(this)(processing);
        }
    }
    $address(
        address: Address | null
    ) {
        return <input
            className='form-control'
            data-bs-toggle='tooltip' data-bs-placement='top'
            id='otf-wallet-address' readOnly
            title='Minter address to pre-fund for transaction fees'
            type='text' value={x40(address ?? 0n)}
        />;
    }
    $balance(
        amount: Amount | null
    ) {
        return <input
            className='form-control'
            data-bs-toggle='tooltip' data-bs-placement='top'
            id='otf-wallet-balance' readOnly
            title='AVAX balance to auto-pay for transaction fees'
            type='text' value={formatUnits(amount ?? 0n)}
        />;
    }
    $info() {
        return <button
            className='form-control input-group-text info'
            data-bs-toggle='tooltip' data-bs-placement='top'
            title='Minter address & balance for transaction fees'
        >
            {InfoCircle({ fill: true })}
        </button>;
    }
    componentDidUpdate() {
        const $otf_transfer = document.getElementById(
            'otf-wallet-transfer'
        );
        if ($otf_transfer) {
            Tooltip.getInstance($otf_transfer)?.dispose();
            Tooltip.getOrCreateInstance($otf_transfer);
        }
    }
}
async function depositOtf(
    this: OtfWalletUi, processing: boolean
) {
    if (processing) {
        return;
    } else {
        this.setState({ processing: true });
    }
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const unit = parseUnits('1.0');
    const provider = new Web3Provider(await Blockchain.provider);
    const mmw_signer = provider.getSigner(x40(address));
    const mmw_balance = await mmw_signer.getBalance();
    let gas_limit = parseUnits('0');
    try {
        gas_limit = await mmw_signer.estimateGas({
            value: mmw_balance.lt(unit) ? mmw_balance : unit,
            to: x40(address),
        });
    } catch (ex) {
        this.setState({ processing: false });
        console.error(ex);
        return;
    }
    const gas_price_base = await mmw_signer.getGasPrice();
    const gas_price = gas_price_base.add(parseUnits("1.5", "gwei"));
    const fee = gas_limit.mul(gas_price);
    const value = mmw_balance.lt(unit.add(fee))
        ? mmw_balance.sub(fee) : unit;
    const otf_wallet = await OtfWallet.init();
    const otf_address = await otf_wallet.getAddress();
    try {
        const tx = await mmw_signer.sendTransaction({
            gasLimit: gas_limit, gasPrice: gas_price,
            to: otf_address, value
        });
        tx.wait(1).then(() => {
            this.setState({ processing: false });
        });
        this.setState({ processing: true });
        console.debug('[deposit-otf]', tx);
    } catch (ex) {
        this.setState({ processing: false });
        console.error(ex);
    }
}
async function withdrawOtf(
    this: OtfWalletUi, processing: boolean
) {
    if (processing) {
        return;
    } else {
        this.setState({ processing: true });
    }
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const otf_signer = await OtfWallet.init();
    const otf_balance = await otf_signer.getBalance();
    let gas_limit = parseUnits('0');
    try {
        gas_limit = await otf_signer.estimateGas({
            to: x40(address), value: otf_balance
        });
    } catch (ex) {
        this.setState({ processing: false });
        console.error(ex);
        return;
    }
    const gas_price_base = await otf_signer.getGasPrice();
    const gas_price = gas_price_base.mul(1125).div(1000);
    const fee = gas_limit.mul(gas_price);
    const value = otf_balance.sub(fee);
    try {
        const tx = await otf_signer.sendTransaction({
            gasLimit: gas_limit, gasPrice: gas_price,
            to: x40(address), value
        });
        tx.wait(1).then(() => {
            this.setState({ processing: false });
        });
        this.setState({ processing: true });
        console.debug('[withdraw-otf]', tx);
    } catch (ex) {
        this.setState({ processing: false });
        console.error(ex);
    }
}
export default OtfWalletUi;
