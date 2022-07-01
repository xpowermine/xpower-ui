export function ancestors<
    TElement extends HTMLElement
>(
    e?: TElement | null,
    filter?: (e: HTMLElement) => boolean,
    array: HTMLElement[] = []
) {
    while (e && e.parentElement) {
        if (!filter || filter(e.parentElement)) {
            array.push(e.parentElement);
        }
        e = e.parentElement as TElement | null;
    }
    return array as TElement[];
}
export function ancestor<
    TElement extends HTMLElement
>(
    e?: TElement | null,
    filter?: (e: HTMLElement) => boolean,
    index = 0, array: HTMLElement[] = []
): TElement | null {
    return ancestors<TElement>(e, filter, array)[index] ?? null;
}
export default ancestors;
