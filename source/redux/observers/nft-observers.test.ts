import { combineReducers, createStore } from 'redux';
import { nftReducer } from '../reducers';
import { pptReducer } from '../reducers';
import { nonceReducer } from '../reducers';
import { refreshReducer } from '../reducers';
import { tokenReducer } from '../reducers';

import { addNft, removeNft } from '../actions';
import { onNftAdded, onNftRemoved } from '.';

describe('onNftAdded', () => {
    const id = 'THOR:202103';
    it('should invoke handler (for addNft)', () => {
        const reducer = combineReducers({
            nfts: nftReducer,
            ppts: pptReducer,
            nonces: nonceReducer,
            refresh: refreshReducer,
            tokens: tokenReducer,
        });
        const store = createStore(reducer);
        onNftAdded(store, (id, i, {
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
            nfts: nftReducer,
            ppts: pptReducer,
            nonces: nonceReducer,
            refresh: refreshReducer,
            tokens: tokenReducer,
        });
        const store = createStore(reducer);
        onNftRemoved(store, (id, i, {
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
