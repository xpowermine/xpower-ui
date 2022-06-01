import './selector.scss'

import { Tokenizer } from '../../source/token';
import { App } from '../../source/app';

$(window).on('load', async function activateSelector() {
    const token_lc = Tokenizer.lower(App.token);
    $(`.selector-${token_lc}`).addClass('active');
});
