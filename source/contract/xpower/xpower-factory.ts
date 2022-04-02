import { Global } from '../../../source/types';
declare const global: Global;

import { App } from '../../app';
import { Contract } from 'ethers';
import { Token } from '../../redux/types';
import { XPower } from './xpower';
import { address } from '../address';

export function XPowerFactory({
    version, token
}: {
    version?: typeof App.version, token?: Token
} = {}): Contract {
    const contract = new XPower(address({
        infix: 'MOE', version, token
    }));
    return global.XPOWER = contract.connect();
}
export default XPowerFactory;
