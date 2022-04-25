import './integrate.scss';

import { Blockchain } from '../../source/blockchain';
import { ChainId } from '../../source/blockchain';
import { Token } from '../../source/redux/types';
import { Tokenizer } from '../../source/token';

$('button.add-xpow.thor').on('click', async () => {
    if (Blockchain.isInstalled()) {
        if (await Blockchain.isAvalanche()) {
            const token = Tokenizer.symbolAlt(Token.THOR);
            const address = $(`#g-${token}_MOE_v4a`).data('value');
            const symbol = $(`#g-${token}_SYMBOL_v4a`).data('value');
            const decimals = $(`#g-${token}_DECIMALS_v4a`).data('value');
            const image = $(`#g-${token}_IMAGE_v4a`).data('value');
            await Blockchain.addToken({
                address, symbol, decimals, image
            });
        } else {
            Blockchain.switchTo(ChainId.AVALANCHE_MAINNET);
        }
    } else {
        open('https://metamask.io/download.html');
    }
});
$('button.add-xpow.loki').on('click', async () => {
    if (Blockchain.isInstalled()) {
        if (await Blockchain.isAvalanche()) {
            const token = Tokenizer.symbolAlt(Token.LOKI);
            const address = $(`#g-${token}_MOE_v4a`).data('value');
            const symbol = $(`#g-${token}_SYMBOL_v4a`).data('value');
            const decimals = $(`#g-${token}_DECIMALS_v4a`).data('value');
            const image = $(`#g-${token}_IMAGE_v4a`).data('value');
            await Blockchain.addToken({
                address, symbol, decimals, image
            });
        } else {
            Blockchain.switchTo(ChainId.AVALANCHE_MAINNET);
        }
    } else {
        open('https://metamask.io/download.html');
    }
});
$('button.add-xpow.odin').on('click', async () => {
    if (Blockchain.isInstalled()) {
        if (await Blockchain.isAvalanche()) {
            const token = Tokenizer.symbolAlt(Token.ODIN);
            const address = $(`#g-${token}_MOE_v4a`).data('value');
            const symbol = $(`#g-${token}_SYMBOL_v4a`).data('value');
            const decimals = $(`#g-${token}_DECIMALS_v4a`).data('value');
            const image = $(`#g-${token}_IMAGE_v4a`).data('value');
            await Blockchain.addToken({
                address, symbol, decimals, image
            });
        } else {
            Blockchain.switchTo(ChainId.AVALANCHE_MAINNET);
        }
    } else {
        open('https://metamask.io/download.html');
    }
});
