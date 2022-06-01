import './moe-integrate.scss';

import { Blockchain } from '../../source/blockchain';
import { ChainId } from '../../source/blockchain';
import { Token } from '../../source/redux/types';

$('button.add-xpow.thor').on('click', (ev) => addToken(ev, {
    token: Token.THOR
}));
$('button.add-xpow.loki').on('click', (ev) => addToken(ev, {
    token: Token.LOKI
}));
$('button.add-xpow.odin').on('click', (ev) => addToken(ev, {
    token: Token.ODIN
}));
async function addToken(
    ev: JQuery.TriggeredEvent, { token }: { token: Token }
) {
    const tgt_version = $(ev.target).data('target');
    if (await Blockchain.isInstalled()) {
        if (await Blockchain.isAvalanche()) {
            const address = $(
                `#g-${token}_MOE_${tgt_version}`).data('value');
            const symbol = $(
                `#g-${token}_SYMBOL_${tgt_version}`).data('value');
            const decimals = $(
                `#g-${token}_DECIMALS_${tgt_version}`).data('value');
            const image = $(
                `#g-${token}_IMAGE_${tgt_version}`).data('value');
            await Blockchain.addToken({
                address, symbol, decimals, image
            });
        } else {
            Blockchain.switchTo(ChainId.AVALANCHE_MAINNET);
        }
    } else {
        open('https://metamask.io/download.html');
    }
}
