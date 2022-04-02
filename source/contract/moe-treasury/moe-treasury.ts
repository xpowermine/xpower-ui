import { BigNumber, ContractInterface, Event } from 'ethers';
import { Base } from '../base';

import ABI from './moe-treasury.abi.json';

export type OnClaim = (
    from: string,
    nftId: BigNumber,
    amount: BigNumber,
    ev: Event
) => void;
export type OnClaimBatch = (
    from: string,
    nftIds: BigNumber[],
    amounts: BigNumber[],
    ev: Event
) => void;

export class MoeTreasury extends Base {
    public constructor(
        address: string, abi: ContractInterface = ABI
    ) {
        super(address, abi);
    }
}
export default MoeTreasury;
