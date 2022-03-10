import { Amount, Token } from '../redux/types';

enum TokenSuffix {
    QRSH = 'qrsh',
    AQCH = 'aqch',
    PARA = 'para',
}
enum TokenSymbol {
    QRSH = 'QRSH',
    AQCH = 'AQCH',
    PARA = 'PARA',
}
enum TokenSymbolAlt {
    QRSH = 'QRSH',
    AQCH = 'AQCH',
    PARA = 'PARA',
}
export class Tokenizer {
    public static token(value: string | null): Token {
        if (typeof value === 'string') {
            const suffix = value.match(/^xpow[._]/i)
                ? value.replace('.', '_').split('_')[1] : value;
            switch (suffix.toLowerCase()) {
                case 'qrsh':
                    return Token.QRSH;
                case 'aqch':
                    return Token.AQCH;
                case 'para':
                    return Token.PARA;
                default:
                    return Token.PARA;
            }
        }
        return Token.PARA;
    }
    public static suffix(token: Token): TokenSuffix {
        switch (token) {
            case Token.QRSH:
                return TokenSuffix.QRSH;
            case Token.AQCH:
                return TokenSuffix.AQCH;
            case Token.PARA:
                return TokenSuffix.PARA;
        }
    }
    public static symbol(token: Token): TokenSymbol {
        switch (token) {
            case Token.QRSH:
                return TokenSymbol.QRSH;
            case Token.AQCH:
                return TokenSymbol.AQCH;
            case Token.PARA:
                return TokenSymbol.PARA;
        }
    }
    public static symbolAlt(token: Token): TokenSymbolAlt {
        switch (token) {
            case Token.QRSH:
                return TokenSymbolAlt.QRSH;
            case Token.AQCH:
                return TokenSymbolAlt.AQCH;
            case Token.PARA:
                return TokenSymbolAlt.PARA;
        }
    }
    public static amount(token: Token, zeros: number): Amount {
        switch (token) {
            case Token.QRSH:
                return 16n ** BigInt(zeros) - 1n;
            case Token.AQCH:
                return 2n ** BigInt(zeros) - 1n;
            case Token.PARA:
                return BigInt(zeros);
        }
    }
}
export default Tokenizer;
