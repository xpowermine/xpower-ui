import { App } from '../../../source/app';
import { Tokenizer } from '../../../source/token';
import { Blockchain } from '../../../source/blockchain';
import { x64 } from '../../../source/functions';
import { HashManager } from '../../../source/managers';
import { IntervalManager } from '../../../source/managers';
import { MiningManager } from '../../../source/managers';
import { Token, Tokens } from '../../../source/redux/types';
import { MoeWallet, OnInit } from '../../../source/wallet';

import React, { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { MiningToggle } from './mining-toggle';
import { MiningSpeed } from './mining-speed';

export class Mining extends React.Component<{
    token: Token, speed: number
}> {
    render() {
        const { token, speed } = this.props;
        return <React.Fragment>
            <MiningToggle token={token} />
            <MiningSpeed token={token} speed={speed} />
        </React.Fragment>;
    }
}
Blockchain.onceConnect(function refreshBlockHash({
    address, token
}) {
    const on_init: OnInit = async (block_hash, timestamp, ev) => {
        const contract = await moe_wallet.contract;
        if (contract.address === ev.address) {
            console.debug('[on:init]', x64(block_hash), timestamp, ev);
        } else {
            return;
        }
        const token_lc = Tokenizer.lower(token);
        HashManager.set(block_hash, timestamp, {
            slot: token_lc
        });
    };
    const moe_wallet = new MoeWallet(address, token);
    moe_wallet.onInit(on_init);
}, {
    per: () => App.token
});
Blockchain.onceConnect(function restartMining({
    address
}) {
    const im = new IntervalManager({ start: true });
    im.on('tick', async () => {
        const miner = MiningManager.miner(address, {
            token: App.token
        });
        const running = miner.running;
        if (running) {
            await miner.stop();
        }
        if (running) {
            MiningManager.toggle(address, {
                token: App.token
            });
        }
    });
});
Blockchain.onConnect(function stopMining({
    address
}) {
    for (const token of Tokens()) {
        if (token === Token.HELA) {
            continue;
        }
        const miner = MiningManager.miner(address, {
            token
        });
        const running = miner.running;
        if (running) miner.stop();
    }
});
Blockchain.onceConnect(function benchmarkMining({
    address, token
}) {
    const miner = MiningManager.miner(address, {
        token
    });
    miner.on('started', function (
        { now: beg_ms }: { now: number; }
    ) {
        miner.once('stopped', function (
            { now: end_ms }: { now: number; }
        ) {
            const ms = (end_ms - beg_ms).toFixed(3);
            console.debug('[mining.duration]', ms, '[ms]');
        });
    });
}, {
    per: () => App.token
});
if (require.main === module) {
    const $mining = document.querySelector('form#mining');
    createRoot($mining!).render(createElement(Mining, {
        token: App.token, speed: App.speed
    }));
}
export default Mining;
