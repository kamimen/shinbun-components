import { PlacedElement } from "../internal/base.js";
/**
 * Photo or figure with an optional caption. Spans all columns inside an article;
 * as a direct child of the page it can be placed with `span`, `y`, `x`, `w`.
 * In vertical writing the image height is the column length, so `ratio` sets the width relative to it.
 *
 * @element shinbun-photo
 *
 * @attr {string} ratio - Aspect ratio (width / height), e.g. `10 / 11`
 * @attr {number} span - Number of columns when placed in the page (1-15)
 * @attr {number} y - Start column when placed in the page (1-15)
 * @attr {number} x - Start position on the line axis when placed in the page (1-60)
 * @attr {number} w - Lines occupied when placed in the page (1-60)
 *
 * @slot - img and figcaption
 *
 * @cssprop --sb-photo-bg - Background color before the image loads
 * @cssprop --sb-photo-ratio - Aspect ratio (also set by `ratio`)
 */
export declare class ShinbunPhoto extends PlacedElement {
    static defaultTag: string;
    static block: string;
    static role: string;
    static parts: {
        img: string;
        figcaption: string;
    };
    static extraAttributes: string[];
    attributeChangedCallback(name: string, old: string | null, value: string | null): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "shinbun-photo": ShinbunPhoto;
    }
}
