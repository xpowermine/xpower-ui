/* eslint @typescript-eslint/no-unused-vars: [off] */
import { Amount, Supply, Empty } from '../types';
import { Nfts, NftFullId, Nft } from '../types';
import { Action } from '../actions/nfts-actions';

export function nftsReducer(
    nfts = Empty<Nfts>(), action: Action
): Nfts {
    if (!action.type.startsWith('nfts/')) {
        return nfts;
    }
    const items = { ...nfts.items };
    const id = typeof action.payload.nft !== 'string'
        ? Nft.fullId(action.payload.nft)
        : action.payload.nft;
    if (action.type === 'nfts/set') {
        const s = action.payload.item.supply;
        const a = action.payload.item.amount;
        items[id] = pack(a, s, { id });
        return { items, more: [id] };
    }
    if (action.type === 'nfts/add') {
        const item_old = items[id];
        const item_new = {
            amount: action.payload.item?.amount ?? 1n,
            supply: action.payload.item?.supply
        };
        if (item_old) {
            const s = item_new.supply ?? item_old.supply + item_new.amount;
            const a = item_old.amount + item_new.amount;
            items[id] = pack(a, s, { id });
        } else {
            const s = item_new.supply ?? item_new.amount;
            const a = item_new.amount;
            items[id] = pack(a, s, { id });
        }
        return { items, more: [id] };
    }
    if (action.type === 'nfts/remove') {
        const item_old = items[id];
        const item_new = {
            amount: action.payload.item?.amount ?? 1n,
            supply: action.payload.item?.supply
        };
        if (item_old) {
            const s = item_new.supply ?? item_old.supply;
            const a = item_old.amount - item_new.amount;
            items[id] = pack(a, s, { id });
        } else {
            const s = item_new.supply ?? 0n;
            const a = 0n - item_new.amount;
            items[id] = pack(a, s, { id });
        }
        return { items, less: [id] };
    }
    return nfts;
}
function pack(amount: Amount, supply: Supply, { id }: { id: NftFullId }) {
    if (supply < amount) {
        throw new Error(`NFT(${id}) supply=${supply} < amount=${amount}`);
    }
    if (supply < 0) {
        throw new Error(`NFT(${id}) supply=${supply} < 0`);
    }
    return { amount, supply };
}
export default nftsReducer;
