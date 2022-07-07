import { App } from '../../source/app';
import { Blockchain } from '../../source/blockchain';
import { delayed } from '../../source/functions';

Blockchain.onceConnect(delayed(async function reloadLocation() {
    const p = await Blockchain.provider;
    p.on('chainChanged', () => location.reload());
    p.on('accountsChanged', () => location.reload());
}, 600));
App.onTokenSwitch(function syncLocation(token) {
    const search = location.search
        .replace(/^$/, `?token=${token}`)
        .replace(/token=([A-Z]+)/, `token=${token}`);
    const [data, title, url] = [
        { page: 1 }, document.title, `${location.pathname}${search}`
    ];
    history.pushState(data, title, url);
});
