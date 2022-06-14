import { configureStore } from '@reduxjs/toolkit';
import { combineReducers, Store } from 'redux';
import { nftsReducer } from '../reducers';

import { Action, addNft, removeNft } from '../actions';
import { onNftAdded, onNftRemoved } from '.';
import { State } from '../types';

describe('onNftAdded', () => {
    const id = 'THOR:202103';
    it('should invoke handler (for addNft)', () => {
        const reducer = combineReducers({
            nfts: nftsReducer
        });
        const store = configureStore({
            reducer, middleware: (m) => m({
                serializableCheck: false
            })
        });
        onNftAdded(store as Store<State, Action>, (id, i, {
            amount: t_amount, supply: t_supply
        }) => {
            expect(id).toEqual('THOR:202103');
            expect(i.amount).toEqual(1n);
            expect(i.supply).toEqual(2n);
            expect(t_amount).toEqual(1n);
            expect(t_supply).toEqual(2n);
        });
        store.dispatch(addNft(id, {
            amount: 1n, supply: 2n
        }));
    });
});
describe('onNftRemoved', () => {
    const id = 'LOKI:202206';
    it('should invoke handler (for removeNft)', () => {
        const reducer = combineReducers({
            nfts: nftsReducer
        });
        const store = configureStore({
            reducer, middleware: (m) => m({
                serializableCheck: false
            })
        });
        onNftRemoved(store as Store<State, Action>, (id, i, {
            amount: t_amount, supply: t_supply
        }) => {
            expect(id).toEqual('LOKI:202206');
            expect(i.amount).toEqual(1n);
            expect(i.supply).toEqual(3n);
            expect(t_amount).toEqual(1n);
            expect(t_supply).toEqual(3n);
        });
        store.dispatch(addNft(id, {
            amount: 2n, supply: 3n
        }));
        store.dispatch(removeNft(id, {
            amount: 1n
        }));
    });
});
