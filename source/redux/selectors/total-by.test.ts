import { totalBy } from './total-by';
import { Token } from '../types';

describe('total-by', () => {
    const address = BigInt('0xabcd');
    const block_hash = BigInt('0xb10c');
    const token = Token.THOR;
    it('should sum to 0', () => {
        const sum = totalBy({ items: {} }, {
            address, amount: 0n, block_hash, token
        });
        expect(sum).toEqual(0n);
    });
    it('should sum to 1', () => {
        const sum = totalBy({
            items: {
                0xffff: { address, amount: 1n, block_hash, token },
            }
        }, {
            address, amount: 1n, block_hash, token
        });
        expect(sum).toEqual(1n);
    });
    it('should sum to 2', () => {
        const sum = totalBy({
            items: {
                0xffff: { address, amount: 1n, block_hash, token },
                0xfff0: { address, amount: 2n, block_hash, token },
            }
        }, {
            address, amount: 2n, block_hash, token
        });
        expect(sum).toEqual(2n);
    });
    it('should sum to 3', () => {
        const sum = totalBy({
            items: {
                0xffff: { address, amount: 1n, block_hash, token },
                0xfff0: { address, amount: 2n, block_hash, token },
                0xff00: { address, amount: 3n, block_hash, token },
            }
        }, {
            address, amount: 3n, block_hash, token
        });
        expect(sum).toEqual(3n);
    });
});
