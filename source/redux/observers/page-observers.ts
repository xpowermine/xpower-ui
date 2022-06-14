import { Store, Unsubscribe } from 'redux';
import { observe } from './observe';

import { State, Page } from '../types';
import { Action } from '../actions';
import { App } from '../../app';

export type OnPageSwitch = (
    next: Page, prev: Page
) => void;

export function onPageSwitch(
    store: Store<State, Action>, handler: OnPageSwitch
): Unsubscribe {
    const selector = (state: State) => state.page;
    const observer = observe<Page>(store)(
        selector, App.page
    );
    return observer(handler);
}
