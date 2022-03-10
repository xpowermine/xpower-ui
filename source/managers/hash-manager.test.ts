/**
 * @jest-environment jsdom
 */
import { HashManager, Slot } from './hash-manager';

describe('HashManager', () => {
    const cpu_slot = { slot: 'para' } as Slot;
    const gpu_slot = { slot: 'aqch' } as Slot;
    const block_hash = BigInt('0xb10c');
    it('should set time for block-hash', () => {
        HashManager.set(block_hash, 1n, cpu_slot);
        const latest_hash = HashManager.latestHash(cpu_slot);
        expect(latest_hash).toEqual(block_hash);
        const latest_time = HashManager.latestTime(cpu_slot);
        expect(latest_time).toEqual(1n);
    });
    it('should get time for block-hash (for PARA slot)', () => {
        const cpu_time = HashManager.get(block_hash, cpu_slot);
        expect(cpu_time).toEqual(1n);
    });
    it('should *not* get time for block-hash (for AQCH slot)', () => {
        const gpu_time = HashManager.get(block_hash, gpu_slot);
        expect(gpu_time).toEqual(null);
    });
});
