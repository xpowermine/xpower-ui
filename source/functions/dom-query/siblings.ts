export function siblings(
    e?: Element | null,
    filter?: (e: Element) => boolean,
    siblings: Element[] = []
) {
    e = e?.parentElement?.firstElementChild;
    while (e) {
        if (!filter || filter(e)) {
            siblings.push(e);
        }
        e = e.nextElementSibling;
    }
    return siblings;
}
export default siblings;
