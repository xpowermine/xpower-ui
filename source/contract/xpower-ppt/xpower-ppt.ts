import ABI from './xpower-nft-staked.abi.json';
import { Base } from '../base';

export class XPowerPpt extends Base {
    public constructor(
        address: string, abi = ABI
    ) {
        super(address, abi);
    }
}
export default XPowerPpt;
