import { BigNumber, ContractInterface, Event } from 'ethers';
import { Base } from '../base';

import ABI from './nft-treasury.abi.json';

export type OnStake = (
    from: string,
    nftId: BigNumber,
    amount: BigNumber,
    ev: Event
) => void;
export type OnUnstake = (
    from: string,
    nftId: BigNumber,
    amount: BigNumber,
    ev: Event
) => void;
export type OnStakeBatch = (
    from: string,
    nftIds: BigNumber[],
    amounts: BigNumber[],
    ev: Event
) => void;
export type OnUnstakeBatch = (
    from: string,
    nftIds: BigNumber[],
    amounts: BigNumber[],
    ev: Event
) => void;

export class PptTreasury extends Base {
    public constructor(
        address: string, abi: ContractInterface = ABI
    ) {
        super(address, abi);
    }
}
export default PptTreasury;
