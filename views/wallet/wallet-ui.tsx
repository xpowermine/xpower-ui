import './wallet.scss';

import { App } from '../../source/app';
import { Blockchain } from '../../source/blockchain';
import { MiningManager } from '../../source/managers';
import { Token } from '../../source/redux/types';
import { OtfWallet } from '../../source/wallet';

import React, { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { AftWalletUi } from './aft-wallet-ui';
import { OtfWalletUi } from './otf-wallet-ui';
import { CSSTransition } from 'react-transition-group';

export class WalletUi extends React.Component<{
    token: Token
}, {
    token: Token, toggled: boolean
}> {
    constructor(props: {
        token: Token
    }) {
        super(props);
        this.state = {
            toggled: OtfWallet.enabled,
            ...this.props
        };
        this.events();
    }
    events() {
        App.onTokenSwitch((token) =>
            this.setState({ token })
        );
        OtfWallet.onToggled(({ toggled }) => {
            this.setState({ toggled });
        });
    }
    onToggled(toggled: boolean) {
        this.setState({ toggled });
    }
    render() {
        const { token, toggled } = this.state;
        return <React.Fragment>
            <AftWalletUi
                onToggled={this.onToggled.bind(this)}
                toggled={toggled} token={token}
            ></AftWalletUi>
            <CSSTransition
                in={toggled} timeout={600} classNames='fade-in-600'
            >
                <OtfWalletUi toggled={toggled}></OtfWalletUi>
            </CSSTransition>
        </React.Fragment>;
    }
    componentDidUpdate() {
        OtfWallet.enabled = this.state.toggled;
    }
}
Blockchain.onceConnect(async function resumeMiningIf({
    address
}) {
    const on_block = async () => {
        if (OtfWallet.enabled) {
            const otf_balance = await otf_wallet.getBalance();
            if (otf_balance.gt(OtfWallet.threshold)) {
                const miner = MiningManager.miner(address, {
                    token: App.token
                });
                if (miner.running) {
                    miner.resume();
                }
            }
        }
    };
    const otf_wallet = await OtfWallet.init();
    otf_wallet.provider?.on('block', on_block);
});
if (require.main === module) {
    const $wallet = document.querySelector('div#wallet');
    createRoot($wallet!).render(createElement(WalletUi, {
        token: App.token
    }));
}
export default WalletUi;
