/**
 * @jest-environment jsdom
 */
import { Token } from '../redux/types';
import { Miner } from '.';

describe('Miner', () => {
    const address = BigInt('0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC');
    it('should be constructible', () => {
        const miner = new Miner(Token.AQCH, address);
        expect(miner).toBeDefined();
    });
    it('should start & stop mining', async () => {
        const miner = new Miner(Token.AQCH, address);
        expect(miner).toBeDefined();
        await miner.start(0n, async ({ nonce, amount, worker }) => {
            expect(nonce).toBeGreaterThan(0n);
            expect(amount).toBeGreaterThan(0n);
            expect(worker).toBeGreaterThanOrEqual(0);
            await miner.stop();
            expect(miner.running).toBeFalsy();
        })
    })
});
