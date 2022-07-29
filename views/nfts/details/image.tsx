import { App } from '../../../source/app';
import { Blockchain } from '../../../source/blockchain';
import { Nft, Token } from '../../../source/redux/types';
import { NftIssue, NftLevel } from '../../../source/redux/types';
import { NftWallet, NftWalletMock } from '../../../source/wallet';

import React from 'react';

type Props = {
    token: Token,
    issue: NftIssue,
    level: NftLevel,
    toggled: boolean
}
type State = {
    href?: string,
    image: string,
    loading: boolean
}
export class NftImage extends React.Component<
    Props, State
> {
    constructor(props: Props) {
        super(props);
        this.state = {
            image: '',
            loading: false
        }
        this.events();
    }
    events() {
        App.onTokenSwitch((token) => {
            this.setState({ image: '', loading: true }, () => {
                meta(level, issue, token).then(({ image }) => {
                    this.setState({ image });
                });
            });
            this.setState({ href: undefined }, () => {
                href(level, issue, token).then((href) => {
                    if (href) this.setState({
                        href: href.toString()
                    });
                });
            });
        });
        const { level, issue, token } = this.props;
        meta(level, issue, token).then(({ image }) => {
            this.setState({ image, loading: true });
        });
        href(level, issue, token).then((href) => {
            if (href) this.setState({
                href: href.toString()
            });
        });
    }
    render() {
        const { level, issue } = this.props;
        const { href, loading } = this.state;
        return <div
            className='nft-image-wrap'
        >
            <a target='_blank' href={href}>
                {this.$spinner(loading)}
                {this.$image(level, issue)}
            </a>
        </div>;
    }
    $spinner(
        loading: boolean
    ) {
        return <span
            className='spinner spinner-border'
            role='status' style={{
                color: 'var(--xp-powered)',
                display: loading ? 'block' : 'none'
            }}
        />;
    }
    $image(
        level: NftLevel, issue: NftIssue
    ) {
        const { toggled } = this.props;
        const { href, image } = this.state;
        const id = Nft.coreId({ level, issue });
        const cursor = href ? 'pointer' : 'default';
        const display = toggled ? 'block' : 'none';
        const title = this.title(level, issue);
        return <img
            className='img-fluid nft-image'
            data-bs-placement='top'
            data-bs-toggle='tooltip'
            data-id={id}
            loading='lazy'
            onLoad={this.onLoad.bind(this)}
            src={image}
            style={{ cursor, display }}
            title={title}
        />;
    }
    onLoad() {
        this.setState({ loading: false });
    }
    title(
        level: NftLevel, issue: NftIssue
    ) {
        const rank = issue / 3 + 1;
        const name = Nft.nameOf(level);
        const id = Nft.coreId({ level, issue });
        return `Trade ${name} NFTs (level ${rank}/9 & ID #${id})`;
    }
}
async function meta(
    level: NftLevel, issue: NftIssue, token: Token
) {
    const address = await Blockchain.selectedAddress;
    if (address) {
        return get_meta(new NftWallet(address, token));
    } else {
        return get_meta(new NftWalletMock(0n, token));
    }
    async function get_meta(nft_wallet: NftWallet) {
        const nft_id = await nft_wallet.idBy(issue, level);
        return nft_wallet.meta(nft_id);
    }
}
async function href(
    level: NftLevel, issue: NftIssue, token: Token
) {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const nft_wallet = new NftWallet(address, token);
    const nft_id = Nft.coreId({ level, issue });
    const supply = await nft_wallet.totalSupply(nft_id);
    if (supply > 0) {
        const nft_contract = await nft_wallet.contract;
        const market = 'https://nftrade.com/assets/avalanche';
        return new URL(`${market}/${nft_contract.address}/${nft_id}`);
    }
    return null;
}
export default NftImage;
