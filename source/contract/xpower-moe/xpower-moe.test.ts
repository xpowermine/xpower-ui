import XPowerMoe from './xpower-moe';

describe('XPowerMoe', () => {
    it('should be constructible', () => {
        const address = '0x7B4982e1F7ee384F206417Fb851a1EB143c513F9';
        const xpower_moe = new XPowerMoe(address);
        expect(xpower_moe).toBeDefined();
    })
});
