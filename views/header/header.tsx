import { Page, Token } from '../../source/redux/types';
import { App } from '../../source/app';

import React from 'react';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';

class Header extends React.Component<{
    token: Token, page: Page
}, {
    token: Token
}> {
    constructor(props: {
        token: Token, page: Page
    }) {
        super(props);
        this.state = {
            token: props.token
        };
        this.events();
    }
    events() {
        App.onTokenSwitch((token) => this.setState({ token }));
    }
    render() {
        return <nav id='menu' className='nav nav-pills nav-justified mb-3'>
            {this.a(Page.Home, 'XPower', 'bi-lightning-charge-fill')}
            {this.a(Page.Nfts, 'NFTs', 'bi-image-fill')}
            {this.a(Page.Staking, 'Staking', 'bi-cash-stack')}
            {this.a(Page.About, 'About', 'bi-lightbulb-fill')}
        </nav>;
    }
    a(page: Page, text: string, icon: string) {
        return <a href={`/${page}?token=` + this.state.token} className={
            `flex-sm-fill text-sm-center nav-link ${this.active(page)}`
        }>
            <i className={`${icon} float-sm-start`} />
            <span className='d-none d-sm-inline'>{text}</span>
        </a>;
    }
    active(page: Page) {
        return this.props.page === page ? `active ${page}` : page;
    }
}
const container = document.querySelector('header');
const root = createRoot(container!);
root.render(createElement(Header, {
    token: App.token, page: App.page
}));
