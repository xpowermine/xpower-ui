import XPower from './xpower';

describe('XPower', () => {
    it('should be constructible', () => {
        const address = '0x7B4982e1F7ee384F206417Fb851a1EB143c513F9';
        const xpower = new XPower(address);
        expect(xpower).toBeDefined();
    })
});
