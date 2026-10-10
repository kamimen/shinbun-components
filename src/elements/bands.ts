import { PlacedElement, ShinbunElement } from "../internal/base.ts";

/**
 * Horizontal band at the top of a horizontal-writing paper: title and side notes.
 * A direct `h1` is the title; children with `side` (or `side="end"`) are the side blocks.
 *
 * @element shinbun-masthead
 *
 * @slot - h1 title and `side` blocks
 */
export class ShinbunMasthead extends ShinbunElement {
  static override defaultTag = "shinbun-masthead";
  static override block = "sb-masthead";
  static override parts = {
    h1: "sb-masthead__title",
    "[side]": "sb-masthead__side",
    "[side=end]": "sb-masthead__side--end",
  };
}

/**
 * Nameplate (title block) placed in the page grid. A direct `h1` is the title,
 * `img` the logo and `p` the meta line.
 *
 * @element shinbun-nameplate
 *
 * @attr {number} span - Number of columns (1-15)
 * @attr {number} y - Start column (1-15)
 * @attr {number} x - Start position on the line axis (1-60)
 * @attr {number} w - Lines occupied on the line axis (1-60)
 * @attr {boolean} horizontal - Set the title horizontally inside a vertical paper
 *
 * @slot - h1, img and p
 */
export class ShinbunNameplate extends PlacedElement {
  static override defaultTag = "shinbun-nameplate";
  static override block = "sb-nameplate";
  static override flags = { horizontal: "sb-nameplate--horizontal" };
  static override parts = { h1: "sb-nameplate__title", img: "sb-nameplate__logo", p: "sb-nameplate__meta" };
}

/**
 * Folio: the line outside the page area with the section name and date.
 * A child with `section` is the section label.
 *
 * @element shinbun-folio
 *
 * @slot - Text and the `section` label
 */
export class ShinbunFolio extends ShinbunElement {
  static override defaultTag = "shinbun-folio";
  static override block = "sb-folio";
  static override parts = { "[section]": "sb-folio__section" };
}

declare global {
  interface HTMLElementTagNameMap {
    "shinbun-masthead": ShinbunMasthead;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "shinbun-nameplate": ShinbunNameplate;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "shinbun-folio": ShinbunFolio;
  }
}
