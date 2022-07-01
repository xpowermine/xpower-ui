export function siblings<
    TElement extends HTMLElement
>(
    e?: TElement | null,
    filter?: (e: HTMLElement) => boolean,
    array: HTMLElement[] = []
) {
    e = e?.parentElement?.firstElementChild as TElement | null;
    while (e) {
        if (!filter || filter(e)) {
            array.push(e);
        }
        e = e.nextElementSibling as TElement | null;
    }
    return array as TElement[];
}
export function sibling<
    TElement extends HTMLElement
>(
    e?: TElement | null,
    filter?: (e: HTMLElement) => boolean,
    index = 0, array: HTMLElement[] = []
): TElement | null {
    return siblings<TElement>(e, filter, array)[index] ?? null;
}
export default siblings;
