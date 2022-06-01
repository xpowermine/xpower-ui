import { Version } from '../../../source/types';
import { Global } from '../../../source/types';
declare const global: Global;

import { Contract } from 'ethers';
import { Token } from '../../redux/types';
import { MoeTreasury } from './moe-treasury';
import { address } from '../address';

export async function MoeTreasuryFactory({
    token, version
}: {
    token: Token, version?: Version
}): Promise<Contract> {
    const contract = new MoeTreasury(address({
        infix: 'MOE_TREASURY', token, version
    }));
    return global.MOE_TREASURY = await contract.connect();
}
export default MoeTreasuryFactory;
