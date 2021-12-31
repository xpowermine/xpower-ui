export * from './base';
export * from './nfts';
export * from './nonces';
export * from './refresh';
export * from './tokens';

import { Nfts } from './nfts';
import { Nonces } from './nonces';
import { Refresh } from './refresh';
import { Tokens } from './tokens';

export type State = {
    nfts: Nfts,
    nonces: Nonces,
    refresh: Refresh,
    tokens: Tokens
};
export function Empty<T extends {
    items: Record<string | number | symbol, unknown>
}>() {
    return { items: {} } as T;
}
