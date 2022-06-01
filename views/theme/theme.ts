import { Theme, theme } from '../../source/theme';
import { App } from '../../source/app/app';
export { theme };

document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
        adapt(theme(App.token));
    }
};
export function adapt(theme: Theme): void {
    const root = document.querySelector(':root') as HTMLElement;
    if (root) {
        root.style.setProperty('--xp-powered', `var(
            ${theme.XP_POWERED}
        )`);
        root.style.setProperty('--xp-powered-dark', `var(
            ${theme.XP_POWERED_DARK}
        )`);
    }
}
export default adapt;
