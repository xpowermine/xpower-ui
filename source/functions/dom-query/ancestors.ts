export function ancestors(
    e?: Element | null,
    filter?: (e: Element) => boolean,
    ancestors: Element[] = []
) {
    while (e && e.parentElement) {
        if (!filter || filter(e.parentElement)) {
            ancestors.push(e.parentElement);
        }
        e = e.parentElement;
    }
    return ancestors;
}
export default ancestors;
