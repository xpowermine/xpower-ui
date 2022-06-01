import { Token, Tokens } from '../types';

export function tokensBy(
    tokens: Tokens, token?: Token
): Tokens {
    const items = Object.fromEntries(
        Object.entries(tokens.items).filter(([t]) => {
            if (token !== undefined && token !== t) {
                return false;
            }
            return true;
        })
    );
    return { items };
}
