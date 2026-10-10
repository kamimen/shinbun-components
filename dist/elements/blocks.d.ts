import { PlacedElement, ShinbunElement } from "../internal/base.js";
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
export declare class ShinbunBox extends PlacedElement {
    static defaultTag: string;
    static block: string;
    static role: string;
    static parts: {
        h3: string;
    };
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
export declare class ShinbunAd extends PlacedElement {
    static defaultTag: string;
    static block: string;
    static role: string;
    static choices: {
        kind: {
            prefix: string;
            values: readonly ["kijishita", "zen", "han", "zen5", "han5", "zen2", "han2", "full"];
            multiple: boolean;
        };
    };
}
/**
 * Rule line.
 *
 * @element shinbun-rule
 *
 * @attr {boolean} double - Double rule
 */
export declare class ShinbunRule extends ShinbunElement {
    static defaultTag: string;
    static block: string;
    static role: string;
    static flags: {
        double: string;
    };
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
