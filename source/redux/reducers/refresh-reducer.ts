/* eslint @typescript-eslint/no-unused-vars: [off] */
import { Action } from '../actions/refresh-actions';
import { Refresh } from '../types';

export function refreshReducer(
    refresh: Refresh = { date: null }, action: Action
): Refresh {
    if (!action.type.startsWith('refresh/by-date')) {
        return refresh;
    }
    return { date: action.payload.date };
}
export default refreshReducer;
