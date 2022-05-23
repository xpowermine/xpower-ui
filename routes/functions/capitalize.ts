export function capitalize(text: string, length = 1) {
    return text.slice(0, length).toUpperCase() + text.slice(length);
}
export function capitalizeAll(text: string, length = 1, {
    separator
} = {
    separator: ' '
}) {
    return text.split(separator)
        .map((t) => capitalize(t, length)).join(separator);
}
export default capitalize;
