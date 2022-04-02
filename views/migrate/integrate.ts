import './integrate.scss';

import { Blockchain } from '../../source/blockchain';
import { ChainId } from '../../source/blockchain';
import { Token } from '../../source/redux/types';
import { Tokenizer } from '../../source/token';

$('button.add-xpow.para').on('click', async () => {
    if (Blockchain.isInstalled()) {
        if (await Blockchain.isAvalanche()) {
            const token = Tokenizer.symbolAlt(Token.PARA);
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
$('button.add-xpow.aqch').on('click', async () => {
    if (Blockchain.isInstalled()) {
        if (await Blockchain.isAvalanche()) {
            const token = Tokenizer.symbolAlt(Token.AQCH);
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
$('button.add-xpow.qrsh').on('click', async () => {
    if (Blockchain.isInstalled()) {
        if (await Blockchain.isAvalanche()) {
            const token = Tokenizer.symbolAlt(Token.QRSH);
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
