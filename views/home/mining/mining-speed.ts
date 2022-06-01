import { App } from '../../../source/app';
import { Blockchain } from '../../../source/blockchain';
import { Tooltip } from '../../tooltips';

Blockchain.onConnect(function initSpeed({
    address, token
}) {
    const miner = App.miner(address, {
        token
    });
    $('#speed').trigger('change', {
        speed: miner.speed
    });
    const $inc = $('#increase');
    $inc.prop('disabled', miner.speed > 0.999);
    const $dec = $('#decrease');
    $dec.prop('disabled', miner.speed < 0.001);
});
Blockchain.onceConnect(function syncSpeed() {
    const $speed = $('#speed');
    $speed.on('change', (ev, { speed }) => {
        const speed_pct = `${(speed * 100).toFixed(3)}%`;
        $speed.css({ 'width': speed_pct });
        if (speed >= 1) {
            $speed.removeClass('with-indicator');
        } else {
            $speed.addClass('with-indicator');
        }
        const $progressor = $('#speed').parents('.progressor');
        $progressor.attr('title', `Mining speed: ${speed_pct}`);
        Tooltip.getInstance($progressor[0])?.dispose();
        Tooltip.getOrCreateInstance($progressor[0]);
    });
});
$(window).on('load', function tooltips() {
    if (document.body.clientWidth <= 576) {
        const $inc = $('#increase');
        Tooltip.getInstance($inc[0])?.disable();
        const $dec = $('#decrease');
        Tooltip.getInstance($dec[0])?.disable();
    }
});
$('#increase').on('click', async function increase() {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const miner = App.miner(address, {
        token: App.token
    });
    miner.increase();
});
$('.progressor')[0].addEventListener(
    'wheel', function increaseByWheel(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        if (ev.deltaY < 0) {
            const $increase = $('#increase');
            const disabled = $increase.prop('disabled');
            if (!disabled) $increase.trigger('click');
        }
        return false;
    }, {
        passive: false
    }
);
$('#decrease').on('click', async function decrease() {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const miner = App.miner(address, {
        token: App.token
    });
    miner.decrease();
});
$('.progressor')[0].addEventListener(
    'wheel', function decreaseByWheel(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        if (ev.deltaY > 0) {
            const $increase = $('#decrease');
            const disabled = $increase.prop('disabled');
            if (!disabled) $increase.trigger('click');
        }
        return false;
    }, {
        passive: false
    }
);
Blockchain.onceConnect(function speedHandlers({
    address, token
}) {
    const miner = App.miner(address, {
        token
    });
    const $tog = $('#toggle-mining');
    const $inc = $('#increase');
    const $dec = $('#decrease');
    miner.on('increased', () => {
        Tooltip.getInstance($inc[0])?.hide();
        Tooltip.getInstance($dec[0])?.hide();
    });
    miner.on('decreased', () => {
        Tooltip.getInstance($inc[0])?.hide();
        Tooltip.getInstance($dec[0])?.hide();
    });
    miner.on('increased', (ev) => {
        const speed = ev.speed as number;
        $inc.prop('disabled', speed > 0.999);
        $dec.prop('disabled', speed < 0.001);
    });
    miner.on('decreased', (ev) => {
        const speed = ev.speed as number;
        $inc.prop('disabled', speed > 0.999);
        $dec.prop('disabled', speed < 0.001);
    });
    miner.on('increased', (ev) => {
        const speed = ev.speed as number;
        $tog.prop('disabled', speed < 0.001);
    });
    miner.on('decreased', (ev) => {
        const speed = ev.speed as number;
        $tog.prop('disabled', speed < 0.001);
    });
    miner.on('starting', () => {
        $inc.prop('disabled', true);
        $dec.prop('disabled', true);
    });
    miner.on('stopped', () => {
        $inc.prop('disabled', false);
        $dec.prop('disabled', false);
    });
    miner.on('increased', (ev) => {
        $('#speed').trigger('change', {
            speed: ev.speed as number
        });
    });
    miner.on('decreased', (ev) => {
        $('#speed').trigger('change', {
            speed: ev.speed as number
        });
    });
}, {
    per: () => App.token
});
