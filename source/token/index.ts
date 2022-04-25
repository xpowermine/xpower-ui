import { Amount, Token } from '../redux/types';

enum TokenSuffix {
    ODIN = 'odin',
    LOKI = 'loki',
    THOR = 'thor',
}
enum TokenSymbol {
    ODIN = 'ODIN',
    LOKI = 'LOKI',
    THOR = 'THOR',
}
enum TokenSymbolAlt {
    ODIN = 'ODIN',
    LOKI = 'LOKI',
    THOR = 'THOR',
}
export class Tokenizer {
    public static token(value: string | null): Token {
        if (typeof value === 'string') {
            const suffix = value.match(/^xpow[._]/i)
                ? value.replace('.', '_').split('_')[1] : value;
            switch (suffix.toLowerCase()) {
                case 'odin':
                    return Token.ODIN;
                case 'loki':
                    return Token.LOKI;
                case 'thor':
                    return Token.THOR;
                default:
                    return Token.THOR;
            }
        }
        return Token.THOR;
    }
    public static suffix(token: Token): TokenSuffix {
        switch (token) {
            case Token.ODIN:
                return TokenSuffix.ODIN;
            case Token.LOKI:
                return TokenSuffix.LOKI;
            case Token.THOR:
                return TokenSuffix.THOR;
        }
    }
    public static symbol(token: Token): TokenSymbol {
        switch (token) {
            case Token.ODIN:
                return TokenSymbol.ODIN;
            case Token.LOKI:
                return TokenSymbol.LOKI;
            case Token.THOR:
                return TokenSymbol.THOR;
        }
    }
    public static symbolAlt(token: Token): TokenSymbolAlt {
        switch (token) {
            case Token.ODIN:
                return TokenSymbolAlt.ODIN;
            case Token.LOKI:
                return TokenSymbolAlt.LOKI;
            case Token.THOR:
                return TokenSymbolAlt.THOR;
        }
    }
    public static amount(token: Token, zeros: number): Amount {
        switch (token) {
            case Token.ODIN:
                return 16n ** BigInt(zeros) - 1n;
            case Token.LOKI:
                return 2n ** BigInt(zeros) - 1n;
            case Token.THOR:
                return BigInt(zeros);
        }
    }
}
export default Tokenizer;
