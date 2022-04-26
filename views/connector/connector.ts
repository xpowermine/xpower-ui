/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Global } from '../../source/types';
declare const global: Global;

import { App } from '../../source/app';
import { Blockchain } from '../../source/blockchain';
import { ChainId } from '../../source/blockchain';
import { delayed } from '../../source/functions';

const { Tooltip } = global.bootstrap as any;

$(window).on('load', delayed(async function connect() {
    const $connect = $('#connect-metamask');
    if (await Blockchain.isInstalled()) {
        if (await Blockchain.isConnected()) {
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
    if (await Blockchain.isInstalled() === false) {
        const $info = $connect.siblings('.info');
        $info.attr('title', 'Install Metamask (and reload)');
        Tooltip.getInstance($info).dispose();
        Tooltip.getOrCreateInstance($info);
    }
}, ms()));
function ms(fallback?: number) {
    if (typeof fallback === 'undefined') {
        if (navigator.userAgent.match(/mobi/i)) {
            fallback = 600;
        } else {
            fallback = 200;
        }
    }
    const ms = Number(
        App.params.get('ms') ?? fallback
    );
    return !isNaN(ms) ? ms : fallback;
}
$('#connect-metamask').on('click', async function reconnect() {
    if (await Blockchain.isInstalled()) {
        if (await Blockchain.isConnected()) {
            if (await Blockchain.isAvalanche()) {
                // pass
            } else {
                await Blockchain.switchTo(
                    ChainId.AVALANCHE_MAINNET
                );
                location.reload();
            }
        } else {
            reload(600);
        }
    } else {
        open('https://metamask.io/download.html');
    }
});
function reload(delta_ms: number) {
    if (location.search) {
        const match = location.search.match(/ms=([0-9]+)/);
        if (match && match.length > 1) {
            location.search = location.search.replace(
                /ms=([0-9]+)/, `ms=${delta_ms + Number(match[1])}`
            );
        } else {
            location.search += `&ms=${delta_ms}`;
        }
    } else {
        location.search = `?ms=${delta_ms}`;
    }
}
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
