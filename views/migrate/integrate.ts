import './integrate.scss';

import { Blockchain } from '../../source/blockchain';
import { ChainId } from '../../source/blockchain';
import { Token } from '../../source/redux/types';
import { Tokenizer } from '../../source/token';

$('button.add-xpow.para').on('click', async () => {
    if (Blockchain.isInstalled()) {
        if (await Blockchain.isAvalanche()) {
            const token = Tokenizer.symbolAlt(Token.PARA);
            const address = $(`#g-xpower-address-${token}-v3b`).data('value');
            const symbol = $(`#g-xpower-symbol-${token}-v3b`).data('value');
            const decimals = $(`#g-xpower-decimals-${token}-v3b`).data('value');
            const image = $(`#g-xpower-image-${token}-v3b`).data('value');
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
            const address = $(`#g-xpower-address-${token}-v3b`).data('value');
            const symbol = $(`#g-xpower-symbol-${token}-v3b`).data('value');
            const decimals = $(`#g-xpower-decimals-${token}-v3b`).data('value');
            const image = $(`#g-xpower-image-${token}-v3b`).data('value');
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
            const address = $(`#g-xpower-address-${token}-v3b`).data('value');
            const symbol = $(`#g-xpower-symbol-${token}-v3b`).data('value');
            const decimals = $(`#g-xpower-decimals-${token}-v3b`).data('value');
            const image = $(`#g-xpower-image-${token}-v3b`).data('value');
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
