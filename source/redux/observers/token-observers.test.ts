import { combineReducers, createStore } from 'redux';
import { nftReducer } from '../reducers';
import { pptReducer } from '../reducers';
import { nonceReducer } from '../reducers';
import { refreshReducer } from '../reducers';
import { tokenReducer } from '../reducers';

import { Token } from '../types';
import { addToken, removeToken } from '../actions';
import { onTokenAdded, onTokenRemoved } from '.';

describe('onTokenAdded', () => {
    const token = Token.THOR;
    it('should invoke handler (for addToken)', () => {
        const reducer = combineReducers({
            nfts: nftReducer,
            ppts: pptReducer,
            nonces: nonceReducer,
            refresh: refreshReducer,
            tokens: tokenReducer,
        });
        const store = createStore(reducer);
        onTokenAdded(store, (t, i) => {
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
            nfts: nftReducer,
            ppts: pptReducer,
            nonces: nonceReducer,
            refresh: refreshReducer,
            tokens: tokenReducer,
        });
        const store = createStore(reducer);
        onTokenRemoved(store, (t, i) => {
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
