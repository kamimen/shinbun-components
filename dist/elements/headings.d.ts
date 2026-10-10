import { PlacedElement, ShinbunElement } from "../internal/base.js";
/**
 * Kicker: the small line above a headline. Spans all columns inside an article.
 *
 * @element shinbun-kicker
 *
 * @slot - Text
 */
export declare class ShinbunKicker extends ShinbunElement {
    static defaultTag: string;
    static block: string;
    static role: string;
}
/**
 * Sleeve headline: the secondary headline beside the main one. Spans all columns inside an article.
 *
 * @element shinbun-sleeve
 *
 * @slot - Text
 */
export declare class ShinbunSleeve extends ShinbunElement {
    static defaultTag: string;
    static block: string;
    static role: string;
}
/**
 * Subhead inside an article. Spans all columns.
 *
 * @element shinbun-sub
 *
 * @slot - Text
 */
export declare class ShinbunSub extends ShinbunElement {
    static defaultTag: string;
    static block: string;
    static role: string;
}
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
export declare class ShinbunYoko extends PlacedElement {
    static defaultTag: string;
    static block: string;
    static role: string;
    static flags: {
        reverse: string;
    };
    static extraAttributes: string[];
    connectedCallback(): void;
    attributeChangedCallback(name: string, old: string | null, value: string | null): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "shinbun-kicker": ShinbunKicker;
    }
}
declare global {
    interface HTMLElementTagNameMap {
        "shinbun-sleeve": ShinbunSleeve;
    }
}
declare global {
    interface HTMLElementTagNameMap {
        "shinbun-sub": ShinbunSub;
    }
}
declare global {
    interface HTMLElementTagNameMap {
        "shinbun-yoko": ShinbunYoko;
    }
}
