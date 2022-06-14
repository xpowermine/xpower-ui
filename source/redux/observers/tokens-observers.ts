/* eslint @typescript-eslint/no-unused-vars: [off] */
import { Store, Unsubscribe } from 'redux';
import { observe } from './observe';

import { Amount, Supply, State } from '../types';
import { Token, Tokens, Empty } from '../types';
import { Action } from '../actions';

export type OnTokenAdded = (
    token: Token, item: { amount: Amount, supply: Supply }
) => void;
export type OnTokenRemoved = (
    token: Token, item: { amount: Amount, supply: Supply }
) => void;

export function onTokenAdded(
    store: Store<State, Action>, handler: OnTokenAdded
): Unsubscribe {
    const selector = (state: State) => state.tokens;
    const observer = observe<Tokens>(store)(
        selector, Empty<Tokens>()
    );
    return observer((next) => {
        const added = (token: Token) => {
            const item = next.items[token];
            if (item) handler(token, item);
        };
        if (next.more) {
            next.more.forEach(added);
        }
    });
}
export function onTokenRemoved(
    store: Store<State, Action>, handler: OnTokenRemoved
): Unsubscribe {
    const selector = (state: State) => state.tokens;
    const observer = observe<Tokens>(store)(
        selector, Empty<Tokens>()
    );
    return observer((next) => {
        const removed = (token: Token) => {
            const item = next.items[token];
            if (item) handler(token, item);
        };
        if (next.less) {
            next.less.forEach(removed);
        }
    });
}
