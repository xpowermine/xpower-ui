/* eslint @typescript-eslint/no-explicit-any: [off] */
/* eslint no-async-promise-executor: [off] */

import { App } from '../app';
import { Chain, ChainId } from './chain';
import { Address, Token, TokenInfo, Tokens } from '../redux/types';

import detectProvider from '@metamask/detect-provider';
import { EventEmitter } from 'events';

export type Connect = {
    address: Address, chainId: ChainId, token: Token
};
export class Blockchain extends EventEmitter {
    private static get me(): Blockchain {
        if (this._me === undefined) {
            this._me = new Blockchain();
        }
        return this._me;
    }
    private constructor() {
        super(); this.setMaxListeners(200);
    }
    public static get provider(): Promise<any> {
        return this.me.provider;
    }
    public get provider(): Promise<any> {
        if (!this._provider) {
            return detectProvider({
                timeout: 600
            }).then((p) => {
                return this._provider = p;
            });
        }
        return Promise.resolve(this._provider);
    }
    public static isInstalled(): Promise<boolean> {
        return this.me.isInstalled();
    }
    public isInstalled(): Promise<boolean> {
        return this.provider.then((p) => Boolean(p));
    }
    public static isConnected(): Promise<boolean> {
        return this.me.isConnected();
    }
    public isConnected(): Promise<boolean> {
        return this.provider.then((p) => Boolean(p?.isConnected()));
    }
    public static async connect(): Promise<Address> {
        return this.me.connect();
    }
    public async connect(): Promise<Address> {
        const accounts = await this.provider.then((p) => p?.request({
            method: 'eth_requestAccounts'
        }));
        if (!accounts?.length) {
            throw new Error('missing accounts');
        }
        const address = await this.selectedAddress;
        if (!address) {
            throw new Error('missing selected-address');
        }
        setTimeout(async () => this.emit('connect', {
            address, chainId: await this.chainId, token: App.token
        }));
        return address;
    }
    public static get selectedAddress(): Promise<Address | undefined> {
        return this.me.selectedAddress;
    }
    public get selectedAddress(): Promise<Address | undefined> {
        if (this.provider) {
            const req = this.provider.then((p) => p?.request({
                method: 'eth_accounts'
            }));
            return req.then((a: string[]) =>
                a?.length > 0 ? BigInt(a[0]) : undefined
            );
        }
        return Promise.resolve(undefined);
    }
    public static async isAvalanche(): Promise<boolean> {
        return this.me.isAvalanche();
    }
    public async isAvalanche(): Promise<boolean> {
        const id = await this.chainId;
        if (id === ChainId.AVALANCHE_MAINNET) {
            return true;
        }
        if (id === ChainId.AVALANCHE_FUJI) {
            return true;
        }
        if (id === ChainId.AVALANCHE_LOCAL) {
            return true;
        }
        return false;
    }
    public static async switchTo(id: ChainId) {
        await this.me.switchTo(id);
    }
    public async switchTo(id: ChainId) {
        const chain = new Chain(id);
        await this.provider.then((p) => p?.request({
            method: 'wallet_addEthereumChain',
            params: [{
                chainId: chain.id,
                chainName: chain.name,
                nativeCurrency: chain.currency,
                rpcUrls: chain.rpcUrls,
                blockExplorerUrls: chain.explorerUrls
            }]
        }));
    }
    public static async addToken(info: TokenInfo): Promise<boolean> {
        return this.me.addToken(info);
    }
    public async addToken(info: TokenInfo): Promise<boolean> {
        try {
            return await this.provider.then((p) => p?.request({
                method: 'wallet_watchAsset', params: {
                    type: 'ERC20', options: info
                }
            }));
        } catch (ex) {
            console.error(ex);
        }
        return Promise.resolve(false);
    }
    public static onConnect(
        listener: (options: Connect) => void
    ) {
        this.me.onConnect(listener);
        return this;
    }
    public onConnect(
        listener: (options: Connect) => void
    ) {
        return this.on('connect', listener);
    }
    public static onceConnect(
        listener: (options: Connect) => void, context?: {
            per: () => Token, tokens?: Set<Token>
        }
    ) {
        this.me.onceConnect(listener, context);
        return this;
    }
    public onceConnect(
        listener: (options: Connect) => void, context?: {
            per: () => Token, tokens?: Set<Token>
        }
    ) {
        if (context === undefined) {
            return this.once('connect', listener);
        }
        if (context.tokens === undefined) {
            context.tokens = new Set(Tokens());
        }
        for (const token of context.tokens) {
            const handler = (options: Connect) => {
                if (token === context.per()) {
                    this.off('connect', handler);
                    listener(options);
                }
            };
            this.on('connect', handler);
        }
        return this;
    }
    private get chainId() {
        return new Promise<string | undefined>(async (resolve) => {
            if (this.provider) try {
                const chain_id = await this.provider.then((p) => p?.request({
                    method: 'eth_chainId'
                }));
                if (chain_id && chain_id.length) {
                    resolve(`0x${Number(chain_id).toString(16)}`);
                } else {
                    resolve(undefined);
                }
            } catch (ex) {
                resolve(undefined);
            } else {
                resolve(undefined);
            }
        });
    }
    private _provider: any | null;
    private static _me: any;
}
export default Blockchain;
