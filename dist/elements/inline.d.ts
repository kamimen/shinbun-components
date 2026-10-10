import { ShinbunElement } from "../internal/base.js";
/**
 * Emphasis dots (sesame) over the text.
 *
 * @element shinbun-emphasis
 *
 * @slot - Text
 */
export declare class ShinbunEmphasis extends ShinbunElement {
    static defaultTag: string;
    static block: string;
}
/**
 * Tate-chu-yoko: sets a short run of digits or letters horizontally in one character cell.
 *
 * @element shinbun-tcy
 *
 * @slot - Text
 */
export declare class ShinbunTcy extends ShinbunElement {
    static defaultTag: string;
    static block: string;
}
/**
 * Sets Latin text rotated 90 degrees in vertical writing.
 *
 * @element shinbun-sideways
 *
 * @slot - Text
 */
export declare class ShinbunSideways extends ShinbunElement {
    static defaultTag: string;
    static block: string;
}
/**
 * Sets a run of text horizontally inside vertical writing.
 *
 * @element shinbun-horizontal
 *
 * @slot - Text
 */
export declare class ShinbunHorizontal extends ShinbunElement {
    static defaultTag: string;
    static block: string;
}
declare global {
    interface HTMLElementTagNameMap {
        "shinbun-emphasis": ShinbunEmphasis;
    }
}
declare global {
    interface HTMLElementTagNameMap {
        "shinbun-tcy": ShinbunTcy;
    }
}
declare global {
    interface HTMLElementTagNameMap {
        "shinbun-sideways": ShinbunSideways;
    }
}
declare global {
    interface HTMLElementTagNameMap {
        "shinbun-horizontal": ShinbunHorizontal;
    }
}
