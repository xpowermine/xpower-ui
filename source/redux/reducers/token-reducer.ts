import { Action } from '../actions/token-actions';
import { Token } from '../types';
import { App } from '../../app';

export function tokenReducer(
    token: Token = App.token, action: Action
): Token {
    if (!action.type.startsWith('token/switch')) {
        return token;
    }
    return action.payload.token;
}
export default tokenReducer;
