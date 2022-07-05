import { noncesBy } from './nonces-by';
import { Token } from '../types';

describe('nonces-by', () => {
    const address = BigInt('0xabcd');
    const block_hash = BigInt('0xb10c');
    const token = Token.THOR;
    it('should return nonces.length = 0', () => {
        const array = noncesBy({ items: {} }, {
            address, block_hash, amount: 0n, token
        });
        expect(array.length).toEqual(0);
    });
    it('should return nonces[0] = 0xffff', () => {
        const array = noncesBy({
            items: {
                0xffff: { address, amount: 1n, block_hash, token }
            }
        }, {
            address, amount: 1n, block_hash, token
        });
        expect(array.length).toEqual(1);
        expect(array[0].nonce).toEqual(0xffff);
    });
    it('should return nonces[0] = 0xfff0', () => {
        const array = noncesBy({
            items: {
                0xffff: { address, amount: 1n, block_hash, token },
                0xfff0: { address, amount: 2n, block_hash, token },
            }
        }, {
            address, amount: 2n, block_hash, token
        });
        expect(array.length).toEqual(1);
        expect(array[0].nonce).toEqual(0xfff0);
    });
    it('should return nonces[2] = 0xff00', () => {
        const array = noncesBy({
            items: {
                0xffff: { address, amount: 1n, block_hash, token },
                0xfff0: { address, amount: 2n, block_hash, token },
                0xff00: { address, amount: 3n, block_hash, token },
                0xf000: { address, amount: 3n, block_hash, token },
                0x0000: { address, amount: 3n, block_hash, token },
            }
        }, {
            address, block_hash, amount: 3n, token
        });
        expect(array[2].nonce).toEqual(0xff00);
    });
});
