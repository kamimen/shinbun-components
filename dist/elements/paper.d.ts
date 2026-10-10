import { ShinbunElement } from "../internal/base.js";
declare const WRITING: readonly ["vertical", "horizontal"];
declare const THEME: readonly ["light", "dark", "auto"];
export type Writing = (typeof WRITING)[number];
export type Theme = (typeof THEME)[number];
/**
 * Outer frame of a page: writing mode, theme and the page grid settings.
 *
 * @element shinbun-paper
 *
 * @attr {"vertical"|"horizontal"} writing - Writing mode (default: vertical)
 * @attr {"light"|"dark"|"auto"} theme - Color scheme
 * @attr {"15dan"|"12dan"} preset - Column preset (15 or 12 columns)
 * @attr {boolean} debug - Outline the placed items
 * @attr {number} responsive - Switch to horizontal below this viewport width in px (default: 768)
 * @attr {boolean} auto-tcy - Wrap two-digit numbers for tate-chu-yoko
 * @attr {number} dan - Columns per page in vertical writing
 * @attr {number} dan-h - Columns per page in horizontal writing
 * @attr {number} chars - Characters per column in vertical writing
 * @attr {number} lines - Lines in the coordinate grid
 * @attr {string} font-size - Body font size, e.g. 0.8rem
 *
 * @slot - shinbun-page, nameplate, folio
 *
 * @cssprop --sb-paper - Paper color
 * @cssprop --sb-ink - Text color
 * @cssprop --sb-accent - Accent color
 * @cssprop --sb-font-body - Body font
 * @cssprop --sb-gap - Gap between columns and articles
 */
export declare class ShinbunPaper extends ShinbunElement {
    #private;
    static defaultTag: string;
    static block: string;
    static choices: {
        preset: {
            prefix: string;
            values: string[];
        };
    };
    static extraAttributes: string[];
    get writing(): Writing;
    set writing(value: Writing);
    get theme(): Theme | null;
    set theme(value: Theme | null);
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string, old: string | null, value: string | null): void;
    /** Wraps two-digit numbers in `sb-tcy` spans. Returns the number of spans added. */
    applyTcy(): number;
    /** Returns articles in the coordinate grid whose text overflows the box. */
    overflow(): Element[];
}
declare global {
    interface HTMLElementTagNameMap {
        "shinbun-paper": ShinbunPaper;
    }
}
export {};
