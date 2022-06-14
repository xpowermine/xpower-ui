import { configureStore } from '@reduxjs/toolkit';
import { combineReducers, Store } from 'redux';
import { noncesReducer } from '../reducers';

import { Action, addNonce, removeNonce, removeNonceByAmount } from '../actions';
import { onNonceAdded, onNonceRemoved } from '.';
import { State, Token } from '../types';

describe('onNonceAdded', () => {
    const address = BigInt('0xabcd');
    const block_hash = BigInt('0xb10c');
    const token = Token.THOR;
    it('should invoke handler (for addNonce)', () => {
        const reducer = combineReducers({
            nonces: noncesReducer
        });
        const store = configureStore({
            reducer, middleware: (m) => m({
                serializableCheck: false
            })
        });
        onNonceAdded(store as Store<State, Action>, (
            n, i, t_by, t
        ) => {
            expect(n).toEqual(0xffff);
            expect(i.address).toEqual(address);
            expect(i.amount).toEqual(1n);
            expect(i.block_hash).toEqual(block_hash);
            expect(i.token).toEqual(Token.THOR);
            expect(t_by).toEqual(1n);
            expect(t).toEqual(1n);
        });
        store.dispatch(addNonce(0xffff, {
            address, amount: 1n, block_hash, token, worker: 0
        }));
    });
});
describe('onNonceRemoved', () => {
    const address = BigInt('0xabcd');
    const block_hash = BigInt('0xb10c');
    const token = Token.THOR;
    it('should invoke handler (for removeNonce)', () => {
        const reducer = combineReducers({
            nonces: noncesReducer
        });
        const store = configureStore({
            reducer, middleware: (m) => m({
                serializableCheck: false
            })
        });
        onNonceRemoved(store as Store<State, Action>, (
            n, i, t_by, t
        ) => {
            expect(n).toEqual(0xffff);
            expect(i.address).toEqual(address);
            expect(i.amount).toEqual(1n);
            expect(i.block_hash).toEqual(block_hash);
            expect(i.token).toEqual(Token.THOR);
            expect(t_by).toEqual(0n);
            expect(t).toEqual(0n);
        });
        store.dispatch(addNonce(0xffff, {
            address, amount: 1n, block_hash, token, worker: 0
        }));
        store.dispatch(removeNonce(0xffff, {
            address, block_hash, token
        }));
    });
    it('should invoke handler (for removeNonceByAmount)', () => {
        const reducer = combineReducers({
            nonces: noncesReducer
        });
        const store = configureStore({
            reducer, middleware: (m) => m({
                serializableCheck: false
            })
        });
        onNonceRemoved(store as Store<State, Action>, (
            n, i, t_by, t
        ) => {
            expect(n).toEqual(0xffff);
            expect(i.address).toEqual(address);
            expect(i.amount).toEqual(1n);
            expect(i.block_hash).toEqual(block_hash);
            expect(i.token).toEqual(Token.THOR);
            expect(t_by).toEqual(0n);
            expect(t).toEqual(0n);
        });
        store.dispatch(addNonce(0xffff, {
            address, amount: 1n, block_hash, token, worker: 0
        }));
        store.dispatch(removeNonceByAmount({
            address, amount: 1n, block_hash, token
        }));
    });
});
