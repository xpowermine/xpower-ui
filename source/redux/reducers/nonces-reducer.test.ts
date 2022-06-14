import { noncesReducer } from './nonces-reducer';

import { addNonce } from '../actions';
import { removeNonce } from '../actions';
import { removeNonceByAmount } from '../actions';
import { removeNonces } from '../actions/nonces-actions';
import { Nonces, Empty, Token } from '../types';

describe('Store w/nonces-reducer', () => {
    const address = BigInt('0xabcd');
    const block_hash = BigInt('0xb10c');
    const token = Token.THOR;
    it('should add a nonce', () => {
        const state_0 = Empty<Nonces>();
        const state_1 = noncesReducer(state_0, addNonce(0xffff, {
            address, amount: 1n, block_hash, token, worker: 0
        }));
        expect(state_1.items[0xffff]).toEqual({
            address, amount: 1n, block_hash, token, worker: 0
        });
        expect(state_1.more).toEqual([0xffff]);
        expect(state_1.less).not.toBeDefined();
    });
    it('should remove a nonce', () => {
        const state_0 = Empty<Nonces>();
        const state_1 = noncesReducer(state_0, addNonce(0xffff, {
            address, amount: 1n, block_hash, token, worker: 0
        }));
        expect(state_1.items[0xffff]).toEqual({
            address, amount: 1n, block_hash, token, worker: 0
        });
        expect(state_1.more).toEqual([0xffff]);
        expect(state_1.less).not.toBeDefined();
        const state_2 = noncesReducer(state_1, removeNonce(0xffff, {
            address, block_hash, token
        }));
        expect(state_2.items[0xffff]).not.toBeDefined();
        expect(state_2.less).toEqual([0xffff]);
        expect(state_2.more).not.toBeDefined();
    });
    it('should remove a nonce by amount', () => {
        const state_0 = Empty<Nonces>();
        const state_1 = noncesReducer(state_0, addNonce(0xffff, {
            address, amount: 1n, block_hash, token, worker: 0
        }));
        expect(state_1.items[0xffff]).toEqual({
            address, amount: 1n, block_hash, token, worker: 0
        });
        expect(state_1.more).toEqual([0xffff]);
        expect(state_1.less).not.toBeDefined();
        const state_2 = noncesReducer(state_1, removeNonceByAmount({
            address, amount: 1n, block_hash, token
        }));
        expect(state_2.items[0xffff]).not.toBeDefined();
        expect(state_2.less).toEqual([0xffff]);
        expect(state_2.more).not.toBeDefined();
    });
    it('should remove all nonces', () => {
        const state_0 = Empty<Nonces>();
        const state_1 = noncesReducer(state_0, addNonce(0xffff1, {
            address, amount: 1n, block_hash, token, worker: 0
        }));
        expect(state_1.items[0xffff1]).toEqual({
            address, amount: 1n, block_hash, token, worker: 0
        });
        expect(state_1.more).toEqual([0xffff1]);
        expect(state_1.less).not.toBeDefined();
        const state_2 = noncesReducer(state_1, addNonce(0xffff2, {
            address, amount: 3n, block_hash, token, worker: 0
        }));
        expect(state_2.items[0xffff2]).toEqual({
            address, amount: 3n, block_hash, token, worker: 0
        });
        expect(state_2.more).toEqual([0xffff2]);
        expect(state_2.less).not.toBeDefined();
        const state_3 = noncesReducer(state_2, removeNonces({
            address: null, token
        }));
        expect(state_3.items[0xffff1]).not.toBeDefined();
        expect(state_3.items[0xffff2]).not.toBeDefined();
        expect(state_3.less).toEqual([0xffff1, 0xffff2]);
        expect(state_3.more).not.toBeDefined();
    });
    it('should remove all nonces (by address)', () => {
        const address_1 = BigInt('0xabcd1');
        const address_2 = BigInt('0xabcd2');
        const state_0 = Empty<Nonces>();
        const state_1 = noncesReducer(state_0, addNonce(0xffff1, {
            address: address_1, block_hash, amount: 1n, token, worker: 0
        }));
        expect(state_1.items[0xffff1]).toEqual({
            address: address_1, block_hash, amount: 1n, token, worker: 0
        });
        expect(state_1.more).toEqual([0xffff1]);
        expect(state_1.less).not.toBeDefined();
        const state_2 = noncesReducer(state_1, addNonce(0xffff2, {
            address: address_2, block_hash, amount: 3n, token, worker: 0
        }));
        expect(state_2.items[0xffff2]).toEqual({
            address: address_2, block_hash, amount: 3n, token, worker: 0
        });
        expect(state_2.more).toEqual([0xffff2]);
        expect(state_2.less).not.toBeDefined();
        const state_3 = noncesReducer(state_2, removeNonces({
            address: address_1, token
        }));
        expect(state_3.items[0xffff1]).not.toBeDefined();
        expect(state_3.items[0xffff2]).toBeDefined();
        expect(state_3.less).toEqual([0xffff1]);
        expect(state_3.more).not.toBeDefined();
        const state_4 = noncesReducer(state_3, removeNonces({
            address: address_2, token
        }));
        expect(state_4.items[0xffff1]).not.toBeDefined();
        expect(state_4.items[0xffff2]).not.toBeDefined();
        expect(state_4.less).toEqual([0xffff2]);
        expect(state_4.more).not.toBeDefined();
    });
});
