import './home.scss';

import React, { createElement } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '../../source/app';
import { Header } from '../header/header';
import { Connector } from '../connector/connector';
import { WalletUi } from '../wallet/wallet-ui';
import { Selector } from '../selector/selector';
import { Mining } from './mining/mining';
import { Minting } from './minting/minting';
import { Footer } from '../footer/footer';

import { Token } from '../../source/redux/types';
import { Avalanche } from '../../public/images/tsx';

export class Home extends React.Component<{
    token: Token, speed: number
}> {
    constructor(props: {
        token: Token,
        speed: number
    }) {
        super(props);
    }
    render() {
        const { token, speed } = this.props;
        return <React.Fragment>
            <h1>Mine & Mint Proof-of-Work Tokens on Avalanche <Avalanche /></h1>
            <form id='connector'>
                <Connector />
            </form>
            <div id='wallet'>
                <WalletUi token={token} />
            </div>
            <form id='selector'>
                <Selector token={token} />
            </form>
            <form id='mining'>
                <Mining token={token} speed={speed} />
            </form>
            <form id='minting'>
                <Minting token={token} />
            </form>
        </React.Fragment>;
    }
}
if (require.main === module) {
    const $header = document.querySelector('header');
    createRoot($header!).render(createElement(Header, {
        token: App.token, page: App.page
    }));
    const $content = document.querySelector('content');
    createRoot($content!).render(createElement(Home, {
        token: App.token, speed: App.speed
    }));
    const $footer = document.querySelector('footer');
    createRoot($footer!).render(createElement(Footer, {
        token: App.token
    }));
}
export default Home;
