import { total } from './total';
import { Token } from '../types';

describe('total', () => {
    const address = BigInt('0xabcd');
    const block_hash = BigInt('0xb10c');
    const token = Token.THOR;
    it('should sum to 0', () => {
        const sum = total({ items: {} }, {
            address, block_hash, token
        });
        expect(sum).toEqual(0n);
    });
    it('should sum to 1', () => {
        const sum = total({
            items: {
                0xffff: { address, amount: 1n, block_hash, token },
            }
        }, {
            address, block_hash, token
        });
        expect(sum).toEqual(1n);
    });
    it('should sum to 3', () => {
        const sum = total({
            items: {
                0xffff: { address, amount: 1n, block_hash, token },
                0xfff0: { address, amount: 2n, block_hash, token },
            }
        }, {
            address, block_hash, token
        });
        expect(sum).toEqual(3n);
    });
    it('should sum to 6', () => {
        const sum = total({
            items: {
                0xffff: { address, amount: 1n, block_hash, token },
                0xfff0: { address, amount: 2n, block_hash, token },
                0xff00: { address, amount: 3n, block_hash, token },
            }
        }, {
            address, block_hash, token
        });
        expect(sum).toEqual(6n);
    });
});
