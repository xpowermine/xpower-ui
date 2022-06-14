import { tokenReducer } from './token-reducer';
import { switchToken } from '../actions';
import { Token } from '../types';

describe('Store w/token-reducer', () => {
    it('should switch from THOR to LOKI', () => {
        const state_0 = Token.THOR;
        const state_1 = tokenReducer(state_0, switchToken(Token.LOKI));
        expect(state_1).toEqual(Token.LOKI);
    });
    it('should switch from LOKI to ODIN', () => {
        const state_0 = Token.LOKI;
        const state_1 = tokenReducer(state_0, switchToken(Token.ODIN));
        expect(state_1).toEqual(Token.ODIN);
    });
    it('should switch from ODIN to HELA', () => {
        const state_0 = Token.ODIN;
        const state_1 = tokenReducer(state_0, switchToken(Token.HELA));
        expect(state_1).toEqual(Token.HELA);
    });
    it('should switch from HELA to THOR', () => {
        const state_0 = Token.HELA;
        const state_1 = tokenReducer(state_0, switchToken(Token.THOR));
        expect(state_1).toEqual(Token.THOR);
    });
});
