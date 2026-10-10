/**
 * Returns articles in `.sb-page--grid` whose text overflows the box.
 * Overflowing text is laid out as extra columns, so the text is compared with the box edge.
 * Only text nodes count: a range over an element also returns the element's own box, which
 * Firefox makes taller than its text for column-spanning headlines.
 */
export declare function findOverflow(root: ParentNode): Element[];
