import { ShinbunElement } from "../internal/base.ts";

/**
 * Emphasis dots (sesame) over the text.
 *
 * @element shinbun-emphasis
 *
 * @slot - Text
 */
export class ShinbunEmphasis extends ShinbunElement {
  static override defaultTag = "shinbun-emphasis";
  static override block = "sb-emphasis";
}

/**
 * Tate-chu-yoko: sets a short run of digits or letters horizontally in one character cell.
 *
 * @element shinbun-tcy
 *
 * @slot - Text
 */
export class ShinbunTcy extends ShinbunElement {
  static override defaultTag = "shinbun-tcy";
  static override block = "sb-tcy";
}

/**
 * Sets Latin text rotated 90 degrees in vertical writing.
 *
 * @element shinbun-sideways
 *
 * @slot - Text
 */
export class ShinbunSideways extends ShinbunElement {
  static override defaultTag = "shinbun-sideways";
  static override block = "sb-sideways";
}

/**
 * Sets a run of text horizontally inside vertical writing.
 *
 * @element shinbun-horizontal
 *
 * @slot - Text
 */
export class ShinbunHorizontal extends ShinbunElement {
  static override defaultTag = "shinbun-horizontal";
  static override block = "sb-horizontal";
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
