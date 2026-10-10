import { PlacedElement, ShinbunElement } from "../internal/base.ts";

const AD_KINDS = ["kijishita", "zen", "han", "zen5", "han5", "zen2", "han2", "full"] as const;

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
  static override defaultTag = "shinbun-box";
  static override block = "sb-box";
  static override role = "note";
  static override parts = { h3: "sb-box__title" };
}

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
  static override defaultTag = "shinbun-ad";
  static override block = "sb-ad";
  static override role = "group";
  static override choices = { kind: { prefix: "sb-ad--", values: AD_KINDS, multiple: true } };
}

/**
 * Rule line.
 *
 * @element shinbun-rule
 *
 * @attr {boolean} double - Double rule
 */
export class ShinbunRule extends ShinbunElement {
  static override defaultTag = "shinbun-rule";
  static override block = "sb-rule";
  static override role = "separator";
  static override flags = { double: "sb-rule--double" };
}

declare global {
  interface HTMLElementTagNameMap {
    "shinbun-box": ShinbunBox;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "shinbun-ad": ShinbunAd;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "shinbun-rule": ShinbunRule;
  }
}
