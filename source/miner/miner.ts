import { Address, Amount, BlockHash, Level, Nonce, Token } from '../redux/types';
import { ModuleThread, spawn, Thread, Worker } from 'threads';
import { IWorker, Item } from './scripts/worker';
import { EventEmitter } from 'events';

export type OnMined = ({ nonce, amount, worker }: {
    nonce: Nonce, amount: Amount, worker: number
}) => void;

export class Miner extends EventEmitter {
    private static SPEED_DEFAULT = 0.5; // [0..1]
    private static WORKERS_MAX = logical_cpus();
    public constructor(
        /** token to mine for */
        token: Token,
        /** address to mine for */
        address: Address,
        /** min. level to mine at */
        level: Level = 1,
        /** speed to mine with */
        speed = Miner.SPEED_DEFAULT
    ) {
        super();
        this._token = token;
        this._address = address;
        this._level = level;
        this._speed = speed;
        this.setMaxListeners(20);
    }
    public get running(): boolean {
        return this.workers.length > 0;
    }
    public async start(block_hash: BlockHash, callback: OnMined) {
        if (this.running) {
            throw new Error(`miner is running`);
        }
        this.emit('starting', {
            running: false, now: performance.now()
        });
        for (let i = 0; i < Miner.WORKERS_MAX * this.speed; i++) {
            this.workers.push(await this.hire(i));
        }
        this.emit('started', {
            running: this.running, now: performance.now()
        });
        for (let i = 0; i < this.workers.length; i++) {
            const observer = this.workers[i].start(block_hash);
            observer.subscribe((item: Item) => callback({
                ...item, worker: i
            }));
        }
        this._paused = false;
    }
    public async pause() {
        if (this._paused === false) {
            this._paused = true;
        } else {
            return;
        }
        this.emit('pausing', {
            running: this.running, now: performance.now()
        });
        for (const worker of this.workers) {
            await worker.pause();
        }
        this.emit('paused', {
            running: this.running, now: performance.now()
        });
    }
    public async resume() {
        if (this._paused) {
            this._paused = false;
        } else {
            return;
        }
        this.emit('resuming', {
            running: this.running, now: performance.now()
        });
        for (const worker of this.workers) {
            await worker.resume();
        }
        this.emit('resumed', {
            running: this.running, now: performance.now()
        });
    }
    public async stop() {
        this.emit('stopping', {
            running: this.running, now: performance.now()
        });
        while (this.workers.length > 0) {
            await this.fire();
        }
        this.emit('stopped', {
            running: this.running, now: performance.now()
        });
        this._paused = false;
    }
    public increase(by = 1 / Miner.WORKERS_MAX): number {
        const old_speed = this.speed;
        this.speed += by;
        const new_value = this.speed;
        if (new_value !== old_speed) {
            this.emit('increased', {
                speed: new_value
            });
        }
        return new_value;
    }
    public decrease(by = 1 / Miner.WORKERS_MAX): number {
        const old_speed = this.speed;
        this.speed -= by;
        const new_value = this.speed;
        if (new_value !== old_speed) {
            this.emit('decreased', {
                speed: new_value
            });
        }
        return new_value;
    }
    private async hire(id: number) {
        let worker: Worker;
        try {
            worker = new Worker($('#g-worker-path').data('value'));
        } catch (ex) {
            worker = new Worker('./scripts/worker.js');
        }
        const thread = await spawn<IWorker>(worker);
        await thread.init(this.token, this.address, this.level, { id });
        return thread;
    }
    private async fire() {
        const worker = this.workers.pop() as ModuleThread<IWorker>;
        await worker.stop(); await Thread.terminate(worker);
    }
    private get address() {
        return this._address;
    }
    private get level() {
        return this._level;
    }
    private get speed() {
        return this._speed;
    }
    private set speed(value: number) {
        this._speed = value;
    }
    private get token(): Token {
        return this._token;
    }
    private get workers(): ModuleThread<IWorker>[] {
        return this._workers;
    }
    private _address: Address;
    private _level: Level;
    private _paused = false;
    private _speed: number;
    private _token: Token;
    private _workers: ModuleThread<IWorker>[] = [];
}
function logical_cpus() {
    const n_cpus = window.navigator.hardwareConcurrency;
    return n_cpus + n_cpus % 2;
}
export default Miner;
