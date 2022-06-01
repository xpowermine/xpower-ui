/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Version } from '../../../source/types';
import { Global } from '../../../source/types';
declare const global: Global;

import { BigNumber, Contract } from 'ethers';
import { NftLevel, Token } from '../../redux/types';
import { MAX_YEAR } from '../../years';
import { Tokenizer } from '../../token';
import { XPowerPpt } from './xpower-ppt';
import { address } from '../address';

export async function XPowerPptFactory({
    token, version
}: {
    token: Token, version?: Version
}): Promise<Contract> {
    const contract = new XPowerPpt(address({
        infix: 'PPT', version, token
    }));
    return global.XPOWER_PPT = await contract.connect();
}
export async function XPowerPptMockFactory({
    token
}: {
    token: Token
}): Promise<Contract> {
    const token_lc = Tokenizer.lower(token);
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
            return `/ppts/${token_lc}/${id.toNumber()}.json`;
        }

    };
    return mock as any;
}
export default XPowerPptFactory;
