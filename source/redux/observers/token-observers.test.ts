import { configureStore } from '@reduxjs/toolkit';
import { combineReducers, Store } from 'redux';
import { tokenReducer } from '../reducers';

import { Action, switchToken } from '../actions';
import { onTokenSwitch } from './token-observers';
import { Token, State } from '../types';

describe('onTokenSwitch', () => {
    it('should invoke handler (for switchToken)', () => {
        const reducer = combineReducers({
            token: tokenReducer
        });
        const store = configureStore({
            reducer, middleware: (m) => m({
                serializableCheck: false
            })
        });
        onTokenSwitch(store as Store<State, Action>, (
            next, prev
        ) => {
            expect(next).toEqual(Token.LOKI);
            expect(prev).toEqual(Token.THOR);
        });
        store.dispatch(switchToken(Token.LOKI));
    });
});
