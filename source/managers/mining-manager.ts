/* eslint @typescript-eslint/no-explicit-any: [off] */
import { App } from '../app';
import { Tokenizer } from '../token';
import { alert, Alert } from '../functions';
import { HashManager } from '.';
import { IntervalManager } from '.';
import { Address, Amount, Token } from '../redux/types';
import { BlockHash } from '../redux/types';
import { MoeWallet } from '../wallet';
import { Miner } from '../miner';

export class MiningManager {
    static miner(
        address: Address, { token }: { token: Token }
    ): Miner {
        if (this._miner[token] === undefined) {
            this._miner[token] = new Miner(
                token, address, App.level.min, App.speed
            );
        }
        return this._miner[token];
    }
    static async toggle(
        address: Address, { token }: { token: Token }
    ) {
        const token_lc = Tokenizer.lower(token);
        const miner = this.miner(address, {
            token
        });
        if (miner.running) {
            return await miner.stop();
        }
        miner.emit('initializing', {
            block_hash: null
        });
        //
        // if: recent(block-hash?) => mine
        //
        const block_hash = HashManager.latestHash({
            slot: token_lc
        });
        if (block_hash !== null) {
            const timestamp = HashManager.get(block_hash, {
                slot: token_lc
            });
            if (timestamp !== null) {
                const interval = IntervalManager.intervalFrom(
                    new Date(Number(timestamp) * 1000)
                );
                if (interval === IntervalManager.interval) {
                    return mine(address, block_hash);
                }
            }
        }
        //
        // else: !recent(block-hash?) => init & mine
        //
        HashManager.me.once('block-hash', ({
            block_hash
        }: {
            block_hash: BlockHash;
        }) => {
            mine(address, block_hash);
        });
        const moe_wallet = new MoeWallet(address, token);
        try {
            const init = await moe_wallet.init();
            console.debug('[init]', init);
        } catch (ex: any) {
            /* eslint no-ex-assign: [off] */
            if (ex.error) {
                ex = ex.error;
            }
            if (ex.message) {
                if (ex.data && ex.data.message) {
                    ex.message = `${ex.message} [${ex.data.message}]`;
                }
                const $toggle = document.getElementById('toggle-mining');
                alert(ex.message, Alert.warning, {
                    style: { margin: '0.5em 0 -0.5em 0' },
                    after: $toggle?.parentElement
                });
        }
            HashManager.me.removeAllListeners('block-hash');
            miner.emit('initialized', { block_hash: null });
            console.error(ex);
        }
        async function mine(
            address: Address, block_hash: BlockHash
        ) {
            miner.emit('initialized', { block_hash });
            const { min, max } = MiningManager.range(token);
            if (miner.running) {
                await miner.stop();
            }
            miner.start(block_hash, ({
                amount, nonce, worker
            }) => {
                if (amount >= min &&
                    amount <= max) {
                    App.addNonce(nonce, {
                        address,
                        amount,
                        block_hash,
                        token,
                        worker,
                    });
                }
            });
        }
    }
    static range(token: Token): { min: Amount, max: Amount } {
        const min = Tokenizer.amount(token, App.level.min);
        const max = Tokenizer.amount(token, App.level.max);
        return { min, max };
    }
    static _miner = {} as Record<Token, Miner>;
}
export default MiningManager;
