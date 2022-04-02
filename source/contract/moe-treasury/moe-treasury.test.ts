import MoeTreasury from './moe-treasury';

describe('MoeTreasury', () => {
    it('should be constructible', () => {
        const address = '0x277f722E66e81585272CE53413c487be198BcB85';
        const xpower = new MoeTreasury(address);
        expect(xpower).toBeDefined();
    })
});
