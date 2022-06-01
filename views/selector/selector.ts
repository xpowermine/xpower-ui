import './selector.scss'

import { App } from '../../source/app';
import { Token } from '../../source/redux/types';
import { Tokenizer } from '../../source/token';

import { adapt } from '../theme/theme';
import { theme } from '../theme/theme';

$(window).on('load', async function activateSelector() {
    const token_lc = Tokenizer.lower(App.token);
    $(`.selector-${token_lc}`).addClass('active');
});
$('a.selector-thor').on('click', () => switchTo(Token.THOR, App.token));
$('a.selector-loki').on('click', () => switchTo(Token.LOKI, App.token));
$('a.selector-odin').on('click', () => switchTo(Token.ODIN, App.token));
function switchTo(
    token: Token, old_token: Token
) {
    if (token === old_token) {
        return false;
    }
    const search = location.search
        .replace(/^$/, `?token=${token}`)
        .replace(/token=([A-Z]+)/, `token=${token}`);
    history.pushState(
        { page: 1 }, document.title, `${location.pathname}${search}`
    );
    const $selector = $('#selector');
    $selector.trigger('switch', {
        token, old_token
    });
    $selector.delay('slow').queue(() => {
        $selector.trigger('switched', { token, old_token });
        $selector.dequeue();
    });
    return false;
}
$(window).on('load', function syncTheme() {
    const $selector = $('#selector');
    $selector.on('switch', (ev, {
        token
    }) => {
        adapt(theme(token));
    });
});
$(window).on('load', function toggleSelectors() {
    const $selector = $('#selector');
    const $selectors = $selector.find('.selectors>a');
    $selector.on('switch', (ev, {
        token
    }) => {
        const token_lc = Tokenizer.lower(token);
        $selectors.find('>img')
            .removeClass('thor loki odin')
            .addClass(token_lc);
    });
    $selector.on('switch', () => {
        $selectors
            .removeClass('active')
            .addClass('pseudo-disabled');
    });
    $selector.on('switched', (ev, {
        token
    }) => {
        const token_lc = Tokenizer.lower(token);
        const $next = $selectors.filter(`.selector-${token_lc}`);
        $next.addClass('active');
        $selectors.removeClass('pseudo-disabled');
    });
});
$(window).on('load', function toggleSelectorSpinner() {
    const $selector = $('#selector');
    const $selectors = $selector.find('.selectors>a');
    $selector.on('switch', (ev, {
        token
    }) => {
        const token_lc = Tokenizer.lower(token);
        const $next = $selectors.filter(`.selector-${token_lc}`);
        $next.find('>img').hide();
        const $spinner = $next.find('.spinner');
        $spinner.show();
    });
    $selector.on('switched', (ev, {
        token
    }) => {
        const token_lc = Tokenizer.lower(token);
        const $next = $selectors.filter(`.selector-${token_lc}`);
        $next.find('>img').show();
        const $spinner = $next.find('.spinner');
        $spinner.hide();
    });
});
