import { App } from '../../source/app';

App.onTokenSwitch(function syncLocation(token) {
    const search = location.search
        .replace(/^$/, `?token=${token}`)
        .replace(/token=([A-Z]+)/, `token=${token}`);
    const [data, title, url] = [
        { page: 1 }, document.title, `${location.pathname}${search}`
    ];
    history.pushState(data, title, url);
});
