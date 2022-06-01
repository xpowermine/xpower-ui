/* eslint @typescript-eslint/no-explicit-any: [off] */
/* eslint @typescript-eslint/ban-types: [off] */
import { Global } from '../../source/types';
declare const global: Global;
import './about.scss';

import { Tokenizer } from '../../source/token';
import { capitalize } from '../../routes/functions';

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
        const token = Tokenizer.token(params.get('token'));
        const token_lc = Tokenizer.lower(token);
        return content
            .replace(/{{TOKEN}}/g, token)
            .replace(/{{token}}/g, token_lc)
            .replace(/{{Token}}/g, capitalize(token_lc));
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
