/**
 * Returns articles in `.sb-page--grid` whose text overflows the box.
 * Overflowing text is laid out as extra columns, so the text range is compared with the box edge.
 */
export function findOverflow(root) {
    return [...root.querySelectorAll(".sb-page--grid > .sb-article")].filter((el) => {
        const range = el.ownerDocument.createRange();
        range.selectNodeContents(el);
        const box = el.getBoundingClientRect();
        const vertical = getComputedStyle(el).writingMode.startsWith("vertical");
        return [...range.getClientRects()].some((r) => r.width > 0 && r.height > 0 && (vertical ? r.bottom > box.bottom + 1 : r.right > box.right + 1));
    });
}
