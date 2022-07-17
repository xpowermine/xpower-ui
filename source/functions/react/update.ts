import { Component } from 'react';
import { DeepPartial } from 'redux';

export function update<S>(
    this: Component,
    next_state: DeepPartial<S>,
    callback?: () => void
) {
    return new Promise<void>(
        (resolve) => this.setState(
            $.extend(true, {}, this.state, next_state), () => {
                if (typeof callback === 'function') {
                    callback();
                }
                resolve();
            }
        )
    );
}
export default update;
