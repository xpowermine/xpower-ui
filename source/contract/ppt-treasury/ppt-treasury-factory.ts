import { Version } from '../../../source/types';
import { Global } from '../../../source/types';
declare const global: Global;

import { Contract } from 'ethers';
import { Token } from '../../redux/types';
import { PptTreasury } from './ppt-treasury';
import { address } from '../address';

export async function PptTreasuryFactory({
    token, version
}: {
    token: Token, version?: Version
}): Promise<Contract> {
    const contract = new PptTreasury(address({
        infix: 'PPT_TREASURY', version, token
    }));
    return global.PPT_TREASURY = await contract.connect();
}
export default PptTreasuryFactory;
