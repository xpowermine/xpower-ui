import { Empty, Token, Tokens } from '../types';
import { tokensBy } from './tokens-by';

describe('nfts-by', () => {
    it('should return empty tokens', () => {
        const tokens = Empty<Tokens>();
        const tokens_by = tokensBy(tokens);
        expect(tokens_by).toEqual(tokens);
    });
    it('should return full token set', () => {
        const tokens = {
            items: {
                [Token.THOR]: { amount: 0n, supply: 1n },
                [Token.LOKI]: { amount: 1n, supply: 2n },
                [Token.ODIN]: { amount: 2n, supply: 3n },
                [Token.HELA]: { amount: 3n, supply: 4n },
            }
        };
        const tokens_by = tokensBy(tokens);
        expect(tokens_by).toEqual(tokens);
    });
    it('should return THOR tokens only', () => {
        const tokens = {
            items: {
                [Token.THOR]: { amount: 0n, supply: 1n },
                [Token.LOKI]: { amount: 1n, supply: 2n },
                [Token.ODIN]: { amount: 2n, supply: 3n },
                [Token.HELA]: { amount: 3n, supply: 4n },
            }
        };
        const tokens_by = tokensBy(tokens, Token.THOR);
        expect(tokens_by).toEqual({
            items: {
                [Token.THOR]: { amount: 0n, supply: 1n },
            }
        });
    });
    it('should return LOKI tokens only', () => {
        const tokens = {
            items: {
                [Token.LOKI]: { amount: 1n, supply: 2n },
                [Token.ODIN]: { amount: 2n, supply: 3n },
                [Token.HELA]: { amount: 3n, supply: 4n },
            }
        };
        const tokens_by = tokensBy(tokens, Token.LOKI);
        expect(tokens_by).toEqual({
            items: {
                [Token.LOKI]: { amount: 1n, supply: 2n },
            }
        });
    });
    it('should return ODIN tokens only', () => {
        const tokens = {
            items: {
                [Token.ODIN]: { amount: 2n, supply: 3n },
                [Token.HELA]: { amount: 3n, supply: 4n },
            }
        };
        const tokens_by = tokensBy(tokens, Token.ODIN);
        expect(tokens_by).toEqual({
            items: {
                [Token.ODIN]: { amount: 2n, supply: 3n },
            }
        });
    });
    it('should return HELA tokens only', () => {
        const tokens = {
            items: {
                [Token.HELA]: { amount: 3n, supply: 4n },
            }
        };
        const tokens_by = tokensBy(tokens, Token.HELA);
        expect(tokens_by).toEqual({
            items: {
                [Token.HELA]: { amount: 3n, supply: 4n },
            }
        });
    });
});
