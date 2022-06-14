export * from './page-actions';
export * from './nonces-actions';
export * from './nfts-actions';
export * from './ppts-actions';
export * from './token-actions';
export * from './tokens-actions';
export * from './refresh-actions';

import { Action as PageAction } from './page-actions';
import { Action as NoncesAction } from './nonces-actions';
import { Action as NftsAction } from './nfts-actions';
import { Action as PptsAction } from './ppts-actions';
import { Action as TokenAction } from './token-actions';
import { Action as TokensAction } from './tokens-actions';
import { Action as RefreshAction } from './refresh-actions';

export type Action =
    PageAction |
    NoncesAction |
    NftsAction |
    PptsAction |
    TokenAction |
    TokensAction |
    RefreshAction ;
