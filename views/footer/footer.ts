import { App } from '../../source/app/app';
import { Blockchain } from '../../source/blockchain';
import { ChainId } from '../../source/blockchain';
import { Tokenizer } from '../../source/token';

$(window).on('load', function setContractAddress() {
    const version = App.version;
    const symbol = Tokenizer.symbolAlt(App.token);
    const address = $(`#g-${symbol}_MOE_${version}`).data('value');
    const $link = $('a.smart-contract');
    $link.attr('href', `https://snowtrace.io/address/${address}`);
});
$('a.add-token').on('click', async function addToken() {
    if (Blockchain.isInstalled()) {
        if (await Blockchain.isAvalanche()) {
            const version = App.version;
            const alt = Tokenizer.symbolAlt(App.token);
            const address = $(`#g-${alt}_MOE_${version}`).data('value');
            const symbol = $(`#g-${alt}_SYMBOL_${version}`).data('value');
            const decimals = $(`#g-${alt}_DECIMALS_${version}`).data('value');
            const image = $(`#g-${alt}_IMAGE_${version}`).data('value');
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
