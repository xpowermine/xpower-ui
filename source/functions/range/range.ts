/**
 * @returns [start...end)
 */
export function* range(start: number, end?: number) {
    if (typeof end === 'undefined') {
        end = start; start = 0;
    }
    for (let i = start; i < end; i++) {
        yield i;
    }
}
export default range;
