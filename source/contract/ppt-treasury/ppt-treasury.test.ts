import PptTreasury from './ppt-treasury';

describe('PptTreasury', () => {
    it('should be constructible', () => {
        const address = '0x5F909f607A29156Dd9Fc43382d09420bba7799A6';
        const xpower = new PptTreasury(address);
        expect(xpower).toBeDefined();
    })
});
