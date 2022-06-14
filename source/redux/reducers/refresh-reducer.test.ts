import { refreshReducer } from './refresh-reducer';
import { refresh } from '../actions';

describe('Store w/refresh-reducer', () => {
    it('should refresh', () => {
        const state_0 = { date: null };
        const state_1 = refreshReducer(state_0, refresh());
        expect(state_1.date).not.toEqual(null);
    });
});
