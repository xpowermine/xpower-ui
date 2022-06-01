import { NftLevel, NftToken } from '../types';
import { nftsBy } from './nfts-by';

describe('nfts-by', () => {
    const issue = 2021;
    const level = NftLevel.UNIT;
    const token = NftToken.ODIN;
    it('should return {}', () => {
        const nfts = { items: {} };
        const nfts_by = nftsBy(nfts);
        expect(nfts_by).toEqual(nfts);
    });
    it('should return { "ODIN:2021": ... }', () => {
        const nfts = {
            items: {
                'ODIN:202100': {
                    amount: 1n, supply: 2n
                }
            }
        };
        const nfts_by = nftsBy(nfts, {
            issue, level, token
        });
        expect(nfts_by).toEqual(nfts);
    });
    it('should return { "ODIN:2021": ..., "ODIN:2022": ... }', () => {
        const nfts = {
            items: {
                'ODIN:202100': {
                    amount: 1n, supply: 2n
                },
                'ODIN:202103': {
                    amount: 2n, supply: 4n
                }
            }
        };
        const nfts_by = nftsBy(nfts, {
            issue, token
        });
        expect(nfts_by).toEqual(nfts);
    });
});
