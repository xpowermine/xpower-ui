import './nfts.scss';

import { App } from '../../source/app';
import { Blockchain } from '../../source/blockchain';
import { update, x40 } from '../../source/functions';
import { Amount, Balance, Token } from '../../source/redux/types';
import { Nft, Nfts, NftFullId } from '../../source/redux/types';
import { NftLevel, NftLevels } from '../../source/redux/types';
import { MoeWallet, NftWallet, OnTransfer } from '../../source/wallet';
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
    token: Token;
    nfts: Nfts;
    list: List;
}
type List = Record<NftLevel, {
    amount: Amount;
    max: Amount;
    min: Amount;
    toggled: boolean;
}>;
function list(
    amount = 0n, max = 0n, min = 0n, toggled = false
) {
    const entries = Array.from(NftLevels()).map(
        (nft_level): [
            NftLevel, List[NftLevel]
        ] => [nft_level, {
            amount, max, min, toggled
        }]
    );
    return Object.fromEntries(entries) as List;
}

export class UiNfts extends React.Component<
    Props, State
> {
    constructor(props: Props) {
        super(props);
        const { token } = this.props;
        this.state = {
            list: list(),
            nfts: App.getNfts({
                token: Nft.token(token)
            }),
            token
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
        Blockchain.onConnect(async/*init-state*/({
            address, token
        }) => {
            const moe_wallet = new MoeWallet(address, token);
            set_list(await moe_wallet.balance);
        });
        Blockchain.onceConnect(async/*sync-state*/({
            address, token
        }) => {
            const on_transfer: OnTransfer = async () => {
                set_list(await moe_wallet.balance);
            };
            const moe_wallet = new MoeWallet(address, token);
            moe_wallet.onTransfer(on_transfer);
        }, {
            per: () => App.token
        });
        const set_list = (
            balance: Balance
        ) => {
            const entries = Array.from(NftLevels()).map((nft_level): [
                NftLevel, Omit<List[NftLevel], 'toggled'>
            ] => {
                const remainder = balance % 10n ** (BigInt(nft_level) + 3n);
                const amount = remainder / 10n ** BigInt(nft_level);
                return [nft_level, { amount, max: amount, min: 0n }];
            });
            update<State>.bind(this)({
                list: Object.fromEntries(entries)
            });
        };
    }
    render() {
        const { token, nfts, list } = this.state;
        return <React.Fragment>
            <form id='single-minting'>
                <NftList
                    onList={(list) => {
                        update<State>.bind(this)({ list });
                    }}
                    list={list}
                    nfts={nfts}
                    token={token}
                />
            </form>
            <form id='batch-minting'>
                <NftMinter
                    list={list}
                    token={token}
                />
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
