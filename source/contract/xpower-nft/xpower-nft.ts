import { BigNumber, ContractInterface, Event } from 'ethers';
import { Base } from '../base';

import ABI from './xpower-nft.abi.json';

export type OnTransferSingle = (
    operator: string,
    from: string,
    to: string,
    id: BigNumber,
    value: BigNumber,
    ev: Event
) => void;
export type OnTransferBatch = (
    operator: string,
    from: string,
    to: string,
    ids: BigNumber[],
    values: BigNumber[],
    ev: Event
) => void;
export type OnApprovalForAll = (
    address: string,
    operator: string,
    approved: boolean,
    ev: Event
) => void;

export class XPowerNft extends Base {
    public constructor(
        address: string, abi: ContractInterface = ABI
    ) {
        super(address, abi);
    }
}
export type Meta = {
    name: string,
    description: string,
    image: string
};
export default XPowerNft;
