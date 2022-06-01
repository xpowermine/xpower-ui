/* eslint @typescript-eslint/no-unused-vars: [off] */
import { Action } from '../actions/nonce-actions';
import { Nonce, Nonces, Empty } from '../types';

export function nonceReducer(
    nonces = Empty<Nonces>(), action: Action
): Nonces {
    if (!action.type.startsWith('nonce')) {
        return nonces;
    }
    if (action.type === 'nonce/add') {
        const delta = [action.payload.nonce] as Nonce[];
        const items = {
            ...nonces.items, [action.payload.nonce]: {
                ...action.payload.item
            }
        };
        return { items, more: delta };
    }
    if (action.type === 'nonce/remove') {
        const delta = [action.payload.nonce] as Nonce[];
        const items = Object.fromEntries(
            Object.entries(nonces.items).filter(([
                nonce, { address, block_hash, token }
            ]) => {
                if (action.payload.item.address === address &&
                    action.payload.item.block_hash === block_hash &&
                    action.payload.item.token === token &&
                    action.payload.nonce === Number(nonce)
                ) {
                    return false;
                }
                return true;
            })
        );
        return { items, less: delta };
    }
    if (action.type === 'nonce/remove-by-amount') {
        const delta = [] as Nonce[];
        const items = Object.fromEntries(
            Object.entries(nonces.items).filter(([
                nonce, { address, amount, token }
            ]) => {
                if (action.payload.item.address === address &&
                    action.payload.item.amount === amount &&
                    action.payload.item.token === token
                ) {
                    delta.push(Number(nonce));
                    return false;
                }
                return true;
            })
        );
        return { items, less: delta };
    }
    if (action.type === 'nonce/remove-all') {
        const delta = [] as Nonce[];
        const items = Object.fromEntries(
            Object.entries(nonces.items).filter(([
                nonce, { address, token }
            ]) => {
                if (action.payload.item.address === address ||
                    action.payload.item.address === null &&
                    action.payload.item.token === token ||
                    action.payload.item.token === null
                ) {
                    delta.push(Number(nonce));
                    return false;
                }
                return true;
            })
        );
        return { items, less: delta };
    }
    return nonces;
}
export default nonceReducer;
