import { PlacedElement, ShinbunElement } from "../internal/base.js";
/**
 * Horizontal band at the top of a horizontal-writing paper: title and side notes.
 * A direct `h1` is the title; children with `side` (or `side="end"`) are the side blocks.
 *
 * @element shinbun-masthead
 *
 * @slot - h1 title and `side` blocks
 */
export declare class ShinbunMasthead extends ShinbunElement {
    static defaultTag: string;
    static block: string;
    static parts: {
        h1: string;
        "[side]": string;
        "[side=end]": string;
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
export declare class ShinbunNameplate extends PlacedElement {
    static defaultTag: string;
    static block: string;
    static flags: {
        horizontal: string;
    };
    static parts: {
        h1: string;
        img: string;
        p: string;
    };
}
/**
 * Folio: the line outside the page area with the section name and date.
 * A child with `section` is the section label.
 *
 * @element shinbun-folio
 *
 * @slot - Text and the `section` label
 */
export declare class ShinbunFolio extends ShinbunElement {
    static defaultTag: string;
    static block: string;
    static parts: {
        "[section]": string;
    };
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
