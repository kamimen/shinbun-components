import { ShinbunElement, applyLevel } from "../internal/base.js";
import { parseEnum } from "../internal/validate.js";
const SIZE = ["xl", "l", "m", "s"];
/**
 * Headline. Spans all columns of its article. Exposed as `role="heading"`.
 *
 * @element shinbun-headline
 *
 * @attr {"xl"|"l"|"m"|"s"} size - Size (default: m)
 * @attr {number} level - Heading level 1-6 (default: 2)
 *
 * @slot - Headline text
 *
 * @cssprop --sb-h-xl - Scale of xl relative to the body font size
 * @cssprop --sb-h-l - Scale of l
 * @cssprop --sb-h-m - Scale of m
 * @cssprop --sb-h-s - Scale of s
 */
export class ShinbunHeadline extends ShinbunElement {
    get size() {
        return parseEnum(this.getAttribute("size"), SIZE);
    }
    set size(value) {
        if (value === null)
            this.removeAttribute("size");
        else
            this.setAttribute("size", value);
    }
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
ShinbunHeadline.defaultTag = "shinbun-headline";
ShinbunHeadline.block = "sb-headline";
ShinbunHeadline.role = "heading";
ShinbunHeadline.choices = { size: { prefix: "sb-headline--", values: SIZE } };
ShinbunHeadline.extraAttributes = ["level"];
