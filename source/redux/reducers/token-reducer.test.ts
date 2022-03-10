/* eslint @typescript-eslint/no-explicit-any: [off] */
import { tokenReducer } from './token-reducer';

import { setToken } from '../actions';
import { addToken } from '../actions';
import { removeToken } from '../actions';
import { Token, Tokens, Empty } from '../types';

describe('Store w/tokenReducer (set)', () => {
    const t = Token.PARA;
    it('should set 1 token', () => {
        const state_0 = Empty<Tokens>();
        const state_1 = tokenReducer(state_0, setToken(t, {
            amount: 1n, supply: 1n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 1n, supply: 1n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
    });
    it('should set 2 tokens', () => {
        const state_0 = Empty<Tokens>();
        const state_1 = tokenReducer(state_0, setToken(t, {
            amount: 2n, supply: 5n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 2n, supply: 5n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
    });
});
describe('Store w/tokenReducer (add)', () => {
    const t = Token.AQCH;
    it('should add 1 token (w/rel. supply)', () => {
        const state_0 = Empty<Tokens>();
        const state_1 = tokenReducer(state_0, addToken(t, {
            amount: 1n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 1n, supply: 1n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
    });
    it('should add 1 token (w/abs. supply)', () => {
        const state_0 = Empty<Tokens>();
        const state_1 = tokenReducer(state_0, addToken(t, {
            amount: 1n, supply: 10n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 1n, supply: 10n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
    });
    it('should *not* add 1 token (w/abs. supply)', () => {
        const state_0 = Empty<Tokens>();
        let state_1;
        try {
            state_1 = tokenReducer(state_0, addToken(t, {
                amount: 2n, supply: 1n
            }));
        } catch (ex: any) {
            expect(ex.message).toBe(`${t} supply=1 < amount=2`)
        }
        expect(state_1).not.toBeDefined();
    });
    it('should add 2 tokens (w/1st:rel. supply & 2nd:rel. supply)', () => {
        const state_0 = Empty<Tokens>();
        const state_1 = tokenReducer(state_0, addToken(t, {
            amount: 1n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 1n, supply: 1n
        });
        const state_2 = tokenReducer(state_1, addToken(t, {
            amount: 2n
        }));
        expect(state_2.items[t]).toEqual({
            amount: 3n, supply: 3n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).toEqual([t]);
        expect(state_2.less).not.toBeDefined();
    });
    it('should add 2 tokens (w/1st:abs. supply & 2nd:rel. supply)', () => {
        const state_0 = Empty<Tokens>();
        const state_1 = tokenReducer(state_0, addToken(t, {
            amount: 1n, supply: 10n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 1n, supply: 10n
        });
        const state_2 = tokenReducer(state_1, addToken(t, {
            amount: 2n
        }));
        expect(state_2.items[t]).toEqual({
            amount: 3n, supply: 12n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).toEqual([t]);
        expect(state_2.less).not.toBeDefined();
    });
    it('should add 2 tokens (w/1st:rel. supply & 2nd:abs. supply)', () => {
        const state_0 = Empty<Tokens>();
        const state_1 = tokenReducer(state_0, addToken(t, {
            amount: 1n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 1n, supply: 1n
        });
        const state_2 = tokenReducer(state_1, addToken(t, {
            amount: 2n, supply: 20n
        }));
        expect(state_2.items[t]).toEqual({
            amount: 3n, supply: 20n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).toEqual([t]);
        expect(state_2.less).not.toBeDefined();
    });
    it('should add 2 tokens (w/1st:abs. supply & 2nd:abs. supply)', () => {
        const state_0 = Empty<Tokens>();
        const state_1 = tokenReducer(state_0, addToken(t, {
            amount: 1n, supply: 10n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 1n, supply: 10n
        });
        const state_2 = tokenReducer(state_1, addToken(t, {
            amount: 2n, supply: 20n
        }));
        expect(state_2.items[t]).toEqual({
            amount: 3n, supply: 20n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).toEqual([t]);
        expect(state_2.less).not.toBeDefined();
    });
});
describe('Store w/tokenReducer (decrease)', () => {
    const t = Token.QRSH;
    it('should remove 1 token (w/rel. supply)', () => {
        const state_0 = Empty<Tokens>();
        const state_1 = tokenReducer(state_0, addToken(t, {
            amount: 1n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 1n, supply: 1n
        });
        const state_2 = tokenReducer(state_1, removeToken(t, {
            amount: 1n
        }));
        expect(state_2.items[t]).toEqual({
            amount: 0n, supply: 1n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).not.toBeDefined();
        expect(state_2.less).toEqual([t]);
    });
    it('should remove 1 token (w/abs. supply)', () => {
        const state_0 = Empty<Tokens>();
        const state_1 = tokenReducer(state_0, addToken(t, {
            amount: 1n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 1n, supply: 1n
        });
        const state_2 = tokenReducer(state_1, removeToken(t, {
            amount: 1n, supply: 10n
        }));
        expect(state_2.items[t]).toEqual({
            amount: 0n, supply: 10n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).not.toBeDefined();
        expect(state_2.less).toEqual([t]);
    });
    it('should *not* remove 1 token (w/abs. supply)', () => {
        const state_0 = Empty<Tokens>();
        const state_1 = tokenReducer(state_0, addToken(t, {
            amount: 5n
        }));
        let state_2;
        try {
            state_2 = tokenReducer(state_1, removeToken(t, {
                amount: 2n, supply: 1n
            }));
        } catch (ex: any) {
            expect(ex.message).toBe(`${t} supply=1 < amount=3`)
        }
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2).not.toBeDefined();
    });
    it('should remove 2 tokens (w/1st:rel. supply & 2nd:rel. supply)', () => {
        const state_0 = Empty<Tokens>();
        const state_1 = tokenReducer(state_0, addToken(t, {
            amount: 5n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 5n, supply: 5n
        });
        const state_2 = tokenReducer(state_1, removeToken(t, {
            amount: 2n
        }));
        expect(state_2.items[t]).toEqual({
            amount: 3n, supply: 5n
        });
        const state_3 = tokenReducer(state_2, removeToken(t, {
            amount: 1n
        }));
        expect(state_3.items[t]).toEqual({
            amount: 2n, supply: 5n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).not.toBeDefined();
        expect(state_2.less).toEqual([t]);
        expect(state_3.more).not.toBeDefined();
        expect(state_3.less).toEqual([t]);
    });
    it('should remove 2 tokens (w/1st:abs. supply & 2nd:rel. supply)', () => {
        const state_0 = Empty<Tokens>();
        const state_1 = tokenReducer(state_0, addToken(t, {
            amount: 5n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 5n, supply: 5n
        });
        const state_2 = tokenReducer(state_1, removeToken(t, {
            amount: 2n, supply: 4n
        }));
        expect(state_2.items[t]).toEqual({
            amount: 3n, supply: 4n
        });
        const state_3 = tokenReducer(state_2, removeToken(t, {
            amount: 1n
        }));
        expect(state_3.items[t]).toEqual({
            amount: 2n, supply: 4n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).not.toBeDefined();
        expect(state_2.less).toEqual([t]);
        expect(state_3.more).not.toBeDefined();
        expect(state_3.less).toEqual([t]);
    });
    it('should remove 2 tokens (w/1st:rel. supply & 2nd:abs. supply)', () => {
        const state_0 = Empty<Tokens>();
        const state_1 = tokenReducer(state_0, addToken(t, {
            amount: 5n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 5n, supply: 5n
        });
        const state_2 = tokenReducer(state_1, removeToken(t, {
            amount: 2n
        }));
        expect(state_2.items[t]).toEqual({
            amount: 3n, supply: 5n
        });
        const state_3 = tokenReducer(state_2, removeToken(t, {
            amount: 1n, supply: 4n
        }));
        expect(state_3.items[t]).toEqual({
            amount: 2n, supply: 4n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).not.toBeDefined();
        expect(state_2.less).toEqual([t]);
        expect(state_3.more).not.toBeDefined();
        expect(state_3.less).toEqual([t]);
    });
    it('should remove 2 tokens (w/1st:abs. supply & 2nd:abs. supply)', () => {
        const state_0 = Empty<Tokens>();
        const state_1 = tokenReducer(state_0, addToken(t, {
            amount: 5n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 5n, supply: 5n
        });
        const state_2 = tokenReducer(state_1, removeToken(t, {
            amount: 2n, supply: 4n
        }));
        expect(state_2.items[t]).toEqual({
            amount: 3n, supply: 4n
        });
        const state_3 = tokenReducer(state_2, removeToken(t, {
            amount: 1n, supply: 3n
        }));
        expect(state_3.items[t]).toEqual({
            amount: 2n, supply: 3n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).not.toBeDefined();
        expect(state_2.less).toEqual([t]);
        expect(state_3.more).not.toBeDefined();
        expect(state_3.less).toEqual([t]);
    });
});
