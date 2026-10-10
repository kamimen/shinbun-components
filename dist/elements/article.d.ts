import { PlacedElement } from "../internal/base.js";
/**
 * Article. Occupies `span` columns; body text flows across them, headlines and photos span all of them.
 *
 * @element shinbun-article
 *
 * @attr {number} span - Number of columns (1-15)
 * @attr {number} y - Start column (1-15)
 * @attr {number} x - Start position on the line axis (1-60)
 * @attr {number} w - Lines occupied on the line axis (1-60)
 * @attr {boolean} lead - Lead article (double rule below)
 * @attr {boolean} editorial - Editorial: slightly larger body text
 * @attr {boolean} column - Signed column with a tinted background
 *
 * @slot - shinbun-headline, shinbun-photo, paragraphs
 */
export declare class ShinbunArticle extends PlacedElement {
    static defaultTag: string;
    static block: string;
    static role: string;
    static flags: {
        lead: string;
        editorial: string;
        column: string;
    };
    get lead(): boolean;
    set lead(value: boolean);
}
declare global {
    interface HTMLElementTagNameMap {
        "shinbun-article": ShinbunArticle;
    }
}
