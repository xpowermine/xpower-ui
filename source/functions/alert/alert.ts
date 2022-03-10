export enum Alert {
    primary = 'primary',
    secondary = 'secondary',
    success = 'success',
    danger = 'danger',
    warning = 'warning',
    info = 'info',
    light = 'light',
    dark = 'dark'
}
export function alert(
    message: string, type = Alert.primary, options?: {
        id?: string, icon?: string
    }
): HTMLElement {
    if (options === undefined) {
        options = { id: '', icon: '' };
    }
    if (options.id === undefined) {
        options.id = '';
    }
    if (options.icon === undefined) {
        options.icon = '';
    }
    $(`.alert[data-id=${options.id||'""'}]`).remove();
    if (!options.icon) {
        switch (type) {
            case Alert.primary:
                options.icon = 'info-circle-fill';
                break;
            case Alert.secondary:
                options.icon = 'info-circle-fill';
                break;
            case Alert.success:
                options.icon = 'check-circle-fill';
                break;
            case Alert.danger:
                options.icon = 'exclamation-triangle-fill';
                break;
            case Alert.warning:
                options.icon = 'exclamation-triangle-fill';
                break;
            case Alert.info:
                options.icon = 'info-circle-fill';
                break;
            case Alert.light:
                options.icon = 'info-circle-fill';
                break;
            case Alert.dark:
                options.icon = 'info-circle-fill';
                break;
            default:
                options.icon = 'info-circle-fill';
        }
    }
    const el = document.createElement('div');
    el.innerHTML = `<div data-id="${options.id}" class="alert alert-${type} alert-dismissible d-flex align-items-center" role="alert" style="margin: 0 0 0.5em 0"><i class="bi bi-${options.icon} flex-shrink-0 me-3"></i>${message}<button type="button" class="btn-sm btn-close" data-bs-dismiss="alert"></button></div>`;
    return el;
}
export default alert;
