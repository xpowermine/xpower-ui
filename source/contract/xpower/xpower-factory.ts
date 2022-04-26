import { Global } from '../../../source/types';
declare const global: Global;

import { App } from '../../app';
import { Contract } from 'ethers';
import { Token } from '../../redux/types';
import { XPower } from './xpower';
import { address } from '../address';

export async function XPowerFactory({
    version, token
}: {
    version?: typeof App.version, token?: Token
} = {}): Promise<Contract> {
    const contract = new XPower(address({
        infix: 'MOE', version, token
    }));
    return global.XPOWER = await contract.connect();
}
export default XPowerFactory;
