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
export class ShinbunArticle extends PlacedElement {
    get lead() {
        return this.hasAttribute("lead");
    }
    set lead(value) {
        this.toggleAttribute("lead", value);
    }
}
ShinbunArticle.defaultTag = "shinbun-article";
ShinbunArticle.block = "sb-article";
ShinbunArticle.role = "article";
ShinbunArticle.flags = { lead: "sb-article--lead", editorial: "sb-article--editorial", column: "sb-column" };
