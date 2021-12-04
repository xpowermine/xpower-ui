/* eslint @typescript-eslint/no-explicit-any: [off] */
/* eslint @typescript-eslint/ban-types: [off] */
import { Global } from '../../source/types';
declare const global: Global;
import './about.scss';

import { Token } from '../../source/token';

const markdownit = global.markdownit as (options: any) => {
    use: (plugin: any, options?: any) => void,
    render: (markdown: string) => string
};
const anchor = global.markdownItAnchor as {
    permalink: {
        linkInsideHeader: Function
    }
};
$(window).on('load', async function renderMarkdown() {
    const mdi = markdownit({
        html: true, linkify: true, typographer: true
    });
    mdi.use(anchor, {
        permalink: anchor.permalink.linkInsideHeader({
            symbol: '¶', ariaHidden: true
        }),
        level: 2
    });
    const about_url = $('#g-urls-about').data('value');
    const fetched = await fetch(about_url);
    const content = await fetched.text();
    const html = mdi.render(
        add_token(fix_katex(content))
    );
    function fix_katex(content: string) {
        return content
            .replace(/\\%/g, '\\\\%')
            .replace(/\\#/g, '\\\\#');
    }
    function add_token(content: string) {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const symbol = Token.symbol(token);
        const suffix = Token.suffix(token);
        return content
            .replace(/{{TOKEN}}/g, symbol.toUpperCase())
            .replace(/{{TOKEN_SUFFIX}}/g, suffix.toUpperCase())
            .replace(/{{token}}/g, symbol.toLowerCase())
            .replace(/{{token_suffix}}/g, suffix.toLowerCase());
    }
    $('content').html(html).trigger('ready');
});
$('content').on('ready', function scrollToAnchor() {
    const anchor = location.hash;
    if (anchor) {
        location.hash = '';
        location.hash = anchor;
    }
});
$('content').on('ready', function renderKatex(ev) {
    global.renderMathInElement(ev.target, {
        delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true }
        ],
        throwOnError: false
    });
});
