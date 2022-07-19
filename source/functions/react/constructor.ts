/* eslint @typescript-eslint/no-explicit-any: [off] */
export type Constructor<U = unknown> = {
    new (...args: any[]): U;
}
export default Constructor;
