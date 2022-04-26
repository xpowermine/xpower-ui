import { Contract, Transaction, Event } from 'ethers';
import { OnInit as on_init } from '../contract';
import { XPowerFactory } from '../contract';
import { x64 } from '../functions';
import { Address, BlockHash, Nonce } from '../redux/types';
import { Timestamp, Token } from '../redux/types';

import { ERC20Wallet } from './erc20-wallet';
import { OtfWallet } from './otf-wallet';

export type OnInit = (
    block_hash: BlockHash, timestamp: Timestamp, ev: Event
) => void;

export class MoeWallet extends ERC20Wallet {
    constructor(
        address: Address | string, token?: Token
    ) {
        super(address);
        this._token = token;
    }
    async init(): Promise<Transaction> {
        const contract = await OtfWallet.connect(
            await this.contract
        );
        return contract.init();
    }
    async mint(
        block_hash: BlockHash, nonce: Nonce
    ): Promise<Transaction> {
        const contract = await OtfWallet.connect(
            await this.contract
        );
        return contract.mint(
            this._address, x64(block_hash), x64(nonce)
        );
    }
    async onInit(
        handler: OnInit, { once } = { once: false }
    ) {
        const on_init: on_init = (
            block_hash, timestamp, ev
        ) => {
            handler(BigInt(block_hash), timestamp.toBigInt(), ev);
        };
        const contract = await OtfWallet.connect(
            await this.contract
        );
        if (once) {
            contract.once('Init', on_init);
        } else {
            contract.on('Init', on_init);
        }
    }
    offInit(handler: OnInit) {
        this.contract.then((c) => c?.off('Init', handler));
    }
    get contract(): Promise<Contract> {
        if (this._contract === undefined) {
            return XPowerFactory({
                token: this._token
            }).then((c) => {
                return this._contract = c;
            });
        }
        return Promise.resolve(this._contract);
    }
    protected readonly _token?: Token;
}
export default MoeWallet;
