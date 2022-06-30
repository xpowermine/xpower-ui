import React from 'react';
import { createRoot } from 'react-dom/client';

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
export class Alerts {
    static show(
        message: string, type = Alert.primary, options?: {
            id?: string, icon?: string, style?: Record<string, string>
        }
    ) {
        if (options === undefined) {
            options = { id: '', icon: '' };
        }
        if (options.id === undefined) {
            options.id = '';
        }
        if (options.icon === undefined) {
            options.icon = '';
        }
        if (options.style === undefined) {
            options.style = { margin: '0 0 0.5em 0' };
        }
        if (options.id) {
            const $alerts = document.querySelectorAll(
                `.alert[data-id='${options.id || ''}']`
            );
            for (const $alert of $alerts) {
                $alert.remove();
            }
        } else {
            const $alerts = document.querySelectorAll(
                `.alert`
            );
            for (const $alert of $alerts) {
                $alert.remove();
            }
        }
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
        return <div
            className={`alert alert-${type} alert-dismissible align-items-center d-flex`}
            data-id={`'${options.id}'`} role='alert' style={options.style}
        >
            <i className={`bi bi-${options.icon} flex-shrink-0 me-3`} />{
                message
            }
            <button className='btn-sm btn-close' data-bs-dismiss='alert'
                type='button'
            />
        </div>;
    }
    static hide(options?: {
        id?: string
    }) {
        if (options === undefined) {
            options = { id: '' };
        }
        if (options.id === undefined) {
            options.id = '';
        }
        if (options.id) {
            const $alerts = document.querySelectorAll(
                `.alert[data-id='${options.id}']`
            );
            for (const $alert of $alerts) {
                $alert.remove();
            }
        } else {
            const $alerts = document.querySelectorAll(
                `.alert`
            );
            for (const $alert of $alerts) {
                $alert.remove();
            }
        }
    }
}
export function alert(
    message: string, type = Alert.primary, options?: {
        style?: Record<string, string>,
        icon?: string, id?: string,
        after?: HTMLElement | null
    }
): HTMLElement {
    const $inner = Alerts.show(message, type, options);
    const $outer = document.createElement('div');
    createRoot($outer).render($inner);
    if (options) {
        if (options.after) {
            options.after.parentNode?.insertBefore(
                $outer, options.after.nextSibling
            );
        }
    }
    return $outer;
}
export default alert;
