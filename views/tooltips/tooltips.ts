import { Token } from "../../source/redux/types";
export const { Tooltip } = global.bootstrap;

$('#selector').on('switch', async function retitleTips(ev, {
    token, old_token
}: {
    token: Token, old_token: Token
}) {
    function title(rx: RegExp, el: HTMLElement) {
        const value = $(el).attr('data-bs-original-title');
        if (value?.match(rx)) {
            $(el).attr('title', value.replace(rx, token));
            Tooltip.getInstance(el)?.dispose();
            Tooltip.getOrCreateInstance(el);
        }
    }
    const $tips = $('[data-bs-toggle=tooltip]:not([data-bs-fixed])');
    const rx = new RegExp(old_token, 'g');
    $tips.each((_, el) => title(rx, el));
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
