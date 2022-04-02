import { Global } from '../../../source/types';
declare const global: Global;

import { App } from '../../app';
import { Contract } from 'ethers';
import { Token } from '../../redux/types';
import { PptTreasury } from './ppt-treasury';
import { address } from '../address';

export function PptTreasuryFactory({
    version, token
}: {
    version?: typeof App.version, token?: Token
} = {}): Contract {
    const contract = new PptTreasury(address({
        infix: 'PPT_TREASURY', version, token
    }));
    return global.PPT_TREASURY = contract.connect();
}
export default PptTreasuryFactory;
