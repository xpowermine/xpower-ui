import { Address, Amount, BlockHash, Nonce, Token } from '../types';

export type AddNonce = {
    type: 'nonces/add', payload: {
        nonce: Nonce, item: {
            address: Address,
            amount: Amount,
            block_hash: BlockHash,
            token: Token,
            worker: number,
        }
    }
};
export const addNonce = (
    nonce: Nonce, item: {
        address: Address,
        amount: Amount,
        block_hash: BlockHash,
        token: Token,
        worker: number,
    }
): AddNonce => ({
    type: 'nonces/add', payload: {
        nonce, item
    }
});
export type RemoveNonce = {
    type: 'nonces/remove', payload: {
        nonce: Nonce, item: {
            address: Address,
            block_hash: BlockHash,
            token: Token,
        }
    }
};
export const removeNonce = (
    nonce: Nonce, item: {
        address: Address,
        block_hash: BlockHash,
        token: Token,
    }
): RemoveNonce => ({
    type: 'nonces/remove', payload: {
        nonce, item
    }
});
export type RemoveNonceByAmount = {
    type: 'nonces/remove-by-amount', payload: {
        item: {
            address: Address,
            amount: Amount,
            block_hash: BlockHash,
            token: Token,
        }
    }
};
export const removeNonceByAmount = (
    item: {
        address: Address,
        amount: Amount,
        block_hash: BlockHash,
        token: Token,
    }
): RemoveNonceByAmount => ({
    type: 'nonces/remove-by-amount', payload: {
        item
    }
});
export type RemoveNonces = {
    type: 'nonces/remove-all', payload: {
        item: {
            address: Address | null,
            token: Token | null,
        }
    }
};
export const removeNonces = (
    item: {
        address: Address | null,
        token: Token | null,
    }
): RemoveNonces => ({
    type: 'nonces/remove-all', payload: {
        item
    }
});
export type Action =
    AddNonce | RemoveNonce | RemoveNonceByAmount | RemoveNonces;
