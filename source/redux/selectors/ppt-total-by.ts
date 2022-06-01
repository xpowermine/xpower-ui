/* eslint @typescript-eslint/no-unused-vars: [off] */
import { Nft, NftFullId, NftIssue, NftLevel, Nfts, NftToken } from '../types';
import { Amount, Supply } from '../types';

export function pptTotalBy(
    ppts: Nfts, ppt?: NftFullId | {
        issue?: NftIssue,
        level?: NftLevel,
        token?: NftToken,
    }
): {
    amount: Amount, supply: Supply
} {
    const issue = typeof ppt === 'string'
        ? Nft.issue(ppt) : ppt?.issue;
    const level = typeof ppt === 'string'
        ? Nft.level(ppt) : ppt?.level;
    const token = typeof ppt === 'string'
        ? Nft.token(ppt) : ppt?.token;
    const filtered = Object.entries(ppts.items).filter(([id]) => {
        if (issue !== undefined && issue !== Nft.issue(id)) {
            return false;
        }
        if (level !== undefined && level !== Nft.level(id)) {
            return false;
        }
        if (token !== undefined && token !== Nft.token(id)) {
            return false;
        }
        return true;
    });
    const amounts = filtered.map(([_, i]) => i.amount);
    const amount = amounts.reduce((a1, a2) => a1 + a2, 0n);
    const supplies = filtered.map(([_, i]) => i.supply);
    const supply = supplies.reduce((s1, s2) => s1 + s2, 0n);
    return { amount, supply };
}
