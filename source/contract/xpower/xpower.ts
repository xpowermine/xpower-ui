import { BigNumber, ContractInterface, Event } from 'ethers';
import { Base } from '../base';

import ABI from './xpower.abi.json';

export type OnInit = (
    block_hash: string, timestamp: BigNumber, ev: Event
) => void;
export type OnTransfer = (
    from: string, to: string, amount: BigNumber, ev: Event
) => void;
export type OnApproval = (
    owner: string, spender: string, value: BigNumber, ev: Event
) => void;

export class XPower extends Base {
    public constructor(
        address: string, abi: ContractInterface = ABI
    ) {
        super(address, abi);
    }
}
export default XPower;
