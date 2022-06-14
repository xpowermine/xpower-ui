import './selector.scss'

import { App } from '../../source/app';
import { Token } from '../../source/redux/types';
import { Tokenizer } from '../../source/token';

$(window).on('load', async function activateSelector() {
    const token_lc = Tokenizer.lower(App.token);
    $(`.selector-${token_lc}`).addClass('active');
});
$('a.selector-thor').on('click', function selectThor() {
    App.switchToken(Token.THOR);
    return false;
});
$('a.selector-loki').on('click', function selectLoki() {
    App.switchToken(Token.LOKI);
    return false;
});
$('a.selector-odin').on('click', function selectOdin() {
    App.switchToken(Token.ODIN);
    return false;
});
App.onTokenSwitch(function disableSelector(token) {
    const $selector = $('#selector');
    const token_lc = Tokenizer.lower(token);
    const $selectors = $selector.find('.selectors>a');
    $selectors.find('>img')
        .removeClass('thor loki odin')
        .addClass(token_lc);
    $selectors
        .removeClass('active')
        .addClass('pseudo-disabled');
});
App.onTokenSwitched(function enableSelector(token) {
    const $selector = $('#selector');
    const token_lc = Tokenizer.lower(token);
    const $selectors = $selector.find('.selectors>a');
    const $next = $selectors.filter(`.selector-${token_lc}`);
    $next.addClass('active');
    $selectors.removeClass('pseudo-disabled');
});
App.onTokenSwitch(function showSelectorSpinner(token) {
    const $selector = $('#selector');
    const token_lc = Tokenizer.lower(token);
    const $selectors = $selector.find('.selectors>a');
    const $next = $selectors.filter(`.selector-${token_lc}`);
    $next.find('>img').hide();
    const $spinner = $next.find('.spinner');
    $spinner.show();
});
App.onTokenSwitched(function hideSelectorSpinner(token) {
    const $selector = $('#selector');
    const token_lc = Tokenizer.lower(token);
    const $selectors = $selector.find('.selectors>a');
    const $next = $selectors.filter(`.selector-${token_lc}`);
    $next.find('>img').show();
    const $spinner = $next.find('.spinner');
    $spinner.hide();
});
