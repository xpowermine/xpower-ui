import { Amount, Level, Token } from '../redux/types';

enum TokenLower {
    THOR = 'thor',
    LOKI = 'loki',
    ODIN = 'odin',
    HELA = 'hela',
}
export class Tokenizer {
    public static token(value: string | null): Token {
        if (typeof value === 'string') {
            const suffix = value.match(/^xpow[._]/i)
                ? value.replace('.', '_').split('_')[1] : value;
            switch (suffix.toLowerCase()) {
                case 'thor':
                    return Token.THOR;
                case 'loki':
                    return Token.LOKI;
                case 'odin':
                    return Token.ODIN;
                case 'hela':
                    return Token.HELA;
            }
        }
        return Token.THOR;
    }
    public static lower(token: Token): TokenLower {
        switch (token) {
            case Token.THOR:
                return TokenLower.THOR;
            case Token.LOKI:
                return TokenLower.LOKI;
            case Token.ODIN:
                return TokenLower.ODIN;
            case Token.HELA:
                return TokenLower.HELA;
        }
    }
    public static amount(token: Token, level: Level): Amount {
        switch (token) {
            case Token.THOR:
                return BigInt(level);
            case Token.LOKI:
                return 2n ** BigInt(level) - 1n;
            case Token.ODIN:
                return 16n ** BigInt(level) - 1n;
            case Token.HELA:
                throw new Error('not applicable');
        }
    }
    public static level(token: Token, amount: Amount): Level {
        switch (token) {
            case Token.THOR:
                return Number(amount);
            case Token.LOKI:
                return (amount + 1n).toString(2).length - 1;
            case Token.ODIN:
                return (amount + 1n).toString(16).length - 1;
            case Token.HELA:
                throw new Error('not applicable');
        }
    }
}
export default Tokenizer;
