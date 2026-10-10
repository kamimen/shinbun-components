/**
 * Returns articles in `.sb-page--grid` whose text overflows the box.
 * Overflowing text is laid out as extra columns, so the text range is compared with the box edge.
 */
export declare function findOverflow(root: ParentNode): Element[];
