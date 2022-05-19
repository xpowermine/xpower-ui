/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Global } from '../../../source/types';
declare const global: Global;

import { App } from '../../../source/app';
import { Blockchain } from '../../../source/blockchain';
import { Connect } from '../../../source/blockchain';

const { Tooltip } = global.bootstrap as any;

$(window).on('load', function init() {
    $('#speed').on('change', (ev, { speed }) => {
        const speed_pct = `${(speed * 100).toFixed(3)}%`;
        $('#speed').css({ 'width': speed_pct });
        if (speed >= 1) {
            $('#speed').removeClass('with-indicator');
        } else {
            $('#speed').addClass('with-indicator');
        }
        const $progressor = $('#speed').parents('.progressor');
        $progressor.attr('title', `Mining speed: ${speed_pct}`);
        Tooltip.getInstance($progressor).dispose();
        Tooltip.getOrCreateInstance($progressor);
    });
    $('#speed').trigger('change', {
        speed: App.speed
    });
    const $inc = $('#increase');
    $inc.prop('disabled', App.speed > 0.999);
    const $dec = $('#decrease');
    $dec.prop('disabled', App.speed < 0.001);
});
$(window).on('load', function tooltips() {
    if (document.body.clientWidth <= 576) {
        const $inc = $('#increase');
        Tooltip.getInstance($inc)?.disable();
        const $dec = $('#decrease');
        Tooltip.getInstance($dec)?.disable();
    }
});
$('#increase').on('click', async function increase() {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    App.miner(address).increase();
});
$('#decrease').on('click', async function decrease() {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    App.miner(address).decrease();
});
$('#connect-metamask').on('connected', function handlers(
    ev, { address }: Connect
) {
    const miner = App.miner(address);
    const $inc = $('#increase');
    const $dec = $('#decrease');
    miner.on('accelerated', () => {
        Tooltip.getInstance($inc)?.hide();
        Tooltip.getInstance($dec)?.hide();
    });
    miner.on('decelerated', () => {
        Tooltip.getInstance($inc)?.hide();
        Tooltip.getInstance($dec)?.hide();
    });
    miner.on('accelerated', (ev) => {
        const speed = ev.speed as number;
        $inc.prop('disabled', speed > 0.999);
        $dec.prop('disabled', speed < 0.001);
    });
    miner.on('decelerated', (ev) => {
        const speed = ev.speed as number;
        $inc.prop('disabled', speed > 0.999);
        $dec.prop('disabled', speed < 0.001);
    });
    miner.on('starting', () => {
        $inc.prop('disabled', true);
        $dec.prop('disabled', true);
    });
    miner.on('stopped', () => {
        $inc.prop('disabled', false);
        $dec.prop('disabled', false);
    });
    miner.on('accelerated', (ev) => {
        $('#speed').trigger('change', {
            speed: ev.speed as number
        });
    });
    miner.on('decelerated', (ev) => {
        $('#speed').trigger('change', {
            speed: ev.speed as number
        });
    });
});
