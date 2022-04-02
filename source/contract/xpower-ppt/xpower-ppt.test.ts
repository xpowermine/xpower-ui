import XPowerPpt from './xpower-ppt';

describe('XPowerPpt', () => {
    it('should be constructible', () => {
        const address = '0xB6157727b2989aE46e970B451A289941Ce8B41FA';
        const xpower_nft = new XPowerPpt(address);
        expect(xpower_nft).toBeDefined();
    })
});
