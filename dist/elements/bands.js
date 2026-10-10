import { PlacedElement, ShinbunElement } from "../internal/base.js";
/**
 * Horizontal band at the top of a horizontal-writing paper: title and side notes.
 * A direct `h1` is the title; children with `side` (or `side="end"`) are the side blocks.
 *
 * @element shinbun-masthead
 *
 * @slot - h1 title and `side` blocks
 */
export class ShinbunMasthead extends ShinbunElement {
}
ShinbunMasthead.defaultTag = "shinbun-masthead";
ShinbunMasthead.block = "sb-masthead";
ShinbunMasthead.parts = {
    h1: "sb-masthead__title",
    "[side]": "sb-masthead__side",
    "[side=end]": "sb-masthead__side--end",
};
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
}
ShinbunNameplate.defaultTag = "shinbun-nameplate";
ShinbunNameplate.block = "sb-nameplate";
ShinbunNameplate.flags = { horizontal: "sb-nameplate--horizontal" };
ShinbunNameplate.parts = { h1: "sb-nameplate__title", img: "sb-nameplate__logo", p: "sb-nameplate__meta" };
/**
 * Folio: the line outside the page area with the section name and date.
 * A child with `section` is the section label.
 *
 * @element shinbun-folio
 *
 * @slot - Text and the `section` label
 */
export class ShinbunFolio extends ShinbunElement {
}
ShinbunFolio.defaultTag = "shinbun-folio";
ShinbunFolio.block = "sb-folio";
ShinbunFolio.parts = { "[section]": "sb-folio__section" };
