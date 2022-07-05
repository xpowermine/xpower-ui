import { nonceBy } from './nonce-by';
import { Token } from '../types';

describe('nonce-by', () => {
    const address = BigInt('0xabcd');
    const block_hash = BigInt('0xb10c');
    const token = Token.THOR;
    it('should return nonce = undefined', () => {
        const { nonce } = nonceBy({ items: {} }, {
            address, block_hash, amount: 0n
        });
        expect(nonce).not.toBeDefined();
    });
    it('should return nonce = 0xffff', () => {
        const { nonce } = nonceBy({
            items: {
                0xffff: { address, amount: 1n, block_hash, token },
            }
        }, {
            address, block_hash, amount: 1n, token,
        });
        expect(nonce).toEqual(0xffff);
    });
    it('should return nonce = 0xfff0', () => {
        const { nonce } = nonceBy({
            items: {
                0xffff: { address, amount: 1n, block_hash, token },
                0xfff0: { address, amount: 2n, block_hash, token },
            }
        }, {
            address, amount: 2n, block_hash, token
        });
        expect(nonce).toEqual(0xfff0);
    });
    it('should return nonce = 0xff00', () => {
        const { nonce } = nonceBy({
            items: {
                0xffff: { address, amount: 1n, block_hash, token },
                0xfff0: { address, amount: 2n, block_hash, token },
                0xff00: { address, amount: 3n, block_hash, token },
                0xf000: { address, amount: 3n, block_hash, token },
                0x0000: { address, amount: 3n, block_hash, token },
            }
        }, {
            address, amount: 3n, block_hash, token
        }, 2);
        expect(nonce).toEqual(0xff00);
    });
});
