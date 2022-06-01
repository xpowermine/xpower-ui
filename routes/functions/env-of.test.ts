/* eslint @typescript-eslint/no-explicit-any: [off] */
import env_of from './env-of';

describe('env_of', () => {
    it('should return env-of request', () => {
        const req = {
            headers: { 'x-forwarded-host': 'localhost:3000' },
            protocol: 'http'
        };
        expect(env_of(req as any)).toEqual({
            'TOKEN': 'THOR',
            'token': 'thor',
            'Token': 'Thor',
            'XP_POWERED': '--xp-yellow',
            'XP_POWERED_DARK': '--xp-yellow-dark',
        });
    });
});
