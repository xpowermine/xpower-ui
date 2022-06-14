/* eslint @typescript-eslint/no-explicit-any: [off] */
import { nftsReducer } from './nfts-reducer';

import { setNft } from '../actions';
import { addNft } from '../actions';
import { removeNft } from '../actions';
import { Nfts, Empty } from '../types';

describe('Store w/nfts-reducer (set)', () => {
    const id = 'THOR:202103';
    it('should set 1 nft', () => {
        const state_0 = Empty<Nfts>();
        const state_1 = nftsReducer(state_0, setNft(id, {
            amount: 1n, supply: 1n
        }));
        expect(state_1.items[id]).toEqual({
            amount: 1n, supply: 1n
        });
        expect(state_1.more).toEqual([id]);
        expect(state_1.less).not.toBeDefined();
    });
    it('should set 2 nfts', () => {
        const state_0 = Empty<Nfts>();
        const state_1 = nftsReducer(state_0, setNft(id, {
            amount: 2n, supply: 5n
        }));
        expect(state_1.items[id]).toEqual({
            amount: 2n, supply: 5n
        });
        expect(state_1.more).toEqual([id]);
        expect(state_1.less).not.toBeDefined();
    });
});
describe('Store w/nfts-reducer (add)', () => {
    const id = 'LOKI:202103';
    it('should add 1 nft (w/rel. supply)', () => {
        const state_0 = Empty<Nfts>();
        const state_1 = nftsReducer(state_0, addNft(id, {
            amount: 1n
        }));
        expect(state_1.items[id]).toEqual({
            amount: 1n, supply: 1n
        });
        expect(state_1.more).toEqual([id]);
        expect(state_1.less).not.toBeDefined();
    });
    it('should add 1 nft (w/abs. supply)', () => {
        const state_0 = Empty<Nfts>();
        const state_1 = nftsReducer(state_0, addNft(id, {
            amount: 1n, supply: 10n
        }));
        expect(state_1.items[id]).toEqual({
            amount: 1n, supply: 10n
        });
        expect(state_1.more).toEqual([id]);
        expect(state_1.less).not.toBeDefined();
    });
    it('should *not* add 1 nft (w/abs. supply)', () => {
        const state_0 = Empty<Nfts>();
        let state_1;
        try {
            state_1 = nftsReducer(state_0, addNft(id, {
                amount: 2n, supply: 1n
            }));
        } catch (ex: any) {
            expect(ex.message).toBe(`NFT(${id}) supply=1 < amount=2`)
        }
        expect(state_1).not.toBeDefined();
    });
    it('should add 2 nfts (w/1st:rel. supply & 2nd:rel. supply)', () => {
        const state_0 = Empty<Nfts>();
        const state_1 = nftsReducer(state_0, addNft(id, {
            amount: 1n
        }));
        expect(state_1.items[id]).toEqual({
            amount: 1n, supply: 1n
        });
        const state_2 = nftsReducer(state_1, addNft(id, {
            amount: 2n
        }));
        expect(state_2.items[id]).toEqual({
            amount: 3n, supply: 3n
        });
        expect(state_1.more).toEqual([id]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).toEqual([id]);
        expect(state_2.less).not.toBeDefined();
    });
    it('should add 2 nfts (w/1st:abs. supply & 2nd:rel. supply)', () => {
        const state_0 = Empty<Nfts>();
        const state_1 = nftsReducer(state_0, addNft(id, {
            amount: 1n, supply: 10n
        }));
        expect(state_1.items[id]).toEqual({
            amount: 1n, supply: 10n
        });
        const state_2 = nftsReducer(state_1, addNft(id, {
            amount: 2n
        }));
        expect(state_2.items[id]).toEqual({
            amount: 3n, supply: 12n
        });
        expect(state_1.more).toEqual([id]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).toEqual([id]);
        expect(state_2.less).not.toBeDefined();
    });
    it('should add 2 nfts (w/1st:rel. supply & 2nd:abs. supply)', () => {
        const state_0 = Empty<Nfts>();
        const state_1 = nftsReducer(state_0, addNft(id, {
            amount: 1n
        }));
        expect(state_1.items[id]).toEqual({
            amount: 1n, supply: 1n
        });
        const state_2 = nftsReducer(state_1, addNft(id, {
            amount: 2n, supply: 20n
        }));
        expect(state_2.items[id]).toEqual({
            amount: 3n, supply: 20n
        });
        expect(state_1.more).toEqual([id]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).toEqual([id]);
        expect(state_2.less).not.toBeDefined();
    });
    it('should add 2 nfts (w/1st:abs. supply & 2nd:abs. supply)', () => {
        const state_0 = Empty<Nfts>();
        const state_1 = nftsReducer(state_0, addNft(id, {
            amount: 1n, supply: 10n
        }));
        expect(state_1.items[id]).toEqual({
            amount: 1n, supply: 10n
        });
        const state_2 = nftsReducer(state_1, addNft(id, {
            amount: 2n, supply: 20n
        }));
        expect(state_2.items[id]).toEqual({
            amount: 3n, supply: 20n
        });
        expect(state_1.more).toEqual([id]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).toEqual([id]);
        expect(state_2.less).not.toBeDefined();
    });
});
describe('Store w/nfts-reducer (remove)', () => {
    const id = 'ODIN:202109';
    it('should remove 1 nft (w/rel. supply)', () => {
        const state_0 = Empty<Nfts>();
        const state_1 = nftsReducer(state_0, addNft(id, {
            amount: 1n
        }));
        expect(state_1.items[id]).toEqual({
            amount: 1n, supply: 1n
        });
        const state_2 = nftsReducer(state_1, removeNft(id, {
            amount: 1n
        }));
        expect(state_2.items[id]).toEqual({
            amount: 0n, supply: 1n
        });
        expect(state_1.more).toEqual([id]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).not.toBeDefined();
        expect(state_2.less).toEqual([id]);
    });
    it('should remove 1 nft (w/abs. supply)', () => {
        const state_0 = Empty<Nfts>();
        const state_1 = nftsReducer(state_0, addNft(id, {
            amount: 1n
        }));
        expect(state_1.items[id]).toEqual({
            amount: 1n, supply: 1n
        });
        const state_2 = nftsReducer(state_1, removeNft(id, {
            amount: 1n, supply: 10n
        }));
        expect(state_2.items[id]).toEqual({
            amount: 0n, supply: 10n
        });
        expect(state_1.more).toEqual([id]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).not.toBeDefined();
        expect(state_2.less).toEqual([id]);
    });
    it('should *not* remove 1 nft (w/abs. supply)', () => {
        const state_0 = Empty<Nfts>();
        const state_1 = nftsReducer(state_0, addNft(id, {
            amount: 5n
        }));
        let state_2;
        try {
            state_2 = nftsReducer(state_1, removeNft(id, {
                amount: 2n, supply: 1n
            }));
        } catch (ex: any) {
            expect(ex.message).toBe(`NFT(${id}) supply=1 < amount=3`)
        }
        expect(state_1.more).toEqual([id]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2).not.toBeDefined();
    });
    it('should remove 2 nfts (w/1st:rel. supply & 2nd:rel. supply)', () => {
        const state_0 = Empty<Nfts>();
        const state_1 = nftsReducer(state_0, addNft(id, {
            amount: 5n
        }));
        expect(state_1.items[id]).toEqual({
            amount: 5n, supply: 5n
        });
        const state_2 = nftsReducer(state_1, removeNft(id, {
            amount: 2n
        }));
        expect(state_2.items[id]).toEqual({
            amount: 3n, supply: 5n
        });
        const state_3 = nftsReducer(state_2, removeNft(id, {
            amount: 1n
        }));
        expect(state_3.items[id]).toEqual({
            amount: 2n, supply: 5n
        });
        expect(state_1.more).toEqual([id]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).not.toBeDefined();
        expect(state_2.less).toEqual([id]);
        expect(state_3.more).not.toBeDefined();
        expect(state_3.less).toEqual([id]);
    });
    it('should remove 2 nfts (w/1st:abs. supply & 2nd:rel. supply)', () => {
        const state_0 = Empty<Nfts>();
        const state_1 = nftsReducer(state_0, addNft(id, {
            amount: 5n
        }));
        expect(state_1.items[id]).toEqual({
            amount: 5n, supply: 5n
        });
        const state_2 = nftsReducer(state_1, removeNft(id, {
            amount: 2n, supply: 4n
        }));
        expect(state_2.items[id]).toEqual({
            amount: 3n, supply: 4n
        });
        const state_3 = nftsReducer(state_2, removeNft(id, {
            amount: 1n
        }));
        expect(state_3.items[id]).toEqual({
            amount: 2n, supply: 4n
        });
        expect(state_1.more).toEqual([id]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).not.toBeDefined();
        expect(state_2.less).toEqual([id]);
        expect(state_3.more).not.toBeDefined();
        expect(state_3.less).toEqual([id]);
    });
    it('should remove 2 nfts (w/1st:rel. supply & 2nd:abs. supply)', () => {
        const state_0 = Empty<Nfts>();
        const state_1 = nftsReducer(state_0, addNft(id, {
            amount: 5n
        }));
        expect(state_1.items[id]).toEqual({
            amount: 5n, supply: 5n
        });
        const state_2 = nftsReducer(state_1, removeNft(id, {
            amount: 2n
        }));
        expect(state_2.items[id]).toEqual({
            amount: 3n, supply: 5n
        });
        const state_3 = nftsReducer(state_2, removeNft(id, {
            amount: 1n, supply: 4n
        }));
        expect(state_3.items[id]).toEqual({
            amount: 2n, supply: 4n
        });
        expect(state_1.more).toEqual([id]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).not.toBeDefined();
        expect(state_2.less).toEqual([id]);
        expect(state_3.more).not.toBeDefined();
        expect(state_3.less).toEqual([id]);
    });
    it('should remove 2 nfts (w/1st:abs. supply & 2nd:abs. supply)', () => {
        const state_0 = Empty<Nfts>();
        const state_1 = nftsReducer(state_0, addNft(id, {
            amount: 5n
        }));
        expect(state_1.items[id]).toEqual({
            amount: 5n, supply: 5n
        });
        const state_2 = nftsReducer(state_1, removeNft(id, {
            amount: 2n, supply: 4n
        }));
        expect(state_2.items[id]).toEqual({
            amount: 3n, supply: 4n
        });
        const state_3 = nftsReducer(state_2, removeNft(id, {
            amount: 1n, supply: 3n
        }));
        expect(state_3.items[id]).toEqual({
            amount: 2n, supply: 3n
        });
        expect(state_1.more).toEqual([id]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).not.toBeDefined();
        expect(state_2.less).toEqual([id]);
        expect(state_3.more).not.toBeDefined();
        expect(state_3.less).toEqual([id]);
    });
});
