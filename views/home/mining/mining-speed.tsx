import { App } from '../../../source/app';
import { Blockchain } from '../../../source/blockchain';
import { MiningManager } from '../../../source/managers';
import { Token } from '../../../source/redux/types';
import { Tooltip } from '../../tooltips';

import React from 'react';
import { DashCircle } from '../../../public/images/tsx';
import { PlusCircle } from '../../../public/images/tsx';

export class MiningSpeed extends React.Component<{
    token: Token, speed: number
}, {
    token: Token, speed: number, disabled: boolean
}> {
    constructor(props: {
        token: Token, speed: number
    }) {
        super(props);
        this.state = {
            disabled: false, ...props
        };
        this.events();
    }
    events() {
        App.onTokenSwitch((token) => {
            this.setState({ token });
        });
        Blockchain.onConnect(/*initialize*/({
            address, token
        }) => {
            const miner = MiningManager.miner(address, {
                token
            });
            this.setState({ speed: miner.speed });
        });
        Blockchain.onceConnect(/*synchronize*/({
            address, token
        }) => {
            const miner = MiningManager.miner(address, {
                token
            });
            miner.on('increased', (ev) => {
                this.setState({ speed: ev.speed });
            });
            miner.on('decreased', (ev) => {
                this.setState({ speed: ev.speed });
            });
            miner.on('starting', () => {
                this.setState({ disabled: true });
            });
            miner.on('stopped', () => {
                this.setState({ disabled: false });
            });
        }, {
            per: () => App.token
        });
    }
    render() {
        const { token, speed, disabled } = this.state;
        return <div
            className='btn-group tweak-mining' role='group'
        >
            {this.$decreaser(token, speed, disabled)}
            {this.$progressor(speed)}
            {this.$increaser(token, speed, disabled)}
        </div>;
    }
    private $increaser(
        token: Token, speed: number, disabled: boolean
    ) {
        return <div
            className='btn-group increaser' role='group'
        >
            <button type='button' id='increase'
                className='btn btn-outline-warning'
                data-bs-toggle='tooltip' data-bs-placement='top'
                disabled={!this.increasable(speed, disabled)}
                onClick={this.increase.bind(this, token, speed, disabled)}
                title='Increase mining speed'
            >
                {PlusCircle({ fill: true })}
            </button>
        </div>;
    }
    private increasable(
        speed: number, disabled: boolean
    ) {
        return !disabled && speed <= 0.999;
    }
    async increase(
        token: Token, speed: number, disabled: boolean
    ) {
        if (!this.increasable(speed, disabled)) {
            return;
        }
        const address = await Blockchain.selectedAddress;
        if (!address) {
            throw new Error('missing selected-address');
        }
        const miner = MiningManager.miner(address, {
            token
        });
        miner.increase();
    }
    private $decreaser(
        token: Token, speed: number, disabled: boolean
    ) {
        return <div
            className='btn-group decreaser' role='group'
        >
            <button type='button' id='decrease'
                className='btn btn-outline-warning'
                data-bs-toggle='tooltip' data-bs-placement='top'
                disabled={!this.decreasable(speed, disabled)}
                onClick={this.decrease.bind(this, token, speed, disabled)}
                title='Decrease mining speed'
            >
                {DashCircle({ fill: true })}
            </button>
        </div>;
    }
    private decreasable(
        speed: number, disabled: boolean
    ) {
        return !disabled && speed >= 0.001;
    }
    async decrease(
        token: Token, speed: number, disabled: boolean
    ) {
        if (!this.decreasable(speed, disabled)) {
            return;
        }
        const address = await Blockchain.selectedAddress;
        if (!address) {
            throw new Error('missing selected-address');
        }
        const miner = MiningManager.miner(address, {
            token
        });
        miner.decrease();
    }
    private $progressor(
        speed: number
    ) {
        return <div
            className='btn-group progressor' role='group'
            data-bs-toggle='tooltip' data-bs-placement='top'
            title={`Mining speed: ${(100 * speed).toFixed(3)}%`}
        >
            <div className='progress'>
                <div id='speed'
                    role='progressbar' aria-label='mining speed controller'
                    className={`progress-bar ${this.indicator(speed)}`}
                    style={{ width: `${100 * speed}%` }}
                />
            </div>
        </div>;
    }
    indicator(
        speed: number
    ) {
        return speed < 1 ? 'with-indicator' : '';
    }
    onWheel(
        e: WheelEvent
    ) {
        e.preventDefault();
        e.stopPropagation();
        if (e.deltaY < 0) {
            const { token, speed, disabled } = this.state;
            this.increase(token, speed, disabled);
        }
        if (e.deltaY > 0) {
            const { token, speed, disabled } = this.state;
            this.decrease(token, speed, disabled);
        }
        return false;
    }
    componentDidMount() {
        if (document.body.clientWidth <= 576) {
            const $inc = document.getElementById('increase');
            if ($inc) Tooltip.getInstance($inc)?.disable();
            const $dec = document.getElementById('decrease');
            if ($dec) Tooltip.getInstance($dec)?.disable();
        }
        const $progressor = document.querySelector<HTMLElement>(
            '.progressor'
        );
        $progressor?.addEventListener('wheel', this.onWheel.bind(this), {
            passive: false
        });
    }
    componentDidUpdate() {
        const $progressor = document.querySelector<HTMLElement>(
            '.progressor'
        );
        if ($progressor) {
            Tooltip.getInstance($progressor)?.dispose();
            Tooltip.getOrCreateInstance($progressor);
        }
        const $inc = document.getElementById('increase');
        if ($inc) Tooltip.getInstance($inc)?.hide();
        const $dec = document.getElementById('decrease');
        if ($dec) Tooltip.getInstance($dec)?.hide();
    }
}
export default MiningSpeed;
