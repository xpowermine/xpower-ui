import { Global } from '../types';
declare const global: Global;

import { Blockchain } from '../blockchain';
import { Contract, Wallet } from 'ethers';
import { NonceManager } from '@ethersproject/experimental';
import { Web3Provider } from '@ethersproject/providers';
import { randomBytes } from '@ethersproject/random';

export class OtfWallet {
    public static get enabled(): boolean {
        const item = localStorage.getItem('otf-wallet:flag');
        return JSON.parse(item ?? 'false');
    }
    public static set enabled(value: boolean) {
        const item = JSON.stringify(value);
        localStorage.setItem('otf-wallet:flag', item);
    }
    public static async init(
        key = 'otf-wallet'
    ): Promise<NonceManager> {
        if (this._wallet !== undefined) {
            return Promise.resolve(this._wallet);
        }
        let value = localStorage.getItem(key);
        if (value === null) {
            value = btoa(JSON.stringify(Object.values(randomBytes(32))));
            localStorage.setItem(key, value);
        }
        const provider = new Web3Provider(await Blockchain.provider);
        const wallet = new Wallet(JSON.parse(atob(value)), provider);
        return this._wallet = global.OTF_WALLET = new NonceManager(wallet);
    }
    public static async connect(
        fallback: Contract
    ): Promise<Contract> {
        if (OtfWallet.enabled) {
            const wallet = await OtfWallet.init();
            const balance = await wallet.getBalance();
            if (balance.gt(0)) {
                return fallback.connect(wallet);
            }
        }
        return fallback;
    }
    private static _wallet: NonceManager | undefined;
}
export default OtfWallet;
