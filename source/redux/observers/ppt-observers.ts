/* eslint @typescript-eslint/no-unused-vars: [off] */
import { Store, Unsubscribe } from 'redux';
import { observe } from './observe';

import { NftFullId, Nfts, Empty } from '../types';
import { Amount, Supply, State } from '../types';
import { Action } from '../actions';

export type OnPptAdded = (
    id: NftFullId,
    item: { amount: Amount, supply: Supply },
    total_by: { amount: Amount, supply: Supply }
) => void;
export type OnPptRemoved = (
    id: NftFullId,
    item: { amount: Amount, supply: Supply },
    total_by: { amount: Amount, supply: Supply }
) => void;

export function onPptAdded(
    store: Store<State, Action>, handler: OnPptAdded
): Unsubscribe {
    const selector = (state: State) => state.ppts;
    const observer = observe<Nfts>(store)(
        selector, Empty<Nfts>()
    );
    return observer((next) => {
        const added = (id: NftFullId) => {
            const amount = Object.entries(next.items)
                .filter(([nft_id]) => nft_id.endsWith(id.slice(-2)))
                .map(([_, { amount }]) => amount)
                .reduce((t, a) => t + a, 0n);
            const supply = Object.entries(next.items)
                .filter(([nft_id]) => nft_id.endsWith(id.slice(-2)))
                .map(([_, { supply }]) => supply)
                .reduce((t, s) => t + s, 0n);
            handler(
                id, next.items[id], { amount, supply });
        };
        if (next.more) {
            next.more.forEach(added);
        }
    });
}
export function onPptRemoved(
    store: Store<State, Action>, handler: OnPptRemoved
): Unsubscribe {
    const selector = (state: State) => state.ppts;
    const observer = observe<Nfts>(store)(
        selector, Empty<Nfts>()
    );
    return observer((next) => {
        const removed = (id: NftFullId) => {
            const amount = Object.entries(next.items)
                .filter(([nft_id]) => nft_id.endsWith(id.slice(-2)))
                .map(([_, { amount }]) => amount)
                .reduce((t, a) => t + a, 0n);
            const supply = Object.entries(next.items)
                .filter(([nft_id]) => nft_id.endsWith(id.slice(-2)))
                .map(([_, { supply }]) => supply)
                .reduce((t, s) => t + s, 0n);
            handler(
                id, next.items[id], { amount, supply });
        };
        if (next.less) {
            next.less.forEach(removed);
        }
    });
}
