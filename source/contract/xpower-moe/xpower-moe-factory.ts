import { Version } from '../../types';
import { Global } from '../../types';
declare const global: Global;

import { address } from '../address';
import { Contract } from 'ethers';
import { Token } from '../../redux/types';
import { XPowerMoe } from './xpower-moe';

export async function XPowerMoeFactory({
    token, version
}: {
    token: Token, version?: Version
}): Promise<Contract> {
    const contract = new XPowerMoe(address({
        infix: 'MOE', token, version
    }));
    return global.XPOWER_MOE = await contract.connect();
}
export default XPowerMoeFactory;
