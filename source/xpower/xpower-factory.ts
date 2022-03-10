import { App } from '../app';
import { Contract } from 'ethers';
import { Tokenizer } from '../token';
import { Token } from '../redux/types';
import { XPower } from '.';

export function XPowerFactory({
    version, token
}: {
    version?: 'v2' | 'v3a' | 'v3b', token?: Token
} = {}): Contract {
    if (version === undefined) {
        version = App.version;
    }
    const symbol = Tokenizer.symbolAlt(token ?? App.token);
    const element_id = `#g-xpower-address-${symbol}-${version}`;
    const address = $(element_id).data('value');
    if (!address) {
        throw new Error(`missing ${element_id}`);
    }
    const contract = new XPower(address);
    return contract.connect(); // instance
}
export default XPowerFactory;
