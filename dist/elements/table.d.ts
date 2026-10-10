import { PlacedElement } from "../internal/base.js";
/**
 * Wrapper for a real `table`. The wrapper keeps native table semantics: the inner `table` gets the
 * shinbun-css classes, and cells with `num` are right-aligned. Tables are always set horizontally.
 *
 * @element shinbun-table
 *
 * @attr {boolean} tv - Compact TV-listing style
 * @attr {number} span - Number of columns (1-15)
 * @attr {number} y - Start column (1-15)
 * @attr {number} x - Start position on the line axis (1-60)
 * @attr {number} w - Lines occupied on the line axis (1-60)
 *
 * @slot - A `table` element
 */
export declare class ShinbunTable extends PlacedElement {
    #private;
    static defaultTag: string;
    static extraAttributes: string[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string, old: string | null, value: string | null): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "shinbun-table": ShinbunTable;
    }
}
