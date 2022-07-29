import { delayed } from '../../../source/functions';
import { Tooltip } from '../../tooltips';

import React from 'react';
type Props = {
    toggled: boolean;
    onToggle: (toggled: boolean) => void;
}
export class NftUiToggle extends React.Component<
    Props
> {
    render() {
        const { toggled } = this.props;
        return this.$toggle(toggled);
    }
    $toggle(
        toggled: boolean
    ) {
        return <button type='button'
            className='btn btn-outline-warning toggle-old no-ellipsis'
            data-bs-placement='top' data-bs-toggle='tooltip'
            data-state={toggled ? 'on' : 'off' }
            onClick={this.toggle.bind(this, toggled)}
            title={this.title(toggled)}
        >
            <i className={
                toggled ? 'bi-eye-slash-fill' : 'bi-eye-fill'
            } />
        </button>;
    }
    title(
        toggled: boolean
    ) {
        return toggled
            ? 'Hide older NFTs'
            : 'Show older NFTs';
    }
    toggle(
        toggled: boolean
    ) {
        this.props.onToggle(toggled);
    }
    componentDidUpdate() {
        const $toggles = document.querySelectorAll<HTMLElement>(
            '.toggle-old'
        );
        $toggles.forEach(delayed(($el: HTMLElement) => {
            Tooltip.getInstance($el)?.dispose();
            Tooltip.getOrCreateInstance($el);
        }));
    }
}
export default NftUiToggle;
