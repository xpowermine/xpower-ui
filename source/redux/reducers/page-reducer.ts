import { Action } from '../actions/page-actions';
import { Page } from '../types';
import { App } from '../../app';

export function pageReducer(
    page: Page = App.page, action: Action
): Page {
    if (!action.type.startsWith('page/switch')) {
        return page;
    }
    return action.payload.page;
}
export default pageReducer;
