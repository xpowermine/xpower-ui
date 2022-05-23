/* eslint @typescript-eslint/no-explicit-any: [off] */
import { capitalizeAll } from './capitalize';
import { capitalize } from './capitalize';

describe('capitalize w/length=1', () => {
    it('should capitalize "thor token"', () => {
        expect(capitalize('thor token')).toEqual('Thor token');
    });
    it('should capitalize "THOR TOKEN"', () => {
        expect(capitalize('THOR TOKEN')).toEqual('THOR TOKEN');
    });
    it('should capitalize "Thor Token"', () => {
        expect(capitalize('Thor Token')).toEqual('Thor Token');
    });
});
describe('capitalize w/length=2', () => {
    it('should capitalize "thor token"', () => {
        expect(capitalize('thor token', 2)).toEqual('THor token');
    });
    it('should capitalize "THOR TOKEN"', () => {
        expect(capitalize('THOR TOKEN', 2)).toEqual('THOR TOKEN');
    });
    it('should capitalize "Thor Token"', () => {
        expect(capitalize('Thor Token', 2)).toEqual('THor Token');
    });
});
describe('capitalize-all w/length=1', () => {
    it('should capitalize-all "thor token"', () => {
        expect(capitalizeAll('thor token')).toEqual('Thor Token');
    });
    it('should capitalize "THOR TOKEN"', () => {
        expect(capitalizeAll('THOR TOKEN')).toEqual('THOR TOKEN');
    });
    it('should capitalize "Thor Token"', () => {
        expect(capitalizeAll('Thor Token')).toEqual('Thor Token');
    });
});
describe('capitalize-all w/length=2', () => {
    it('should capitalize-all "thor token"', () => {
        expect(capitalizeAll('thor token', 2)).toEqual('THor TOken');
    });
    it('should capitalize "THOR TOKEN"', () => {
        expect(capitalizeAll('THOR TOKEN', 2)).toEqual('THOR TOKEN');
    });
    it('should capitalize "Thor Token"', () => {
        expect(capitalizeAll('Thor Token', 2)).toEqual('THor TOken');
    });
});
