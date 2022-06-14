import { configureStore } from '@reduxjs/toolkit';
import { combineReducers, Store } from 'redux';
import { pageReducer } from '../reducers';

import { Action, switchPage } from '../actions';
import { onPageSwitch } from './page-observers';
import { Page, State } from '../types';

describe('onPageSwitch', () => {
    it('should invoke handler (for switchPage)', () => {
        const reducer = combineReducers({
            page: pageReducer
        });
        const store = configureStore({
            reducer, middleware: (m) => m({
                serializableCheck: false
            })
        });
        onPageSwitch(store as Store<State, Action>, (
            next, prev
        ) => {
            expect(next).toEqual(Page.About);
            expect(prev).toEqual(Page.None);
        });
        store.dispatch(switchPage(Page.About));
    });
});
