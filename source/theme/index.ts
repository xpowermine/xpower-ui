import { Token } from '../redux/types';

export type Theme = {
    XP_POWERED: string,
    XP_POWERED_DARK: string
};
export function theme(token: Token): Theme {
    switch (token) {
        case Token.THOR:
            return {
                XP_POWERED: '--xp-yellow',
                XP_POWERED_DARK: '--xp-yellow-dark'
            };
        case Token.LOKI:
            return {
                XP_POWERED: '--xp-lime',
                XP_POWERED_DARK: '--xp-lime-dark'
            };
        case Token.ODIN:
            return {
                XP_POWERED: '--xp-cyan',
                XP_POWERED_DARK: '--xp-cyan-dark'
            };
        default:
            return {
                XP_POWERED: '--xp-yellow',
                XP_POWERED_DARK: '--xp-yellow-dark'
            };
    }
}
export default theme;
