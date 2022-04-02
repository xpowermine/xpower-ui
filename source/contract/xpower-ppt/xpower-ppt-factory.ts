/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Global } from '../../../source/types';
declare const global: Global;

import { App } from '../../app';
import { BigNumber, Contract } from 'ethers';
import { NftLevel, Token } from '../../redux/types';
import { MAX_YEAR } from '../../years';
import { Tokenizer } from '../../token';
import { XPowerPpt } from './xpower-ppt';
import { address } from '../address';

export function XPowerPptFactory({
    version, token
}: {
    version?: typeof App.version, token?: Token
} = {}): Contract {
    const contract = new XPowerPpt(address({
        infix: 'PPT', version, token
    }));
    return global.XPOWER_PPT = contract.connect();
}
export function XPowerPptMockFactory({ token }: {
    token?: Token
} = {}): Contract {
    const suffix = Tokenizer.suffix(token ?? App.token);
    const mock = {
        year: () => {
            return BigNumber.from(MAX_YEAR());
        },
        idBy: (year: BigNumber, level: NftLevel) => {
            if (!BigNumber.isBigNumber(year)) {
                year = BigNumber.from(year);
            }
            return year.mul(100).add(level);
        },
        uri: (id: BigNumber) => {
            if (!BigNumber.isBigNumber(id)) {
                id = BigNumber.from(id);
            }
            return `/nfts/${suffix}/${id.toNumber()}-ppt.json`;
        }

    };
    return mock as any;
}
export default XPowerPptFactory;
