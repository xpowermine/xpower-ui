import { App } from '../../source/app/app';
import { Blockchain } from '../../source/blockchain';
import { ChainId } from '../../source/blockchain';
import { Token } from '../../source/redux/types';
import { Version } from '../../source/types';

$('#selector').on('switch', async function setFooterLinks(ev, {
    token, old_token
}: {
    token: Token, old_token: Token
}) {
    function href(rx: RegExp, el: HTMLElement) {
        const value = $(el).attr('href');
        if (value?.match(rx)) {
            $(el).attr('href', value.replace(rx, token));
        }
    }
    const $footer = $('footer');
    const rx = new RegExp(old_token, 'g');
    const $links = $footer.find('a');
    $links.each((_, el) => href(rx, el));
});
$(window).on('load', function initContractAddress() {
    setContractAddress(App.token, App.version);
});
$('#selector').on('switch', function syncContractAddress() {
    setContractAddress(App.token, App.version);
});
function setContractAddress(
    token: Token, version: Version
) {
    const address = $(`#g-${token}_MOE_${version}`).data('value');
    const $link = $('a.smart-contract');
    $link.attr('href', `https://snowtrace.io/address/${address}`);
}
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
