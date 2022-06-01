import { App } from '../../source/app/app';
import { Blockchain } from '../../source/blockchain';
import { ChainId } from '../../source/blockchain';
import { Tokenizer } from '../../source/token';

$(window).on('load', function setContractAddress() {
    const [token, version] = [App.token, App.version];
    const address = $(`#g-${token}_MOE_${version}`).data('value');
    const $link = $('a.smart-contract');
    $link.attr('href', `https://snowtrace.io/address/${address}`);
});
$('a.add-token').on('click', async function addToken() {
    if (await Blockchain.isInstalled()) {
        if (await Blockchain.isAvalanche()) {
            const [token, version] = [App.token, App.version];
            const address = $(`#g-${token}_MOE_${version}`).data('value');
            const symbol = $(`#g-${token}_SYMBOL_${version}`).data('value');
            const decimals = $(`#g-${token}_DECIMALS_${version}`).data('value');
            const image = $(`#g-${token}_IMAGE_${version}`).data('value');
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
