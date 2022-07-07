import './selector.scss';

import { App } from '../../source/app';
import { Tokenizer } from '../../source/token';
import { Token } from '../../source/redux/types';
import { Tooltip } from '../tooltips';

import React, { createElement, MouseEvent } from 'react';
import { createRoot } from 'react-dom/client';

export class Selector extends React.Component<{
    token: Token
}, {
    token: Token, switching: boolean
}> {
    constructor(props: {
        token: Token
    }) {
        super(props);
        this.state = {
            switching: false, token: this.props.token
        };
        this.events();
    }
    events() {
        App.onTokenSwitch((token) => {
            this.setState({ switching: true, token });
        });
        App.onTokenSwitched((token) => {
            this.setState({ switching: false, token });
        });
    }
    render() {
        return <div
            className='btn-group selectors' role='group'
        >
            {this.$anchor(Token.THOR)}
            {this.$anchor(Token.LOKI)}
            {this.$anchor(Token.ODIN)}
        </div>;
    }
    $anchor(
        token: Token
    ) {
        const selector = `selector-${Tokenizer.lower(token)}`;
        const active = this.state.token === token ? 'active' : '';
        const disabled = this.state.switching ? 'pseudo-disabled' : '';
        const classes = [
            'btn btn-outline-warning', selector, active, disabled
        ];
        return <a
            data-bs-toggle='tooltip' data-bs-placement='top' data-bs-fixed='true'
            href={`?token=${token}`} type='button' title={`XPower ${token}`}
            onClick={(e) => this.switch(e, token)} onMouseLeave={on_leave}
            className={classes.join(' ')}
        >
            {this.$spinner(token)}
            {this.$image(token)}
            {this.$label(token)}
        </a>;
        function on_leave(
            e: MouseEvent<HTMLAnchorElement>
        ) {
            Tooltip.getInstance(e.currentTarget)?.enable();
        }
    }
    switch(
        e: MouseEvent<HTMLAnchorElement>, token: Token
    ) {
        App.switchToken(token);
        e.preventDefault();
    }
    $spinner(
        token: Token
    ) {
        return Spinner({ show: this.show(token) });
    }
    $image(
        token: Token
    ) {
        const token_lc = Tokenizer.lower(this.state.token);
        const fixed_lc = Tokenizer.lower(token);
        const classes = [
            'float-sm-start', this.hide(token) ? 'd-none' : '', token_lc
        ];
        return <img
            alt={token}
            height={24} width={24}
            className={classes.join(' ')}
            src={`/images/svg/${fixed_lc}-black.svg`}
        />;
    }
    $label(
        token: Token
    ) {
        return <span className='d-none d-sm-inline'>{token}</span>;
    }
    show(
        token: Token
    ) {
        const eq = this.state.token === token;
        return eq && this.state.switching;
    }
    hide(
        token: Token
    ) {
        const eq = this.state.token === token;
        return eq && this.state.switching;
    }
    componentDidUpdate() {
        const token_lc = Tokenizer.lower(this.state.token);
        const $selectors = document.getElementsByClassName(
            `selector-${token_lc}`
        );
        if ($selectors.length) {
            Tooltip.getInstance($selectors[0])?.disable();
        }
    }
}
function Spinner(
    state: { show: boolean }
) {
    const classes = [
        'spinner spinner-border spinner-border-sm',
        'float-sm-start', !state.show ? 'd-none' : ''
    ];
    return <span
        className={classes.join(' ')} role='status'
    />;
}
if (require.main === module) {
    const $selector = document.querySelector('form#selector');
    createRoot($selector!).render(createElement(Selector, {
        token: App.token
    }));
}
export default Selector;
