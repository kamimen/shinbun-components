import { ShinbunElement } from "../internal/base.js";
/**
 * Emphasis dots (sesame) over the text.
 *
 * @element shinbun-emphasis
 *
 * @slot - Text
 */
export class ShinbunEmphasis extends ShinbunElement {
}
ShinbunEmphasis.defaultTag = "shinbun-emphasis";
ShinbunEmphasis.block = "sb-emphasis";
/**
 * Tate-chu-yoko: sets a short run of digits or letters horizontally in one character cell.
 *
 * @element shinbun-tcy
 *
 * @slot - Text
 */
export class ShinbunTcy extends ShinbunElement {
}
ShinbunTcy.defaultTag = "shinbun-tcy";
ShinbunTcy.block = "sb-tcy";
/**
 * Sets Latin text rotated 90 degrees in vertical writing.
 *
 * @element shinbun-sideways
 *
 * @slot - Text
 */
export class ShinbunSideways extends ShinbunElement {
}
ShinbunSideways.defaultTag = "shinbun-sideways";
ShinbunSideways.block = "sb-sideways";
/**
 * Sets a run of text horizontally inside vertical writing.
 *
 * @element shinbun-horizontal
 *
 * @slot - Text
 */
export class ShinbunHorizontal extends ShinbunElement {
}
ShinbunHorizontal.defaultTag = "shinbun-horizontal";
ShinbunHorizontal.block = "sb-horizontal";
