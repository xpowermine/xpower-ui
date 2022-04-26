import { XPowerNftFactory } from '../contract';
import { XPowerNftMockFactory } from '../contract';
import { BigNumber, Contract, Transaction } from 'ethers';
import { Address, Amount, NftCoreId, NftLevel, Token, Year } from '../redux/types';

import { ERC1155Wallet } from './erc1155-wallet';
import { OtfWallet } from './otf-wallet';

export class NftWallet extends ERC1155Wallet {
    constructor(
        address: Address | string, token?: Token
    ) {
        super(address);
        this._token = token;
    }
    async mint(
        level: NftLevel, amount: Amount
    ): Promise<Transaction> {
        const contract = await OtfWallet.connect(
            await this.contract
        );
        return contract.mint(
            this._address, level, amount
        );
    }
    async mintBatch(
        levels: NftLevel[], amounts: Amount[]
    ): Promise<Transaction> {
        const contract = await OtfWallet.connect(
            await this.contract
        );
        return contract.mintBatch(
            this._address, levels, amounts
        );
    }
    async idBy(
        year: Year, level: NftLevel
    ): Promise<NftCoreId> {
        const id: BigNumber = await this.contract.then((c) => {
            return c?.idBy(year, level);
        });
        return id.toString() as NftCoreId;
    }
    async year(
        delta_years: number
    ): Promise<Year> {
        const year: BigNumber = await this.contract.then((c) => {
            return c?.year();
        });
        return year.sub(delta_years).toBigInt();
    }
    get contract(): Promise<Contract> {
        if (this._contract === undefined) {
            return XPowerNftFactory({
                token: this._token
            }).then((c) => {
                return this._contract = c;
            });
        }
        return Promise.resolve(this._contract);
    }
    protected readonly _token?: Token;
}
export class NftWalletMock extends NftWallet {
    constructor(
        address: Address | string = 0n, token?: Token
    ) {
        super(address, token);
    }
    get contract(): Promise<Contract> {
        if (this._contract === undefined) {
            return XPowerNftMockFactory({
                token: this._token
            }).then((c) => {
                return this._contract = c;
            });
        }
        return Promise.resolve(this._contract);
    }
}
export default NftWallet;
