import { App } from '../../source/app/app';
import { Blockchain } from '../../source/blockchain';
import { ChainId } from '../../source/blockchain';
import { capitalize } from '../../routes/functions';
import { Token } from '../../source/redux/types';

import React, { createElement } from 'react';
import { createRoot } from 'react-dom/client';

export class Footer extends React.Component<{
    token: Token
}, {
    token: Token
}> {
    static get host() {
        const host = location.host;
        if (host.match(/localhost/i)) {
            return capitalize(host, 1);
        } else {
            return capitalize(
                host.replace(/www\./i, ''), 2
            );
        }
    }
    constructor(props: {
        token: Token
    }) {
        super(props);
        this.state = {
            ...props
        };
        this.events();
    }
    events() {
        App.onTokenSwitch((token) => this.setState({
            token
        }));
    }
    render() {
        const host = Footer.host;
        const token = this.state.token;
        const year = new Date().getFullYear();
        return <nav
            className='navbar px-2 py-0'
        >
            <ul className='navbar-nav'>
                <li className='nav-item'>
                    <span>&copy;</span>
                    <span>{' ' + year}</span>
                    <span className='d-none d-sm-inline'>{' ' + host}</span>
                </li>
            </ul>
            <ul className='navbar-nav d-flex flex-row ml-auto'>
                <li className='nav-item pb-1 pt-1 pe-1'>
                    <a className='nav-link link-light lower migrate'
                        data-bs-toggle='tooltip' data-bs-placement='top'
                        title='Migrate tokens' href={`/migrate?token=${token}`}
                    >
                        <i className='bi bi-capslock-fill'></i>
                        <i className='bi bi-capslock'></i>
                    </a>
                </li>
                <li className='nav-item pb-1 pt-1 pe-1'>
                    <a className='nav-link link-light lower smart-contract'
                        data-bs-toggle='tooltip' data-bs-placement='top'
                        title={`Smart contract of the ${token} token`}
                        target='_blank' href={this.contractUrl(token)}
                    >
                        <i className='bi bi-cpu-fill'></i>
                        <i className='bi bi-cpu'></i>
                    </a>
                </li>
                <li className='nav-item pb-1 pt-1 pe-1'>
                    <a className='nav-link link-light lower add-token'
                        data-bs-toggle='tooltip' data-bs-placement='top'
                        title={`Add the ${token} token to your Metamask`}
                        href='#' onClick={this.addToken.bind(this, token)}
                    >
                        <i className='bi bi-plus-square-fill'></i>
                        <i className='bi bi-plus-square'></i>
                    </a>
                </li>
                <li className='nav-item pb-1 pt-1 pe-1'>
                    <a className='nav-link link-light lower github'
                        data-bs-toggle='tooltip' data-bs-placement='top'
                        title='GitHub' href='https://github.com/xpowermine'
                        target='_blank'
                    >
                        <i className='bi bi-github'></i>
                    </a>
                </li>
                <li className='nav-item pb-1 pt-1 pe-1'>
                    <a className='discord nav-link'
                        data-bs-toggle='tooltip' data-bs-placement='top'
                        title='Discord' href='https://discord.gg/vzRa4FAZXd'
                        target='_blank' rel='noreferrer'
                    >
                        <svg xmlns='http://www.w3.org/2000/svg' className='bi bi-discord' width='16' height='16' viewBox='0 0 16 16' role='img'>
                            <path fill='currentColor' d='M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z'></path>
                        </svg>
                    </a>
                </li>
                <li className='nav-item pb-1 pt-1 pe-1'>
                    <a className='telegram nav-link'
                        data-bs-toggle='tooltip' data-bs-placement='top'
                        title='Telegram' href='https://t.me/+hv7s-mkabhw5ZjQ0'
                        target='_blank' rel='noreferrer'
                    >
                        <svg xmlns='http://www.w3.org/2000/svg' className='bi bi-telegram' width='16' height='16' viewBox='0 0 16 16' role='img'>
                            <path fill='currentColor' d='M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 0 0-.013-.315.337.337 0 0 0-.114-.217.526.526 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09z'></path>
                        </svg>
                    </a>
                </li>
                <li className='nav-item pb-1 pt-1 pe-1'>
                    <a className='twitter nav-link'
                        data-bs-toggle='tooltip' data-bs-placement='top'
                        title='Twitter' href='https://twitter.com/xpowermine'
                        target='_blank' rel='noreferrer'
                    >
                        <svg xmlns='http://www.w3.org/2000/svg' className='bi bi-twitter' width='16' height='16' viewBox='0 0 16 16' role='img'>
                            <path fill='currentColor' d='M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z'></path>
                        </svg>
                    </a>
                </li>
                <li className='nav-item d-none d-sm-block'>
                    <a className='avalanche nav-link'
                        data-bs-toggle='tooltip' data-bs-placement='top'
                        title='Powered by Avalanche' href='https://www.avalabs.org/'
                        target='_blank' rel='noreferrer'
                    >
                        <img className='fff'
                            src='/images/png/avalanche-logo/powered-by-avalanche[fff].png'
                            alt='Avalanche Logo' height='32' width='93'
                        />
                        <img className='red'
                            src='/images/png/avalanche-logo/powered-by-avalanche[red].png'
                            alt='Avalanche Logo' height='32' width='93'
                        />
                    </a>
                </li>
            </ul>
        </nav>;
    }
    async addToken(token: Token) {
        if (await Blockchain.isInstalled()) {
            if (await Blockchain.isAvalanche()) {
                const $moe = document.getElementById(
                    `g-${token}_MOE_${App.version}`
                );
                const moe = BigInt($moe?.dataset.value as string);
                const $symbol = document.getElementById(
                    `g-${token}_SYMBOL_${App.version}`
                );
                const symbol = String($symbol?.dataset.value);
                const $decimals = document.getElementById(
                    `g-${token}_DECIMALS_${App.version}`
                );
                const decimals = Number($decimals?.dataset.value);
                const $image = document.getElementById(
                    `g-${token}_IMAGE_${App.version}`
                );
                const image = $image?.dataset.value;
                Blockchain.addToken({
                    address: moe, symbol, decimals, image
                });
            } else {
                Blockchain.switchTo(ChainId.AVALANCHE_MAINNET);
            }
        } else {
            open('https://metamask.io/download.html');
        }
    }
    contractUrl(token: Token) {
        const $address = document.getElementById(
            `g-${token}_MOE_${App.version}`
        );
        const address = String($address?.dataset.value);
        return `https://snowtrace.io/address/${address}`;
    }
}
if (require.main === module) {
    const $footer = document.querySelector('footer');
    createRoot($footer!).render(createElement(Footer, {
        token: App.token
    }));
}
export default Footer;
