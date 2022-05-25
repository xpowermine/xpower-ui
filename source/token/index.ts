import { Amount, Token } from '../redux/types';

enum TokenSuffix {
    THOR = 'thor',
    LOKI = 'loki',
    ODIN = 'odin',
    HELA = 'hela',
}
enum TokenSymbol {
    THOR = 'THOR',
    LOKI = 'LOKI',
    ODIN = 'ODIN',
    HELA = 'HELA',
}
enum TokenSymbolAlt {
    THOR = 'THOR',
    LOKI = 'LOKI',
    ODIN = 'ODIN',
    HELA = 'HELA',
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
    public static suffix(token: Token): TokenSuffix {
        switch (token) {
            case Token.THOR:
                return TokenSuffix.THOR;
            case Token.LOKI:
                return TokenSuffix.LOKI;
            case Token.ODIN:
                return TokenSuffix.ODIN;
            case Token.HELA:
                return TokenSuffix.HELA;
        }
    }
    public static symbol(token: Token): TokenSymbol {
        switch (token) {
            case Token.THOR:
                return TokenSymbol.THOR;
            case Token.LOKI:
                return TokenSymbol.LOKI;
            case Token.ODIN:
                return TokenSymbol.ODIN;
            case Token.HELA:
                return TokenSymbol.HELA;
        }
    }
    public static symbolAlt(token: Token): TokenSymbolAlt {
        switch (token) {
            case Token.THOR:
                return TokenSymbolAlt.THOR;
            case Token.LOKI:
                return TokenSymbolAlt.LOKI;
            case Token.ODIN:
                return TokenSymbolAlt.ODIN;
            case Token.HELA:
                return TokenSymbolAlt.HELA;
        }
    }
    public static amount(token: Token, zeros: number): Amount {
        switch (token) {
            case Token.THOR:
                return BigInt(zeros);
            case Token.LOKI:
                return 2n ** BigInt(zeros) - 1n;
            case Token.ODIN:
                return 16n ** BigInt(zeros) - 1n;
            case Token.HELA:
                throw new Error('not applicable');
        }
    }
}
export default Tokenizer;
