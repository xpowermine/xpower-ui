export function insertAfter(
    new_node: Node, ref_node?: Node | null
) {
    if (ref_node) {
        ref_node.parentNode?.insertBefore(
            new_node, ref_node.nextSibling
        );
    }
}
export default insertAfter;
