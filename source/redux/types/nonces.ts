import { Address, Amount } from './base';
import { Token } from './tokens';

export type BlockHash = bigint;
export type Interval = number;
export type Level = number;
export type Nonce = number;
export type Nonces = {
    /** nonce => { address, block-hash, amount } */
    items: {
        [nonce: Nonce]: {
            address: Address,
            amount: Amount,
            block_hash: BlockHash,
            token: Token,
        };
    };
    /** set for added nonce(s) */
    more?: Nonce[];
    /** set for removed nonce(s) */
    less?: Nonce[];
};
