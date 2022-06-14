import { Token } from '../types';

export type SwitchToken = {
    type: 'token/switch', payload: {
        token: Token
    }
};
export const switchToken = (
    token: Token
): SwitchToken => ({
    type: 'token/switch', payload: {
        token
    }
});
export type Action = SwitchToken;
