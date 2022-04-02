import XPowerNft from './xpower-nft';

describe('XPowerNft', () => {
    it('should be constructible', () => {
        const address = '0xd17C755b49A831CDF32Fb5C797cFdf3aD5Bbae24';
        const xpower_nft = new XPowerNft(address);
        expect(xpower_nft).toBeDefined();
    })
});
