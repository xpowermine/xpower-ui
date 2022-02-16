/* eslint @typescript-eslint/no-explicit-any: [off] */
import { App } from '../app';
import { BigNumber, Contract } from 'ethers';
import { Tokenizer } from '../token';
import { NftLevel, Token } from '../../source/redux/types';
import { MAX_YEAR } from '../../source/years';
import { XPowerNft } from '.';

export function XPowerNftFactory({ token, version }: {
    token?: Token, version?: 'v1' | 'v2'
} = {}): Contract {
    if (version === undefined) {
        version = App.params.get('nft') === 'v1' ? 'v1' : 'v2';
    }
    const symbol = Tokenizer.symbolAlt(token ?? App.token);
    const element_id = `#g-xpower-nft-address-${version}-${symbol}`;
    const address = $(element_id).data('value');
    if (!address) {
        throw new Error(`missing ${element_id}`);
    }
    const contract = new XPowerNft(address);
    return contract.connect(); // instance
}
export function XPowerNftMockFactory({ token }: {
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
            return `/nfts/${suffix}/${id.toNumber()}.json`;
        }

    };
    return mock as any;
}
export default XPowerNftFactory;