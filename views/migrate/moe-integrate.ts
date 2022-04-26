import './moe-integrate.scss';

import { Blockchain } from '../../source/blockchain';
import { ChainId } from '../../source/blockchain';
import { Token } from '../../source/redux/types';
import { Tokenizer } from '../../source/token';

$('button.add-xpow.thor').on('click', async (ev) => {
    const tgt_version = $(ev.target).data('target');
    if (await Blockchain.isInstalled()) {
        if (await Blockchain.isAvalanche()) {
            const token = Tokenizer.symbolAlt(Token.THOR);
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
});
$('button.add-xpow.loki').on('click', async (ev) => {
    const tgt_version = $(ev.target).data('target');
    if (await Blockchain.isInstalled()) {
        if (await Blockchain.isAvalanche()) {
            const token = Tokenizer.symbolAlt(Token.LOKI);
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
});
$('button.add-xpow.odin').on('click', async (ev) => {
    const tgt_version = $(ev.target).data('target');
    if (await Blockchain.isInstalled()) {
        if (await Blockchain.isAvalanche()) {
            const token = Tokenizer.symbolAlt(Token.ODIN);
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
});
