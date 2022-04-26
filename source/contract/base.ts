import { Contract, ContractInterface, Signer } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { Blockchain } from '../blockchain';

export class Base {
    public constructor(
        address: string, abi: ContractInterface
    ) {
        if (!address) {
            throw new Error('missing contract address');
        }
        this._address = address;
        if (!abi) {
            throw new Error('missing ABI');
        }
        this._abi = abi;
    }
    public async connect(pos?: Web3Provider | Signer): Promise<Contract> {
        if (pos == undefined) {
            pos = new Web3Provider(await Blockchain.provider);
            return this.contract.connect(pos.getSigner());
        }
        return this.contract.connect(pos);
    }
    private get contract(): Contract {
        if (this._contract === undefined) {
            this._contract = new Contract(
                this.address, this.abi
            );
        }
        return this._contract;
    }
    private get abi() {
        return this._abi;
    }
    private get address() {
        return this._address;
    }
    private _abi: ContractInterface;
    private _address: string;
    private _contract: Contract | undefined;
}
export default Base;
