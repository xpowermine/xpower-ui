import { combineReducers, Unsubscribe } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { Store } from 'redux';

import { NftFullId, NftIssue, NftLevel, NftToken, Pages } from '../redux/types';
import { Address, Amount, Nonce, Supply, Token } from '../redux/types';
import { BlockHash, Page, State } from '../redux/types';

import { middleware } from '../redux/middleware';
import { Action } from '../redux/actions'

import { onPageSwitch, OnPageSwitch } from '../redux/observers';
import { onTokenSwitch, OnTokenSwitch } from '../redux/observers';
import { onNftAdded, OnNftAdded } from '../redux/observers';
import { onPptAdded, OnPptAdded } from '../redux/observers';
import { onNftRemoved, OnNftRemoved } from '../redux/observers';
import { onPptRemoved, OnPptRemoved } from '../redux/observers';
import { onNonceAdded, OnNonceAdded } from '../redux/observers';
import { onNonceRemoved, OnNonceRemoved } from '../redux/observers';
import { onTokenAdded, OnTokenAdded } from '../redux/observers';
import { onTokenRemoved, OnTokenRemoved } from '../redux/observers';

import { switchPage } from '../redux/actions';
import { pageReducer } from '../redux/reducers';
import { switchToken } from '../redux/actions';
import { tokenReducer } from '../redux/reducers';

import { addNonce } from '../redux/actions';
import { removeNonce } from '../redux/actions';
import { removeNonces } from '../redux/actions';
import { removeNonceByAmount } from '../redux/actions';
import { noncesReducer } from '../redux/reducers';
import { noncesBy } from '../redux/selectors';
import { nonceBy } from '../redux/selectors';

import { setNft, setPpt } from '../redux/actions';
import { addNft, addPpt } from '../redux/actions';
import { removeNft, removePpt } from '../redux/actions';
import { nftsReducer, pptsReducer } from '../redux/reducers';
import { nftTotalBy, pptTotalBy } from '../redux/selectors';
import { nftsBy, pptsBy } from '../redux/selectors';

import { setToken } from '../redux/actions';
import { addToken } from '../redux/actions';
import { removeToken } from '../redux/actions';
import { tokensReducer } from '../redux/reducers';
import { tokensBy } from '../redux/selectors';

import { refresh } from '../redux/actions';
import { refreshed } from '../redux/selectors';
import { refreshReducer } from '../redux/reducers';

import { StateDb } from '../state-db';
import { Tokenizer } from '../token';
import { Parser } from '../parser';

import { Version } from '../types';
import { Global } from '../types';
import { delayed } from '../functions';
declare const global: Global;

