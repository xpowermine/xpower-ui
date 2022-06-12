import { App } from '../../source/app';
import { Page, Token } from '../../source/redux/types';

import React, { createElement } from 'react';
import { createRoot } from 'react-dom/client';

export class Header extends React.Component<{
    token: Token, page: Page,
}, {
    token: Token, page: Page,
}> {
    constructor(props: {
        token: Token, page: Page
    }) {
        super(props);
        this.state = {
            ...props
        };
        this.events();
    }
    events() {
        App.onPageSwitch((page) => this.setState({
            page
        }))
        App.onTokenSwitch((token) => this.setState({
            token
        }));
    }
    render() {
        return <nav
            className='nav nav-pills nav-justified mb-3' id='menu'
        >
            {this.$anchor(Page.Home)}
            {this.$anchor(Page.Nfts)}
            {this.$anchor(Page.Staking)}
            {this.$anchor(Page.About)}
        </nav>;
    }
    $anchor(page: Page) {
        const active = this.props.page === page ? `active ${page}` : page;
        const classes = [
            'btn btn-outline-warning',
            'flex-sm-fill text-sm-center',
            'nav-link', active
        ];
        return <a
            href={`/${page}?token=${this.state.token}`}
            className={classes.join(' ')}
        >
            {this.$icon(page)}
            {this.$label(page)}
        </a>;
    }
    $icon(page: Page) {
        const classes = [
            'float-sm-start', this.icons[page]
        ];
        return <i className={classes.join(' ')} />;
    }
    $label(page: Page) {
        return <span className='d-none d-sm-inline'>
            {this.labels[page]}
        </span>;
    }
    icons: Record<Page, string> = {
        [Page.Home]: 'bi-lightning-charge-fill',
        [Page.Nfts]: 'bi-image-fill',
        [Page.Staking]: 'bi-cash-stack',
        [Page.About]: 'bi-lightbulb-fill',
        [Page.None]: '',
    }
    labels: Record<Page, string> = {
        [Page.Home]: 'XPower',
        [Page.Nfts]: 'NFTs',
        [Page.Staking]: 'Staking',
        [Page.About]: 'About',
        [Page.None]: '',
    }
}
if (require.main === module) {
    const $header = document.querySelector('header');
    createRoot($header!).render(createElement(Header, {
        token: App.token, page: App.page
    }));
}
export default Header;
