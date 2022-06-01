/* eslint @typescript-eslint/no-explicit-any: [off] */
const prototype = BigInt.prototype as any;
prototype.toJson = (b: bigint) => `${b}n`;
export function max(
    lhs: bigint, rhs: bigint
) {
    return lhs > rhs ? lhs : rhs;
}
export function min(
    lhs: bigint, rhs: bigint
) {
    return lhs < rhs ? lhs : rhs;
}
export function hex(
    value: bigint | number
) {
    return '0x' + value.toString(16);
}
export function hex_plain(
    value: bigint | number, min_length: number
) {
    const string = value.toString(16);
    const length = min_length - string.length;
    return `${'0'.repeat(length)}` + string;
}
export function x40(
    value: bigint | number, min_length = 40
) {
    const string = value.toString(16);
    const length = min_length - string.length;
    return `0x${'0'.repeat(length)}` + string;
}
export function x40_plain(
    value: bigint | number, min_length = 40
) {
    const string = value.toString(16);
    const length = min_length - string.length;
    return `${'0'.repeat(length)}` + string;
}
export function x64(
    value: bigint | number, min_length = 64
) {
    const string = value.toString(16);
    const length = min_length - string.length;
    return `0x${'0'.repeat(length)}` + string;
}
export function x64_plain(
    value: bigint | number, min_length = 64
) {
    const string = value.toString(16);
    const length = min_length - string.length;
    return `${'0'.repeat(length)}` + string
}
