import { Amount, Supply } from './base';

export class Nft {
    static token(id: string): NftToken {
        const [prefix] = id.split(':');
        switch (prefix.toLowerCase()) {
            case 'thor':
                return NftToken.THOR;
            case 'loki':
                return NftToken.LOKI;
            case 'odin':
                return NftToken.ODIN;
            case 'hela':
                return NftToken.HELA;
        }
        throw new Error(`unknown token for "${id}"`);
    }
    static issue(id: string): NftIssue {
        const [prefix, suffix] = id.split(':');
        const long_id = suffix ?? prefix;
        const m = long_id.match(/^0+(?<id>[1-9a-f][0-9a-f]+)$/);
        const core_id = m && m.groups ? m.groups.id : long_id;
        const issue = Number(this.decimalized(core_id).slice(0, 4));
        if (isNaN(issue)) {
            throw new Error(`unknown issue for "${id}"`);
        }
        return issue;
    }
    static level(id: string): NftLevel {
        const [prefix, suffix] = id.split(':');
        const long_id = suffix ?? prefix;
        const m = long_id.match(/^0+(?<id>[1-9a-f][0-9a-f]+)$/);
        const core_id = m && m.groups ? m.groups.id : long_id;
        const level = Number(this.decimalized(core_id).slice(-2));
        switch (level) {
            case NftLevel.UNIT:
                return NftLevel.UNIT;
            case NftLevel.KILO:
                return NftLevel.KILO;
            case NftLevel.MEGA:
                return NftLevel.MEGA;
            case NftLevel.GIGA:
                return NftLevel.GIGA;
            case NftLevel.TERA:
                return NftLevel.TERA;
            case NftLevel.PETA:
                return NftLevel.PETA;
            case NftLevel.EXA:
                return NftLevel.EXA;
            case NftLevel.ZETTA:
                return NftLevel.ZETTA;
            case NftLevel.YOTTA:
                return NftLevel.YOTTA;
        }
        throw new Error(`unknown level for "${id}"`);
    }
    static coreIds({ issues, levels }: {
        issues: NftIssue[], levels: NftLevel[]
    }): NftCoreId[] {
        const list = [] as NftCoreId[];
        for (const issue of issues) {
            for (const level of levels) {
                list.push(Nft.coreId({
                    issue, level
                }));
            }
        }
        return list;
    }
    static fullIds({ issues, levels, token }: {
        issues: NftIssue[], levels: NftLevel[], token: NftToken
    }): NftFullId[] {
        const list = [] as NftFullId[];
        for (const issue of issues) {
            for (const level of levels) {
                list.push(Nft.fullId({
                    issue, level, token
                }));
            }
        }
        return list;
    }
    static coreId({ issue, level }: {
        issue: NftIssue, level: NftLevel
    }) {
        if (issue < 2021) {
            throw new Error(`NFT issue=${issue} invalid`);
        }
        if (level < 10) {
            return `${issue}0${level}` as NftCoreId;
        }
        return `${issue}${level}` as NftCoreId;
    }
    static fullId({ issue, level, token }: {
        issue: NftIssue, level: NftLevel, token?: NftToken
    }) {
        if (issue < 2021) {
            throw new Error(`NFT issue=${issue} invalid`);
        }
        if (level < 10) {
            return `${token}:${issue}0${level}` as NftFullId;
        }
        return `${token}:${issue}${level}` as NftFullId;
    }
    private static decimalized(core_id: string) {
        const radix = this.hexadecimal(core_id) ? 16 : 10;
        return parseInt(core_id, radix).toString(10);
    }
    private static hexadecimal(core_id: string, minimum = '202100') {
        return parseInt(core_id, 16) < parseInt(minimum, 16);
    }
}
export type NftFullId = `${NftToken}:${NftCoreId}`;
export type NftCoreId = `${NftIssue}${NftLevel}`;
export type NftIssue = number;
export enum NftToken {
    THOR = 'THOR',
    LOKI = 'LOKI',
    ODIN = 'ODIN',
    HELA = 'HELA',
}
export type NftTokens = keyof typeof NftToken;
export function* NftTokens() {
    for (const t in NftToken) {
        yield t as NftToken;
    }
}
export enum NftLevel {
    UNIT = 0,
    KILO = 3,
    MEGA = 6,
    GIGA = 9,
    TERA = 12,
    PETA = 15,
    EXA = 18,
    ZETTA = 21,
    YOTTA = 24
}
export type NftLevels = keyof typeof NftLevel;
export function* NftLevels() {
    for (const l in NftLevel) {
        if (isNaN(Number(l))) {
            continue;
        }
        yield Number(l) as NftLevel;
    }
}
export type Nfts = {
    /** nft-id => { amount, supply } */
    items: {
        [id: NftFullId]: {
            amount: Amount,
            supply: Supply
        }
    },
    /** set for added nft(s) */
    more?: NftFullId[],
    /** set for removed nft(s) */
    less?: NftFullId[]
}
