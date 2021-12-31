/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Global } from '../../source/types';
declare const global: Global;

import { App } from '../../source/app';
import { Blockchain } from '../../source/blockchain';
import { ChainId } from '../../source/blockchain';
import { delayed } from '../../source/functions';
const { Tooltip } = global.bootstrap as any;

$(window).on('load', delayed(async function check() {
    const $connect = $('#connect-metamask');
    if (Blockchain.isInstalled()) {
        if (Blockchain.isConnected()) {
            if (await Blockchain.isAvalanche()) {
                $connect.trigger('connecting');
                try {
                    const address = await Blockchain.connect();
                    $connect.trigger('connected', { address });
                } catch (ex) {
                    $connect.trigger('error', {
                        error: ex
                    });
                }
            } else {
                $connect.text('Switch to Avalanche');
                $connect.prop('disabled', false);
            }
        } else {
            $connect.text('Connect to Metamask');
            $connect.prop('disabled', false);
        }
    } else {
        $connect.text('Install Metamask');
        $connect.prop('disabled', false);
    }
    if (Blockchain.isInstalled() === false) {
        const $info = $connect.siblings('.info');
        $info.attr('title', 'Install Metamask (and reload)');
        Tooltip.getInstance($info).dispose();
        Tooltip.getOrCreateInstance($info);
    }
}, 600));
$('#connect-metamask').on('click', async function connect() {
    const $connect = $('#connect-metamask');
    if (Blockchain.isInstalled()) {
        if (await Blockchain.isAvalanche()) {
            $connect.trigger('connecting');
            try {
                const address = await Blockchain.connect();
                $connect.trigger('connected', {
                    ok: true, address
                });
            } catch (ex) {
                $connect.trigger('connected', {
                    ok: false, error: ex
                });
            }
        } else {
            await Blockchain.switchTo(
                ChainId.AVALANCHE_MAINNET
            );
            location.reload();
        }
    } else {
        open('https://metamask.io/download.html');
    }
});
$(window).on('load', function refresh() {
    const $connect = $('#connect-metamask');
    $connect.on('connected', () => {
        App.refresh();
    });
});
$(window).on('load', function error() {
    const $connect = $('#connect-metamask');
    $connect.on('error', (ev, { error }) => {
        console.error(error);
    });
});
$(window).on('load', function toggleConnectState() {
    const $connect = $('#connect-metamask');
    $connect.on('connecting', () => {
        $connect.prop('disabled', true);
    });
    $connect.on('connected', () => {
        $connect.prop('disabled', false);
    });
    $connect.on('error', () => {
        $connect.prop('disabled', false);
    });
});
$(window).on('load', function toggleConnectText() {
    const $connect = $('#connect-metamask');
    const $text = $connect.find('.text');
    $connect.on('connecting', () => {
        $text.text('Connecting to Metamask…');
    });
    $connect.on('connected', () => {
        $text.text('Connected to Metamask');
    });
    $connect.on('error', () => {
        $text.text('Connect to Metamask');
    });
});
$(window).on('load', function toggleConnectSpinner() {
    const $connect = $('#connect-metamask');
    const $spinner = $connect.find('.spinner');
    $connect.on('connecting', () => {
        $spinner.css('visibility', 'visible');
        $spinner.addClass('spinner-grow');
    });
    $connect.on('connected', () => {
        $spinner.css('visibility', 'hidden');
        $spinner.removeClass('spinner-grow');
    });
    $connect.on('error', () => {
        $spinner.css('visibility', 'hidden');
        $spinner.removeClass('spinner-grow');
    });
});
