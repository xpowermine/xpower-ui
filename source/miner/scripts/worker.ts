/* eslint @typescript-eslint/no-var-requires: [off] */
/* eslint @typescript-eslint/no-unused-vars: [off] */

import { Interval, Level, Nonce, Token } from '../../redux/types';
import { Address, Amount, BlockHash } from '../../redux/types';
import { x40, x64, x64_plain } from '../../functions';

import { defaultAbiCoder as abi } from 'ethers/lib/utils';
import { randomBytes } from 'ethers/lib/utils';
import { Observable } from 'observable-fns';

import { WorkerFunction } from 'threads/dist/types/worker';
import { WorkerModule } from 'threads/dist/types/worker';
import { expose } from 'threads/worker';

const keccak = require('js-keccak-tiny/dist/node-bundle');
let keccak256: (array: Uint8Array) => string;
let worker: Worker | undefined;
let worker_id = 0;

export interface Miner extends Function {
    (context: Context, nonce: Nonce): string
}
export type Context = {
    address: Address,
    block_hash: BlockHash,
    callback?: (item: Item) => void,
    interval: Interval,
    token: Token,
};
export type IWorker = WorkerModule<keyof {
    identifier: WorkerFunction;
    init: WorkerFunction;
    start: WorkerFunction;
    pause: WorkerFunction;
    resume: WorkerFunction;
    stop: WorkerFunction;
    reset: WorkerFunction;
}>;
export type Item = {
    nonce: Nonce, amount: Amount
};
expose({
    identifier() {
        return worker_id;
    },
    async init(
        token: Token, address: Address, level: Level, meta: {
            id: number
        }
    ) {
        if (worker !== undefined) {
            throw new Error(`worker already initialized`);
        } else {
            const { keccak256: hash } = await keccak();
            keccak256 = (a) => hash(a).toString('hex');
        }
        worker = new Worker(token, address, level, meta);
        worker_id = meta.id;
    },
    start(
        block_hash: BlockHash
    ) {
        if (worker === undefined) {
            throw new Error(`no worker`);
        }
        return new Observable<Item>((observer) => {
            worker?.start(block_hash, (i) => observer.next(i));
        });
    },
    pause() {
        if (worker === undefined) {
            throw new Error(`no worker`);
        }
        worker.pause();
    },
    resume() {
        if (worker === undefined) {
            throw new Error(`no worker`);
        }
        worker.resume();
    },
    stop() {
        if (worker === undefined) {
            throw new Error(`no worker`);
        }
        worker.stop();
    },
    reset(
        block_hash: BlockHash
    ) {
        if (worker === undefined) {
            throw new Error(`no worker`);
        }
        worker.reset(block_hash);
    }
});
class Worker {
    public constructor(
        token: Token, address: Address, level: Level, meta: {
            id: number
        }
    ) {
        this._amount = amount(token, level);
        this._context = {
            address, block_hash: 0n, interval: interval(), token
        };
        this._miner = miner(level);
        this._nonce = nonce(meta.id);
    }
    public start(
        block_hash: BlockHash,
        callback: (item: Item) => void
    ) {
        if (this.running) {
            throw new Error('already running');
        } else {
            this.context.block_hash = block_hash;
            this.context.callback = callback;
            this.running = true;
        }
        this.iid = this.loop(callback);
    }
    public pause() {
        if (this.iid) {
            clearInterval(this.iid);
            this.iid = undefined;
        }
    }
    public resume() {
        if (this.context.callback &&
            this.iid === undefined
        ) {
            this.iid = this.loop(
                this.context.callback
            );
        }
    }
    public stop() {
        this._running = false;
    }
    public reset(block_hash: BlockHash) {
        this.context.interval = interval();
        this.context.block_hash = block_hash;
    }
    private loop(callback: (item: Item) => void) {
        let khz = 100, dt = 1, dt_outer = 1, dt_inner = 0;
        const iid = setInterval(() => {
            dt_outer = performance.now() - dt_outer;
            if (this.running) {
                dt_inner = performance.now();
                const i_max = Math.ceil(khz);
                for (let i = 0; i < i_max; i++) {
                    const item = this.work();
                    if (item.amount > 0) {
                        callback(item);
                    }
                }
                dt_inner = performance.now() - dt_inner;
            } else {
                clearInterval(iid);
            }
            dt = 100 * dt_outer - dt_inner;
            if (Math.abs(dt) > 10) {
                khz += 100 / dt;
            }
            dt_outer = performance.now();
        });
        return iid;
    }
    private work() {
        const nonce = this.next_nonce;
        const amount = this.amount(
            this.miner(this.context, nonce)
        );
        return { nonce, amount };
    }
    private get amount() {
        return this._amount;
    }
    private get context() {
        return this._context;
    }
    private get iid() {
        return this._iid;
    }
    private set iid(value: NodeJS.Timer | undefined) {
        this._iid = value;
    }
    private get miner() {
        return this._miner;
    }
    private get next_nonce() {
        return this._nonce++;
    }
    private get running() {
        return this._running;
    }
    private set running(value: boolean) {
        this._running = value;
    }
    private _amount: (hash: string) => Amount;
    private _context: Context;
    private _iid?: NodeJS.Timer;
    private _miner: Miner;
    private _nonce: Nonce;
    private _running = false;
}
function interval() {
    const time = new Date().getTime();
    return Math.floor(time / 3_600_000);
}
function nonce(
    offset: number, length = 2 ** 48
) {
    const bytes = randomBytes(4);
    const view = new DataView(bytes.buffer);
    return view.getUint32(0) + offset * length;
}
function amount(
    token: Token, level: Level
) {
    const n_difficulty = difficulty({
        timestamp: Date.parse('2022-02-22T22:22:22.000Z')
    });
    const n_level = BigInt(level);
    const n_threshold =
        n_level > n_difficulty + 1n
            ? n_level : n_difficulty + 1n;
    switch (token) {
        case Token.QRSH:
            return (hash: string) => {
                const lhs_zeros = zeros(hash);
                if (lhs_zeros >= n_threshold) {
                    return 16n ** (lhs_zeros - n_difficulty) - 1n;
                }
                return 0n;
            };
        case Token.AQCH:
            return (hash: string) => {
                const lhs_zeros = zeros(hash);
                if (lhs_zeros >= n_threshold) {
                    return 2n ** (lhs_zeros - n_difficulty) - 1n;
                }
                return 0n;
            };
        case Token.PARA:
            return (hash: string) => {
                const lhs_zeros = zeros(hash);
                if (lhs_zeros >= n_threshold) {
                    return (lhs_zeros - n_difficulty);
                }
                return 0n;
            };
        default:
            return (hash: string) => 0n;
    }
}
function difficulty({
    timestamp, days = 86_400_000n
}: {
    timestamp: bigint | number, days?: bigint
}) {
    if (typeof timestamp === 'number') {
        timestamp = BigInt(timestamp);
    }
    const now = BigInt(new Date().getTime());
    if (now - timestamp > 0n) {
        return 100n * (now - timestamp) / (4n * 365_25n * days);
    }
    return 0n;
}
function zeros(
    hash: string
) {
    const match = hash.match(/^(?<zeros>0+)/);
    if (match && match.groups) {
        return BigInt(match.groups.zeros.length);
    }
    return 0n;
}
function miner(
    level: Level
) {
    const abi_encode = abi_encoder(level);
    return (context: Context, nonce: Nonce) => keccak256(
        abi_encode(context, nonce)
    );
}
function abi_encoder(
    level: Level
) {
    const lazy_arrayify = arrayifier(level);
    return (
        { token, address, block_hash, interval }: Context, nonce: Nonce
    ) => {
        let value = abi_encoded[interval];
        if (value === undefined) {
            const template = abi.encode([
                'string', 'address', 'uint256', 'bytes32', 'uint256'
            ], [
                token,
                x40(address),
                interval,
                x64(block_hash),
                0
            ]);
            abi_encoded[interval] = value = arrayify(template.slice(2));
            array_cache[level] = arrayify(x64_plain(nonce));
            nonce_cache[level] = nonce;
        }
        const array = lazy_arrayify(nonce, x64_plain(nonce));
        value.set(array, 128);
        return value;
    };
}
function arrayifier(
    level: Level
) {
    const diff_max = 16n ** BigInt(level) - 1n;
    const offset_2 = 64 - level * 2;
    const offset_1 = 32 - level;
    return (nonce: Nonce, x64_nonce: string) => {
        if (nonce - nonce_cache[level] > diff_max) {
            array_cache[level] = arrayify(x64_nonce);
            nonce_cache[level] = nonce;
        }
        const array = arrayify(x64_nonce.slice(offset_2));
        array_cache[level].set(array, offset_1);
        return array_cache[level];
    };
}
function arrayify(
    data: string, list: number[] = []
) {
    for (let i = 0; i < data.length; i += 2) {
        list.push(parseInt(data.substring(i, i + 2), 16));
    }
    return new Uint8Array(list);
}
// cache: (interval: number) => abi.encode(token, nonce, ...)
const abi_encoded = {} as Record<Interval, Uint8Array>;
// cache: (level: number) => arrayify(x64-nonce)
const array_cache = {} as Record<Level, Uint8Array>;
// cache: (level: number) => nonce
const nonce_cache = {} as Record<Level, Nonce>;
