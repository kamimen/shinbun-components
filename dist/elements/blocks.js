import { PlacedElement, ShinbunElement } from "../internal/base.js";
const AD_KINDS = ["kijishita", "zen", "han", "zen5", "han5", "zen2", "han2", "full"];
/**
 * Box for explanations and key points. A direct `h3` is the title.
 * Spans all columns inside an article; in the page grid it can be placed with `span`, `y`, `x`, `w`.
 *
 * @element shinbun-box
 *
 * @attr {number} span - Number of columns (1-15)
 * @attr {number} y - Start column (1-15)
 * @attr {number} x - Start position on the line axis (1-60)
 * @attr {number} w - Lines occupied on the line axis (1-60)
 *
 * @slot - h3 title and text
 */
export class ShinbunBox extends PlacedElement {
}
ShinbunBox.defaultTag = "shinbun-box";
ShinbunBox.block = "sb-box";
ShinbunBox.role = "note";
ShinbunBox.parts = { h3: "sb-box__title" };
/**
 * Advertisement slot. Combine sizes with spaces, e.g. `kind="kijishita zen5"`.
 *
 * @element shinbun-ad
 *
 * @attr {string} kind - Space-separated sizes: kijishita, zen, han, zen5, han5, zen2, han2, full
 * @attr {number} span - Number of columns (1-15)
 * @attr {number} y - Start column (1-15)
 * @attr {number} x - Start position on the line axis (1-60)
 * @attr {number} w - Lines occupied on the line axis (1-60)
 *
 * @slot - Advertisement content
 */
export class ShinbunAd extends PlacedElement {
}
ShinbunAd.defaultTag = "shinbun-ad";
ShinbunAd.block = "sb-ad";
ShinbunAd.role = "group";
ShinbunAd.choices = { kind: { prefix: "sb-ad--", values: AD_KINDS, multiple: true } };
/**
 * Rule line.
 *
 * @element shinbun-rule
 *
 * @attr {boolean} double - Double rule
 */
export class ShinbunRule extends ShinbunElement {
}
ShinbunRule.defaultTag = "shinbun-rule";
ShinbunRule.block = "sb-rule";
ShinbunRule.role = "separator";
ShinbunRule.flags = { double: "sb-rule--double" };
