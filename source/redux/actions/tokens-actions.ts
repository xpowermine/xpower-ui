import { Amount, Supply, Token } from '../types';

export type SetToken = {
    type: 'tokens/set', payload: {
        token: Token, item: {
            amount: Amount,
            supply: Supply
        }
    }
};
export const setToken = (
    token: Token, item: {
        amount: Amount,
        supply: Supply
    }
): SetToken => ({
    type: 'tokens/set', payload: {
        token, item
    }
});
export type AddToken = {
    type: 'tokens/add', payload: {
        token: Token, item?: {
            amount: Amount,
            supply?: Supply
        }
    }
};
export const addToken = (
    token: Token, item?: {
        amount: Amount, // new-amount = old-amount + amount
        supply?: Supply // new-supply = supply ?? old-supply + amount
    }
): AddToken => ({
    type: 'tokens/add', payload: {
        token, item
    }
});
export type RemoveToken = {
    type: 'tokens/remove', payload: {
        token: Token, item?: {
            amount: Amount,
            supply?: Supply
        }
    }
};
export const removeToken = (
    token: Token, item?: {
        amount: Amount, // new-amount = old-amount - amount
        supply?: Supply // new-supply = supply ?? old-supply (*no* decrease!)
    }
): RemoveToken => ({
    type: 'tokens/remove', payload: {
        token, item
    }
});
export type Action = SetToken | AddToken | RemoveToken;
