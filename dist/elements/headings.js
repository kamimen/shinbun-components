import { PlacedElement, ShinbunElement, applyLevel } from "../internal/base.js";
/**
 * Kicker: the small line above a headline. Spans all columns inside an article.
 *
 * @element shinbun-kicker
 *
 * @slot - Text
 */
export class ShinbunKicker extends ShinbunElement {
}
ShinbunKicker.defaultTag = "shinbun-kicker";
ShinbunKicker.block = "sb-kicker";
ShinbunKicker.role = "paragraph";
/**
 * Sleeve headline: the secondary headline beside the main one. Spans all columns inside an article.
 *
 * @element shinbun-sleeve
 *
 * @slot - Text
 */
export class ShinbunSleeve extends ShinbunElement {
}
ShinbunSleeve.defaultTag = "shinbun-sleeve";
ShinbunSleeve.block = "sb-sleeve";
ShinbunSleeve.role = "paragraph";
/**
 * Subhead inside an article. Spans all columns.
 *
 * @element shinbun-sub
 *
 * @slot - Text
 */
export class ShinbunSub extends ShinbunElement {
}
ShinbunSub.defaultTag = "shinbun-sub";
ShinbunSub.block = "sb-sub";
ShinbunSub.role = "paragraph";
/**
 * Horizontal headline set in a vertical paper. Place it in the page grid with `span`, `y`, `x`, `w`.
 *
 * @element shinbun-yoko
 *
 * @attr {number} span - Number of columns (1-15)
 * @attr {number} y - Start column (1-15)
 * @attr {number} x - Start position on the line axis (1-60)
 * @attr {number} w - Lines occupied on the line axis (1-60)
 * @attr {boolean} reverse - White text on a dark background
 * @attr {number} level - Heading level 1-6 (default: 2)
 *
 * @slot - Text
 */
export class ShinbunYoko extends PlacedElement {
    connectedCallback() {
        super.connectedCallback();
        if (!this.hasAttribute("aria-level"))
            applyLevel(this, this.getAttribute("level"));
    }
    attributeChangedCallback(name, old, value) {
        if (name === "level")
            applyLevel(this, value);
        else
            super.attributeChangedCallback(name, old, value);
    }
}
ShinbunYoko.defaultTag = "shinbun-yoko";
ShinbunYoko.block = "sb-yoko";
ShinbunYoko.role = "heading";
ShinbunYoko.flags = { reverse: "sb-yoko--reverse" };
ShinbunYoko.extraAttributes = ["level"];
