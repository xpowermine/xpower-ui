import { OnTransferSingle as on_transfer_single } from '../contract';
import { OnTransferBatch as on_transfer_batch } from '../contract';
import { OnApprovalForAll as on_approval_for_all } from '../contract';
import { BigNumber, Contract, Transaction, Event } from 'ethers';
import { Address, Amount, Balance, Supply } from '../redux/types';
import { Nft, NftCoreId, NftIssue, NftLevel } from '../redux/types';

import { x40 } from '../functions';
import { Meta} from '../contract';

export type OnTransferBatch = (
    operator: Address,
    from: Address,
    to: Address,
    ids: NftCoreId[],
    values: Amount[],
    ev: Event
) => void;
export type OnTransferSingle = (
    operator: Address,
    from: Address,
    to: Address,
    id: NftCoreId,
    value: Amount,
    ev: Event
) => void;
export type OnApprovalForAll = (
    account: Address,
    operator: Address,
    approved: boolean,
    ev: Event
) => void;

export abstract class ERC1155Wallet {
    constructor(
        address: Address | string
    ) {
        if (typeof address === 'bigint') {
            address = x40(address);
        }
        if (!address.match(/^0x/)) {
            throw new Error('address prefix is not 0x')
        }
        if (address.length !== 42) {
            throw new Error('address length is not 42')
        }
        this._address = address;
    }
    async balance(
        id: NftCoreId
    ): Promise<Balance> {
        const balance: BigNumber = await this.contract.balanceOf(
            this._address, id
        );
        return balance.toBigInt();
    }
    async balances({ issues, levels }: {
        issues: NftIssue[], levels: NftLevel[],
    }): Promise<Balance[]> {
        const ids = Nft.coreIds({ issues, levels });
        const addresses = ids.map(() => this._address);
        const balances: BigNumber[] = await this.contract.balanceOfBatch(
            addresses, ids
        );
        return balances.map((b) => b.toBigInt());
    }
    async isApprovedForAll(
        operator: Address | string
    ): Promise<boolean> {
        if (typeof operator === 'bigint') {
            operator = x40(operator);
        }
        return this.contract.isApprovedForAll(
            this._address, operator
        );
    }
    async setApprovalForAll(
        operator: Address | string, approved: boolean
    ): Promise<Transaction> {
        if (typeof operator === 'bigint') {
            operator = x40(operator);
        }
        return this.contract.setApprovalForAll(
            operator, approved
        );
    }
    onApprovalForAll(
        handler: OnApprovalForAll, { once } = { once: false }
    ) {
        const on_approval: on_approval_for_all = (
            account, op, flag, ev
        ) => {
            if (this._address.match(new RegExp(account, 'i'))) {
                handler(
                    BigInt(account), BigInt(op), flag, ev
                );
            }
        };
        if (once) {
            this.contract.once('ApprovalForAll', on_approval);
        } else {
            this.contract.on('ApprovalForAll', on_approval);
        }
    }
    safeTransfer(
        to: Address | string, id: NftCoreId, amount: Amount
    ): Promise<Transaction> {
        if (typeof to === 'bigint') {
            to = x40(to);
        }
        return this.contract.safeTransferFrom(
            this._address, to, id, amount, []
        );
    }
    onTransferSingle(
        handler: OnTransferSingle, { once } = { once: false }
    ) {
        const on_transfer: on_transfer_single = (
            op, from, to, id, value, ev
        ) => {
            if (this._address.match(new RegExp(from, 'i')) ||
                this._address.match(new RegExp(to, 'i'))
            ) {
                handler(
                    BigInt(op), BigInt(from), BigInt(to),
                    id.toString() as NftCoreId,
                    value.toBigInt(), ev
                );
            }
        };
        if (once) {
            this.contract.once('TransferSingle', on_transfer);
        } else {
            this.contract.on('TransferSingle', on_transfer);
        }
    }
    safeBatchTransfer(
        to: Address | string, ids: NftCoreId[], amounts: Amount[]
    ): Promise<Transaction> {
        if (typeof to === 'bigint') {
            to = x40(to);
        }
        return this.contract.safeBatchTransferFrom(
            this._address, to, ids, amounts, []
        );
    }
    onTransferBatch(
        handler: OnTransferBatch, { once } = { once: false }
    ) {
        const on_transfer: on_transfer_batch = (
            op, from, to, ids, values, ev
        ) => {
            if (this._address.match(new RegExp(from, 'i')) ||
                this._address.match(new RegExp(to, 'i'))
            ) {
                handler(
                    BigInt(op), BigInt(from), BigInt(to),
                    ids.map((id) => id.toString() as NftCoreId),
                    values.map((value) => value.toBigInt()), ev
                );
            }
        };
        if (once) {
            this.contract.once('TransferBatch', on_transfer);
        } else {
            this.contract.on('TransferBatch', on_transfer);
        }
    }
    async meta(
        id: NftCoreId
    ): Promise<Meta> {
        let meta = this._meta[id.toString()];
        if (typeof meta === 'undefined') {
            const nft_uri = await this.contract.uri(id);
            const uri = nft_uri.replace(/{id}/g, id);
            meta = await fetch(uri).then((res) => res.json());
            this._meta[id.toString()] = meta;
        }
        return meta;
    }
    async totalSupply(
        id: NftCoreId
    ): Promise<Supply> {
        const supply: BigNumber = await this.contract.totalSupply(id);
        return supply.toBigInt();
    }
    totalSupplies({ issues, levels }: {
        issues: NftIssue[],
        levels: NftLevel[]
    }): Promise<Supply>[] {
        return Array.from(totalSupplies(
            this.contract, { issues, levels }
        ));
    }
    get address(): Address {
        return BigInt(this._address);
    }
    abstract get contract(): Contract;
    protected readonly _address: string;
    protected _contract: Contract | undefined;
    protected _meta: Record<string, Meta> = {};
}
function* totalSupplies(
    nft: Contract, { issues, levels }: {
        issues: NftIssue[], levels: NftLevel[]
    }
): Generator<Promise<Supply>> {
    const ids = Nft.coreIds({ issues, levels });
    for (const id of ids) {
        const supply = nft.totalSupply(id).then(
            (s: BigNumber) => s.toBigInt()
        );
        yield supply as Promise<Supply>;
    }
}
export default ERC1155Wallet;
