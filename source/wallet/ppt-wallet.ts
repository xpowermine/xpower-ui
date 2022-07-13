import { XPowerPptFactory, XPowerPptMockFactory } from '../contract';
import { BigNumber, Contract } from 'ethers';
import { Address, NftCoreId, NftLevel, Token, Year } from '../redux/types';

import { ERC1155Wallet } from './erc1155-wallet';

export class PptWallet extends ERC1155Wallet {
    constructor(
        address: Address | string, token: Token
    ) {
        super(address);
        this._token = token;
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
        return year.sub(delta_years).toNumber();
    }
    get contract(): Promise<Contract> {
        if (this._contract === undefined) {
            return XPowerPptFactory({
                token: this._token
            }).then((c) => {
                return this._contract = c;
            });
        }
        return Promise.resolve(this._contract);
    }
    protected readonly _token: Token;
}
export class PptWalletMock extends PptWallet {
    constructor(
        address: Address | string = 0n, token: Token
    ) {
        super(address, token);
    }
    get contract(): Promise<Contract> {
        if (this._contract === undefined) {
            return XPowerPptMockFactory({
                token: this._token
            }).then((c) => {
                return this._contract = c;
            });
        }
        return Promise.resolve(this._contract);
    }
}
export default PptWallet;
