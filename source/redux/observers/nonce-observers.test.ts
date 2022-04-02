import { combineReducers, createStore } from 'redux';
import { nftReducer } from '../reducers';
import { pptReducer } from '../reducers';
import { nonceReducer } from '../reducers';
import { refreshReducer } from '../reducers';
import { tokenReducer } from '../reducers';

import { addNonce, removeNonce, removeNonceByAmount } from '../actions';
import { onNonceAdded, onNonceRemoved } from '.';

describe('onNonceAdded', () => {
    const address = BigInt('0xabcd');
    const block_hash = BigInt('0xb10c');
    it('should invoke handler (for addNonce)', () => {
        const reducer = combineReducers({
            nfts: nftReducer,
            ppts: pptReducer,
            nonces: nonceReducer,
            refresh: refreshReducer,
            tokens: tokenReducer,
        });
        const store = createStore(reducer);
        onNonceAdded(store, (n, i, t_by, t) => {
            expect(n).toEqual(0xffff);
            expect(i.address).toEqual(address);
            expect(i.block_hash).toEqual(block_hash);
            expect(i.amount).toEqual(1n);
            expect(t_by).toEqual(1n);
            expect(t).toEqual(1n);
        });
        store.dispatch(addNonce(0xffff, {
            address, block_hash, amount: 1n, worker: 0
        }));
    });
});
describe('onNonceRemoved', () => {
    const address = BigInt('0xabcd');
    const block_hash = BigInt('0xb10c');
    it('should invoke handler (for removeNonce)', () => {
        const reducer = combineReducers({
            nfts: nftReducer,
            ppts: pptReducer,
            nonces: nonceReducer,
            refresh: refreshReducer,
            tokens: tokenReducer,
        });
        const store = createStore(reducer);
        onNonceRemoved(store, (n, i, t_by, t) => {
            expect(n).toEqual(0xffff);
            expect(i.address).toEqual(address);
            expect(i.block_hash).toEqual(block_hash);
            expect(i.amount).toEqual(1n);
            expect(t_by).toEqual(0n);
            expect(t).toEqual(0n);
        });
        store.dispatch(addNonce(0xffff, {
            address, block_hash, amount: 1n, worker: 0
        }));
        store.dispatch(removeNonce(0xffff, {
            address, block_hash
        }));
    });
    it('should invoke handler (for removeNonceByAmount)', () => {
        const reducer = combineReducers({
            nfts: nftReducer,
            ppts: pptReducer,
            nonces: nonceReducer,
            refresh: refreshReducer,
            tokens: tokenReducer,
        });
        const store = createStore(reducer);
        onNonceRemoved(store, (n, i, t_by, t) => {
            expect(n).toEqual(0xffff);
            expect(i.address).toEqual(address);
            expect(i.block_hash).toEqual(block_hash);
            expect(i.amount).toEqual(1n);
            expect(t_by).toEqual(0n);
            expect(t).toEqual(0n);
        });
        store.dispatch(addNonce(0xffff, {
            address, block_hash, amount: 1n, worker: 0
        }));
        store.dispatch(removeNonceByAmount({
            address, block_hash, amount: 1n
        }));
    });
});
