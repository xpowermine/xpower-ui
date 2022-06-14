import { NftFullId, NftIssue, NftToken, NftLevel } from '../types';
import { Amount, Supply } from '../types';

export type SetNft = {
    type: 'nfts/set', payload: {
        nft: NftFullId | {
            token: NftToken,
            issue: NftIssue,
            level: NftLevel,
        },
        item: {
            amount: Amount,
            supply: Supply
        }
    }
};
export const setNft = (
    nft: NftFullId | {
        token: NftToken,
        issue: NftIssue,
        level: NftLevel,
    },
    item: {
        amount: Amount,
        supply: Supply
    }
): SetNft => ({
    type: 'nfts/set', payload: {
        nft, item
    }
});
export type AddNft = {
    type: 'nfts/add', payload: {
        nft: NftFullId | {
            token: NftToken,
            issue: NftIssue,
            level: NftLevel,
        },
        item?: {
            amount: Amount,
            supply?: Supply
        }
    }
};
export const addNft = (
    nft: NftFullId | {
        token: NftToken,
        issue: NftIssue,
        level: NftLevel,
    },
    item?: {
        amount: Amount, // new-amount = old-amount + amount
        supply?: Supply // new-supply = supply ?? old-supply + amount
    }
): AddNft => ({
    type: 'nfts/add', payload: {
        nft, item
    }
});
export type RemoveNft = {
    type: 'nfts/remove', payload: {
        nft: NftFullId | {
            token: NftToken,
            issue: NftIssue,
            level: NftLevel,
        },
        item?: {
            amount: Amount,
            supply?: Supply
        }
    }
};
export const removeNft = (
    nft: NftFullId | {
        token: NftToken,
        issue: NftIssue,
        level: NftLevel,
    },
    item?: {
        amount: Amount, // new-amount = old-amount - amount
        supply?: Supply // new-supply = supply ?? old-supply (*no* decrease!)
    }
): RemoveNft => ({
    type: 'nfts/remove', payload: {
        nft, item
    }
});
export type Action = SetNft | AddNft | RemoveNft;
