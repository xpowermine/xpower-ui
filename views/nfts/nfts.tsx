import './nfts.scss';

import { App } from '../../source/app';
import { Blockchain } from '../../source/blockchain';
import { x40 } from '../../source/functions';
import { Nft, Nfts, Token } from '../../source/redux/types';
import { NftFullId, NftLevels } from '../../source/redux/types';
import { NftWallet } from '../../source/wallet';
import { OnTransferBatch } from '../../source/wallet';
import { OnTransferSingle } from '../../source/wallet';
import { Years } from '../../source/years';

import { createElement } from 'react';
import { createRoot } from 'react-dom/client';

import React from 'react';
import { NftList } from './list/list';
import { NftMinter } from './minter/minter';

type Props = {
    token: Token
}
type State = {
    token: Token,
    nfts: Nfts
}
export class UiNfts extends React.Component<
    Props, State
> {
    constructor(props: Props) {
        super(props);
        this.state = {
            ...this.props, nfts: App.getNfts({
                token: Nft.token(props.token)
            })
        };
        this.events();
    }
    events() {
        App.onTokenSwitch((token) => this.setState({
            token
        }));
        App.onNftChanged(/*sync-nfts*/() => {
            const token = Nft.token(this.props.token);
            this.setState({ nfts: App.getNfts({ token }) });
        });
    }
    render() {
        const { token, nfts } = this.state;
        return <React.Fragment>
            <form id='single-minting'>
                <NftList token={token} nfts={nfts} />
            </form>
            <form id='batch-minting'>
                <NftMinter token={token} />
            </form>
        </React.Fragment>;
    }
}
Blockchain.onceConnect(async function initNfts({
    address, token
}) {
    let index = 0;
    const levels = Array.from(NftLevels());
    const issues = Array.from(Years()).reverse();
    const wallet = new NftWallet(address, token);
    const balances = await wallet.balances({ issues, levels });
    const supplies = wallet.totalSupplies({ issues, levels });
    const nft_token = Nft.token(
        token
    );
    for (const issue of issues) {
        for (const level of levels) {
            const amount = balances[index];
            const supply = await supplies[index];
            App.setNft({
                issue, level, token: nft_token
            }, {
                amount, supply
            });
            index += 1;
        }
    }
}, {
    per: () => App.token
});
Blockchain.onConnect(function syncNfts({
    token
}) {
    const nfts = App.getNfts({
        token: Nft.token(token)
    });
    for (const [id, nft] of Object.entries(nfts.items)) {
        App.setNft(id as NftFullId, nft);
    }
});
Blockchain.onceConnect(async function onNftSingleTransfers({
    address, token
}) {
    const on_transfer: OnTransferSingle = async (
        op, from, to, id, value, ev
    ) => {
        if (App.token !== token) {
            return;
        }
        console.debug('[on:transfer-single]',
            x40(op), x40(from), x40(to),
            id, value, ev
        );
        const nft_token = Nft.token(
            token
        );
        const nft_id = Nft.fullId({
            issue: Nft.issue(id),
            level: Nft.level(id),
            token: nft_token
        });
        if (address === from) {
            App.removeNft(nft_id, { amount: value });
        }
        if (address === to) {
            App.addNft(nft_id, { amount: value });
        }
    };
    const nft_wallet = new NftWallet(address, token);
    nft_wallet.onTransferSingle(on_transfer)
}, {
    per: () => App.token
});
Blockchain.onceConnect(async function onNftBatchTransfers({
    address, token
}) {
    const on_transfer: OnTransferBatch = async (
        op, from, to, ids, values, ev
    ) => {
        if (App.token !== token) {
            return;
        }
        console.debug('[on:transfer-batch]',
            x40(op), x40(from), x40(to),
            ids, values, ev
        );
        const nft_token = Nft.token(
            token
        );
        for (let i = 0; i < ids.length; i++) {
            const nft_id = Nft.fullId({
                issue: Nft.issue(ids[i]),
                level: Nft.level(ids[i]),
                token: nft_token
            });
            if (address === from) {
                App.removeNft(nft_id, { amount: values[i] });
            }
            if (address === to) {
                App.addNft(nft_id, { amount: values[i] });
            }
        }
    };
    const nft_wallet = new NftWallet(address, token);
    nft_wallet.onTransferBatch(on_transfer);
}, {
    per: () => App.token
});
if (require.main === module) {
    const $nfts = document.querySelector('div#nfts');
    createRoot($nfts!).render(createElement(UiNfts, {
        token: App.token
    }));
}
