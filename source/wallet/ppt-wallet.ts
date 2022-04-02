import { XPowerPptFactory, XPowerPptMockFactory } from '../contract';
import { BigNumber, Contract } from 'ethers';
import { Address, NftCoreId, NftLevel, Token, Year } from '../redux/types';

import { ERC1155Wallet } from './erc1155-wallet';

export class PptWallet extends ERC1155Wallet {
    constructor(
        address: Address | string, token?: Token
    ) {
        super(address);
        this._token = token;
    }
    async idBy(
        year: Year, level: NftLevel
    ): Promise<NftCoreId> {
        const id: BigNumber = await this.contract.idBy(year, level);
        return id.toString() as NftCoreId;
    }
    async year(
        delta_years: number
    ): Promise<Year> {
        const year: BigNumber = await this.contract.year();
        return year.sub(delta_years).toBigInt();
    }
    get contract(): Contract {
        if (this._contract === undefined) {
            this._contract = XPowerPptFactory({
                token: this._token
            });
        }
        return this._contract;
    }
    protected readonly _token?: Token;
}
export class PptWalletMock extends PptWallet {
    constructor(
        address: Address | string = 0n, token?: Token
    ) {
        super(address, token);
    }
    get contract(): Contract {
        if (this._contract === undefined) {
            this._contract = XPowerPptMockFactory({
                token: this._token
            });
        }
        return this._contract;
    }
}
export default PptWallet;
