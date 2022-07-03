export const trim = (text: string): string => text.trim();
export const nice = (n: number | bigint, result = ''): string => {
    const text = n.toString();
    for (let i = text.length - 1; i >= 0; i--) {
        if ((text.length - i) % 3 === 0 && i > 0) {
            result = "'" + text[i] + result;
        } else {
            result = text[i] + result;
        }
    }
    return result;
};
export default {
    trim, nice
};
