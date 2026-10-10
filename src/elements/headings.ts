import { PlacedElement, ShinbunElement, applyLevel } from "../internal/base.ts";

/**
 * Kicker: the small line above a headline. Spans all columns inside an article.
 *
 * @element shinbun-kicker
 *
 * @slot - Text
 */
export class ShinbunKicker extends ShinbunElement {
  static override defaultTag = "shinbun-kicker";
  static override block = "sb-kicker";
  static override role = "paragraph";
}

/**
 * Sleeve headline: the secondary headline beside the main one. Spans all columns inside an article.
 *
 * @element shinbun-sleeve
 *
 * @slot - Text
 */
export class ShinbunSleeve extends ShinbunElement {
  static override defaultTag = "shinbun-sleeve";
  static override block = "sb-sleeve";
  static override role = "paragraph";
}

/**
 * Subhead inside an article. Spans all columns.
 *
 * @element shinbun-sub
 *
 * @slot - Text
 */
export class ShinbunSub extends ShinbunElement {
  static override defaultTag = "shinbun-sub";
  static override block = "sb-sub";
  static override role = "paragraph";
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
export class ShinbunYoko extends PlacedElement {
  static override defaultTag = "shinbun-yoko";
  static override block = "sb-yoko";
  static override role = "heading";
  static override flags = { reverse: "sb-yoko--reverse" };
  static override extraAttributes = ["level"];

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.hasAttribute("aria-level")) applyLevel(this, this.getAttribute("level"));
  }

  override attributeChangedCallback(name: string, old: string | null, value: string | null): void {
    if (name === "level") applyLevel(this, value);
    else super.attributeChangedCallback(name, old, value);
  }
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
