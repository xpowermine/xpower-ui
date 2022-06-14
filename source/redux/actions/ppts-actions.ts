import { NftFullId, NftIssue, NftToken, NftLevel } from '../types';
import { Amount, Supply } from '../types';

export type SetPpt = {
    type: 'ppts/set', payload: {
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
export const setPpt = (
    nft: NftFullId | {
        token: NftToken,
        issue: NftIssue,
        level: NftLevel,
    },
    item: {
        amount: Amount,
        supply: Supply
    }
): SetPpt => ({
    type: 'ppts/set', payload: {
        nft, item
    }
});
export type AddPpt = {
    type: 'ppts/add', payload: {
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
export const addPpt = (
    nft: NftFullId | {
        token: NftToken,
        issue: NftIssue,
        level: NftLevel,
    },
    item?: {
        amount: Amount, // new-amount = old-amount + amount
        supply?: Supply // new-supply = supply ?? old-supply + amount
    }
): AddPpt => ({
    type: 'ppts/add', payload: {
        nft, item
    }
});
export type RemovePpt = {
    type: 'ppts/remove', payload: {
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
export const removePpt = (
    nft: NftFullId | {
        token: NftToken,
        issue: NftIssue,
        level: NftLevel,
    },
    item?: {
        amount: Amount, // new-amount = old-amount - amount
        supply?: Supply // new-supply = supply ?? old-supply (*no* decrease!)
    }
): RemovePpt => ({
    type: 'ppts/remove', payload: {
        nft, item
    }
});
export type Action = SetPpt | AddPpt | RemovePpt;
