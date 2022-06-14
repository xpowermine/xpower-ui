import { App } from "../../source/app";
export const { Tooltip } = global.bootstrap;

App.onTokenSwitched(function retitleTips(
    token, old_token
) {
    function retitle(el: HTMLElement, rx: RegExp) {
        const value = $(el).attr('data-bs-original-title');
        if (value?.match(rx)) {
            $(el).attr('title', value.replace(rx, token));
            Tooltip.getInstance(el)?.dispose();
            Tooltip.getOrCreateInstance(el);
        }
    }
    const $tips = $('[data-bs-toggle=tooltip]:not([data-bs-fixed])');
    const rx = new RegExp(old_token, 'g');
    $tips.each((_, el) => retitle(el, rx));
});
$(window).one('load', function toggleTooltips() {
    const $tips = $('[data-bs-toggle=tooltip]');
    $tips.map((_, el) => Tooltip.getOrCreateInstance(el));
    $tips.on('shown.bs.tooltip', (ev) => {
        $(ev.target).one('click', hide).off('click', show);
    });
    $tips.on('hidden.bs.tooltip', (ev) => {
        $(ev.target).off('click', hide).one('click', show);
    });
});
function hide(ev: JQuery.ClickEvent) {
    const [tip] = $tip($(ev.target));
    Tooltip.getInstance(tip)?.hide();
}
function show(ev: JQuery.ClickEvent) {
    const [tip] = $tip($(ev.target));
    Tooltip.getInstance(tip)?.show();
}
function $tip($el: JQuery<HTMLElement>) {
    const $tt = $el.parents(`[data-bs-toggle=tooltip]`);
    return $tt.length ? $tt : $el;
}
export default Tooltip;