export class App {
    private static get me(): App {
        if (global.APP === undefined) {
            global.APP = new App();
        }
        return global.APP;
    }
    private constructor() {
        const reducer = combineReducers({
            nfts: nftsReducer,
            nonces: noncesReducer,
            page: pageReducer,
            ppts: pptsReducer,
            refresh: refreshReducer,
            token: tokenReducer,
            tokens: tokensReducer,
        });
        if (App.clear) {
            this.db.clear(App.persist);
        }
        if (App.clearAll) {
            this.db.clear();
        }
        this._store = configureStore({
            reducer, middleware: (m) => m({
                /**
                 * @todo: fix bigint check & re-enable!
                 */
                serializableCheck: false
            }),
            enhancers: middleware<typeof reducer, State>({
                logger: App.logger
            }),
            preloadedState: this.db.load(App.persist),
        });
        if (App.persist > 0) this._store.subscribe(() => {
            const state = this._store.getState();
            if (!refreshed(state.refresh)) {
                this.db.save(App.persist, state);
            }
        });
    }
    public static switchPage(page: Page) {
        this.me.store.dispatch(switchPage(page));
    }
    public static onPageSwitch(
        callback: OnPageSwitch
    ) {
        return onPageSwitch(this.me.store, callback);
    }
    public static onPageSwitched(
        callback: OnPageSwitch, ms = 600
    ) {
        return onPageSwitch(this.me.store, delayed(callback, ms));
    }
    public static switchToken(token: Token) {
        this.me.store.dispatch(switchToken(token));
    }
    public static onTokenSwitch(
        callback: OnTokenSwitch
    ) {
        return onTokenSwitch(this.me.store, callback);
    }
    public static onTokenSwitched(
        callback: OnTokenSwitch, ms = 600
    ) {
        return onTokenSwitch(this.me.store, delayed(callback, ms));
    }
    public static addNonce(
        nonce: Nonce, item: {
            address: Address,
            amount: Amount,
            block_hash: BlockHash,
            token: Token,
            worker: number,
        }
    ) {
        this.me.store.dispatch(addNonce(nonce, item));
    }
    public static removeNonce(
        nonce: Nonce, item: {
            address: Address,
            block_hash: BlockHash,
            token: Token
        }
    ) {
        this.me.store.dispatch(removeNonce(nonce, item));
    }
    public static removeNonceByAmount(
        item: {
            address: Address,
            amount: Amount,
            block_hash: BlockHash,
            token: Token
        }
    ) {
        this.me.store.dispatch(removeNonceByAmount(item));
    }
    public static removeNonces() {
        this.me.store.dispatch(removeNonces({
            address: null, token: null
        }));
    }
    public static onNonceAdded(
        address: Address, callback: OnNonceAdded
    ) {
        return onNonceAdded(this.me.store, (
            (nonce, item, total_by, total) => {
                if (item.address === address) {
                    callback(nonce, item, total_by, total);
                }
            }
        ));
    }
    public static onNonceRemoved(
        address: Address, callback: OnNonceRemoved
    ) {
        return onNonceRemoved(this.me.store, (
            (nonce, item, total_by, total) => {
                if (item.address === address) {
                    callback(nonce, item, total_by, total);
                }
            }
        ));
    }
    public static onNonceChanged(
        address: Address, callback: OnNonceAdded | OnNonceRemoved
    ): Unsubscribe {
        const un_add = this.onNonceAdded(address, callback);
        const un_rem = this.onNonceRemoved(address, callback);
        return () => { un_add(); un_rem(); };
    }
    public static getNonceBy(query?: {
        address?: Address,
        amount?: Amount,
        block_hash?: BlockHash,
        token?: Token
    }, index = 0): Nonce | undefined {
        const { nonces } = this.me.store.getState();
        return nonceBy(nonces, query, index);
    }
    public static getNoncesBy(query?: {
        address?: Address,
        amount?: Amount,
        block_hash?: BlockHash,
        token?: Token
    }): Nonce[] {
        const { nonces } = this.me.store.getState();
        return noncesBy(nonces, query);
    }
    public static setNft(
        nft: NftFullId | {
            token: NftToken,
            issue: NftIssue,
            level: NftLevel,
        },
        item: {
            amount: Amount,
            supply: Supply
        }
    ) {
        this.me.store.dispatch(setNft(nft, item));
    }
    public static setPpt(
        ppt: NftFullId | {
            token: NftToken,
            issue: NftIssue,
            level: NftLevel,
        },
        item: {
            amount: Amount,
            supply: Supply
        }
    ) {
        this.me.store.dispatch(setPpt(ppt, item));
    }
    public static addNft(
        nft: NftFullId | {
            token: NftToken,
            issue: NftIssue,
            level: NftLevel,
        },
        item?: {
            amount: Amount,
            supply?: Supply
        }
    ) {
        this.me.store.dispatch(addNft(nft, item));
    }
    public static addPpt(
        ppt: NftFullId | {
            token: NftToken,
            issue: NftIssue,
            level: NftLevel,
        },
        item?: {
            amount: Amount,
            supply?: Supply
        }
    ) {
        this.me.store.dispatch(addPpt(ppt, item));
    }
    public static removeNft(
        nft: NftFullId | {
            token: NftToken,
            issue: NftIssue,
            level: NftLevel,
        },
        item?: {
            amount: Amount,
            supply?: Supply
        }
    ) {
        this.me.store.dispatch(removeNft(nft, item));
    }
    public static removePpt(
        ppt: NftFullId | {
            token: NftToken,
            issue: NftIssue,
            level: NftLevel,
        },
        item?: {
            amount: Amount,
            supply?: Supply
        }
    ) {
        this.me.store.dispatch(removePpt(ppt, item));
    }
    public static onNftAdded(
        callback: OnNftAdded
    ) {
        return onNftAdded(this.me.store, callback);
    }
    public static onPptAdded(
        callback: OnPptAdded
    ) {
        return onPptAdded(this.me.store, callback);
    }
    public static onNftRemoved(
        callback: OnNftRemoved
    ) {
        return onNftRemoved(this.me.store, callback);
    }
    public static onPptRemoved(
        callback: OnPptRemoved
    ) {
        return onPptRemoved(this.me.store, callback);
    }
    public static onNftChanged(
        callback: OnNftAdded | OnNftRemoved
    ): Unsubscribe {
        const un_add = this.onNftAdded(callback);
        const un_rem = this.onNftRemoved(callback);
        return () => { un_add(); un_rem(); };
    }
    public static onPptChanged(
        callback: OnNftAdded | OnNftRemoved
    ): Unsubscribe {
        const un_add = this.onPptAdded(callback);
        const un_rem = this.onPptRemoved(callback);
        return () => { un_add(); un_rem(); };
    }
    public static getNfts(nft: NftFullId | {
        issue?: NftIssue,
        level?: NftLevel,
        token?: NftToken,
    }) {
        const { nfts } = this.me.store.getState();
        return nftsBy(nfts, nft)
    }
    public static getNftTotalBy(nft: NftFullId | {
        issue?: NftIssue,
        level?: NftLevel,
        token?: NftToken,
    }): {
        amount: Amount, supply: Supply
    } {
        const { nfts } = this.me.store.getState();
        return nftTotalBy(nfts, nft);
    }
    public static getPpts(ppt: NftFullId | {
        issue?: NftIssue,
        level?: NftLevel,
        token?: NftToken,
    }) {
        const { ppts } = this.me.store.getState();
        return pptsBy(ppts, ppt)
    }
    public static getPptTotalBy(ppt: NftFullId | {
        issue?: NftIssue,
        level?: NftLevel,
        token?: NftToken,
    }): {
        amount: Amount, supply: Supply
    } {
        const { ppts } = this.me.store.getState();
        return pptTotalBy(ppts, ppt);
    }
    public static setToken(
        token: Token, item: {
            amount: Amount,
            supply: Supply
        }
    ) {
        this.me.store.dispatch(setToken(token, item));
    }
    public static addToken(
        token: Token, item: {
            amount: Amount,
            supply?: Supply
        }
    ) {
        this.me.store.dispatch(addToken(token, item));
    }
    public static removeToken(
        token: Token, item: {
            amount: Amount,
            supply?: Supply
        }
    ) {
        this.me.store.dispatch(removeToken(token, item));
    }
    public static onTokenAdded(
        callback: OnTokenAdded
    ) {
        return onTokenAdded(this.me.store, callback);
    }
    public static onTokenRemoved(
        callback: OnTokenRemoved
    ) {
        return onTokenRemoved(this.me.store, callback);
    }
    public static onTokenChanged(
        callback: OnTokenAdded | OnTokenRemoved
    ): Unsubscribe {
        const un_add = this.onTokenAdded(callback);
        const un_rem = this.onTokenRemoved(callback);
        return () => { un_add(); un_rem(); };
    }
    public static getTokens(token?: Token) {
        const { tokens } = this.me.store.getState();
        return tokensBy(tokens, token)
    }
    public static refresh() {
        this.me.store.dispatch(refresh());
    }
    private get db(): StateDb {
        if (this._db === undefined) {
            this._db = new StateDb(localStorage);
        }
        return this._db;
    }
    public static get clear(): boolean {
        return Parser.boolean(this.params.get('clear'), false);
    }
    public static get clearAll(): boolean {
        return Parser.boolean(this.params.get('clear-all'), false);
    }
    public static get level(): { min: number, max: number } {
        const min = Parser.number(this.params.get('min-level'), 5);
        const max = Parser.number(this.params.get('max-level'), 64);
        return { min, max };
    }
    public static get logger(): boolean {
        return Parser.boolean(this.params.get('logger'), false);
    }
    public static get auto_mint(): number {
        return Parser.number(this.params.get('auto-mint'), 3000);
    }
    public static get persist(): number {
        const element = document.getElementById('g-persistence');
        const fallback = Parser.number(element?.dataset.value, 0);
        return Parser.number(this.params.get('persist'), fallback);
    }
    public static get speed(): number {
        const element = document.getElementById('g-mining-speed');
        const fallback = Parser.number(element?.dataset.value, 50);
        const value = Parser.number(this.params.get('speed'), fallback);
        return Math.min(100, Math.max(0, value)) / 100;
    }
    public static get token(): Token {
        return Tokenizer.token(this.params.get('token'));
    }
    public static get page(): Page {
        if (typeof location !== 'undefined') {
            const path = location.pathname.slice(1) as Page;
            return Pages().has(path) ? path : Page.None;
        }
        return Page.None;
    }
    public static get version(): Version {
        switch (this.params.get('version')) {
            case 'v2a':
                return 'v2a';
            case 'v3a':
                return 'v3a';
            case 'v3b':
                return 'v3b';
            case 'v4a':
                return 'v4a';
            default:
                return 'v4a';
        }
    }
    public static get params(): URLSearchParams {
        if (typeof location !== 'undefined') {
            return new URLSearchParams(location.search.substring(1));
        }
        return new URLSearchParams();
    }
    private get store(): Store<State, Action> {
        return this._store;
    }
    private _db: StateDb | undefined;
    private _store: Store<State, Action>;
}
export default App;
