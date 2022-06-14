import { configureStore } from '@reduxjs/toolkit';
import { combineReducers, Store } from 'redux';
import { tokensReducer } from '../reducers';

import { Action, addToken, removeToken } from '../actions';
import { onTokenAdded, onTokenRemoved } from '.';
import { State, Token } from '../types';

describe('onTokenAdded', () => {
    const token = Token.THOR;
    it('should invoke handler (for addToken)', () => {
        const reducer = combineReducers({
            tokens: tokensReducer
        });
        const store = configureStore({
            reducer, middleware: (m) => m({
                serializableCheck: false
            })
        });
        onTokenAdded(store as Store<State, Action>, (t, i) => {
            expect(t).toEqual(Token.THOR);
            expect(i.amount).toEqual(1n);
            expect(i.supply).toEqual(2n);
        });
        store.dispatch(addToken(token, {
            amount: 1n, supply: 2n
        }));
    });
});
describe('onTokenRemoved', () => {
    const token = Token.LOKI;
    it('should invoke handler (for removeToken)', () => {
        const reducer = combineReducers({
            tokens: tokensReducer
        });
        const store = configureStore({
            reducer, middleware: (m) => m({
                serializableCheck: false
            })
        });
        onTokenRemoved(store as Store<State, Action>, (t, i) => {
            expect(t).toEqual(Token.LOKI);
            expect(i.amount).toEqual(1n);
            expect(i.supply).toEqual(3n);
        });
        store.dispatch(addToken(token, {
            amount: 2n, supply: 3n
        }));
        store.dispatch(removeToken(token, {
            amount: 1n
        }));
    });
});
