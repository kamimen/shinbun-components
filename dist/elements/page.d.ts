import { ShinbunElement } from "../internal/base.js";
/**
 * Page grid. Lays out articles and photos in columns.
 *
 * @element shinbun-page
 *
 * @attr {boolean} grid - Coordinate grid: fix the line axis too and fit articles into rectangles
 *
 * @slot - shinbun-article, shinbun-photo, shinbun-nameplate, shinbun-box
 *
 * The page becomes keyboard-focusable (`tabindex="0"`) while its content scrolls.
 *
 * @cssprop --sb-dan - Columns per page in vertical writing
 * @cssprop --sb-lines - Lines in the coordinate grid
 */
export declare class ShinbunPage extends ShinbunElement {
    #private;
    static defaultTag: string;
    static block: string;
    static flags: {
        grid: string;
    };
    connectedCallback(): void;
    disconnectedCallback(): void;
    get grid(): boolean;
    set grid(value: boolean);
}
declare global {
    interface HTMLElementTagNameMap {
        "shinbun-page": ShinbunPage;
    }
}
