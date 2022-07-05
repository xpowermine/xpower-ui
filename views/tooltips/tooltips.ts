import { App } from '../../source/app';
import { ancestors, delayed } from '../../source/functions';
export const { Tooltip } = global.bootstrap;

App.onTokenSwitched(function retitleTips(
    token, old_token
) {
    const $tips = document.querySelectorAll<HTMLElement>(
        '[data-bs-toggle=tooltip]:not([data-bs-fixed])'
    );
    const rx = new RegExp(old_token, 'g');
    $tips.forEach(($tip) => {
        const title = $tip.getAttribute(
            'data-bs-original-title'
        );
        if (title?.match(rx)) {
            $tip.setAttribute('title', title.replace(rx, token));
            Tooltip.getInstance($tip)?.dispose();
            Tooltip.getOrCreateInstance($tip);
        }
    })
});
global.addEventListener('load', delayed(function tooltips() {
    const $tips = document.querySelectorAll<HTMLElement>(
        '[data-bs-toggle=tooltip]'
    );
    $tips.forEach(($tip) => {
        Tooltip.getOrCreateInstance($tip);
    });
    $tips.forEach(($tip) => {
        $tip.addEventListener('shown.bs.tooltip', ({
            target
        }) => {
            target?.removeEventListener('click', show);
            target?.addEventListener('click', hide, {
                once: true
            });
        });
        $tip.addEventListener('hidden.bs.tooltip', ({
            target
        }) => {
            target?.removeEventListener('click', hide);
            target?.addEventListener('click', show, {
                once: true
            });
        });
    })
}), {
    once: true
});
function show(e: Event) {
    const $tip = $tooltip(e.target as HTMLElement | null);
    Tooltip.getInstance($tip)?.show();
}
function hide(e: Event) {
    const $tip = $tooltip(e.target as HTMLElement | null);
    Tooltip.getInstance($tip)?.hide();
}
function $tooltip($target: HTMLElement | null) {
    const [$tip] = ancestors($target, ($el) => {
        const a = $el.getAttribute('data-bs-toggle');
        return a === 'tooltip';
    });
    return $tip ?? $target;
}
export default Tooltip;
