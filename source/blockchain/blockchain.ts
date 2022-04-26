/* eslint @typescript-eslint/no-explicit-any: [off] */
/* eslint no-async-promise-executor: [off] */
import { Chain, ChainId } from './chain';

import detectProvider from '@metamask/detect-provider';
import { Address, TokenInfo } from '../redux/types';
import { EventEmitter } from 'events';

export type Connect = {
    chainId: ChainId, address: Address
};
export type Reconnect = {
    chainId: ChainId, address: Address
};
export class Blockchain extends EventEmitter {
    private static get me(): Blockchain {
        if (this._me === undefined) {
            this._me = new Blockchain();
        }
        return this._me;
    }
    private constructor() {
        super();
        if (this.provider) {
            this.provider.then((p) => p?.on('chainChanged', () => {
                window.location.reload();
            }));
            this.provider.then((p) => p?.on('accountsChanged', () => {
                window.location.reload();
            }));
        }
        this.setMaxListeners(20);
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
        if (this.connect_emitted === undefined) {
            this.connect_emitted = this.emit('connect', {
                chainId: await this.chainId, address
            } as Connect);
        } else {
            this.connect_emitted = this.emit('reconnect', {
                chainId: await this.chainId, address
            } as Reconnect);
        }
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
                a.length > 0 ? BigInt(a[0]) : undefined
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
    public static async switchTo(id: ChainId): Promise<void> {
        return this.me.switchTo(id);
    }
    public async switchTo(id: ChainId): Promise<void> {
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
        return false;
    }
    public static onConnect(
        listener: (options: Connect) => void
    ) {
        return this.me.on('connect', listener);
    }
    public static onceConnect(
        listener: (options: Connect) => void
    ) {
        return this.me.once('connect', listener);
    }
    public static onReconnect(
        listener: (options: Reconnect) => void
    ) {
        return this.me.on('reconnect', listener);
    }
    public static onceReconnect(
        listener: (options: Reconnect) => void
    ) {
        return this.me.once('reconnect', listener);
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
    private get connect_emitted(): boolean | undefined {
        return this._connect_emitted;
    }
    private set connect_emitted(value: boolean | undefined) {
        this._connect_emitted = value;
    }
    private _connect_emitted: boolean | undefined;
    private _provider: any | null;
    private static _me: any;
}
export default Blockchain;
