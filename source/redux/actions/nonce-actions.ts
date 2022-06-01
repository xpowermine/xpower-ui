import { Address, Amount, BlockHash, Nonce, Token } from '../types';

export type AddNonce = {
    type: 'nonce/add', payload: {
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
    type: 'nonce/add', payload: {
        nonce, item
    }
});
export type RemoveNonce = {
    type: 'nonce/remove', payload: {
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
    type: 'nonce/remove', payload: {
        nonce, item
    }
});
export type RemoveNonceByAmount = {
    type: 'nonce/remove-by-amount', payload: {
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
    type: 'nonce/remove-by-amount', payload: {
        item
    }
});
export type RemoveNonces = {
    type: 'nonce/remove-all', payload: {
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
    type: 'nonce/remove-all', payload: {
        item
    }
});
export type Action =
    AddNonce | RemoveNonce | RemoveNonceByAmount | RemoveNonces;
