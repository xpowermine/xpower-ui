import { Global } from '../../../source/types';
declare const global: Global;

import { App } from '../../app';
import { Contract } from 'ethers';
import { Token } from '../../redux/types';
import { MoeTreasury } from './moe-treasury';
import { address } from '../address';

export function MoeTreasuryFactory({
    version, token
}: {
    version?: typeof App.version, token?: Token
} = {}): Contract {
    const contract = new MoeTreasury(address({
        infix: 'MOE_TREASURY', version, token
    }));
    return global.MOE_TREASURY = contract.connect();
}
export default MoeTreasuryFactory;
