import { ShinbunElement, applyLevel } from "../internal/base.ts";
import { parseEnum } from "../internal/validate.ts";

const SIZE = ["xl", "l", "m", "s"] as const;
export type HeadlineSize = (typeof SIZE)[number];

/**
 * Headline. Spans all columns of its article. Exposed as `role="heading"`.
 *
 * @element shinbun-headline
 *
 * @attr {"xl"|"l"|"m"|"s"} size - Size (default: m)
 * @attr {number} level - Heading level 1-6 (default: 2)
 *
 * @slot - Headline text
 *
 * @cssprop --sb-h-xl - Scale of xl relative to the body font size
 * @cssprop --sb-h-l - Scale of l
 * @cssprop --sb-h-m - Scale of m
 * @cssprop --sb-h-s - Scale of s
 */
export class ShinbunHeadline extends ShinbunElement {
  static override defaultTag = "shinbun-headline";
  static override block = "sb-headline";
  static override role = "heading";
  static override choices = { size: { prefix: "sb-headline--", values: SIZE } };
  static override extraAttributes = ["level"];

  get size(): HeadlineSize | null {
    return parseEnum(this.getAttribute("size"), SIZE);
  }
  set size(value: HeadlineSize | null) {
    if (value === null) this.removeAttribute("size");
    else this.setAttribute("size", value);
  }

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
    "shinbun-headline": ShinbunHeadline;
  }
}
