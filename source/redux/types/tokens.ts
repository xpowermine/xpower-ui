import { Address, Amount, Supply } from './base';

export enum Token {
    THOR = 'THOR',
    LOKI = 'LOKI',
    ODIN = 'ODIN',
    HELA = 'HELA',
}
export function* Tokens() {
    for (const t in Token) {
        yield t as Token;
    }
}
export type Tokens = {
    /** token => { amount, supply } */
    items: {
        [token in Token]?: {
            amount: Amount;
            supply: Supply;
        }
    },
    /** set for added token(s) */
    more?: Token[],
    /** set for removed token(s) */
    less?: Token[]
}
export type TokenInfo = {
    /** address the token is at */
    address: Address,
    /** ticker symbol or shorthand */
    symbol: string,
    /** number of decimals of the token */
    decimals: number,
    /** string url of the token logo */
    image?: string
};
