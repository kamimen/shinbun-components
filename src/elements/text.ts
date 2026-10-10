import { ShinbunElement } from "../internal/base.ts";

/**
 * Lead paragraph (summary) of an article.
 *
 * @element shinbun-lead
 *
 * @slot - Text
 */
export class ShinbunLead extends ShinbunElement {
  static override defaultTag = "shinbun-lead";
  static override block = "sb-lead";
  static override role = "paragraph";
}

/**
 * Dateline: the place and date an article was filed from.
 *
 * @element shinbun-dateline
 *
 * @slot - Text
 */
export class ShinbunDateline extends ShinbunElement {
  static override defaultTag = "shinbun-dateline";
  static override block = "sb-dateline";
  static override role = "paragraph";
}

/**
 * Byline: the author credit at the end of an article.
 *
 * @element shinbun-byline
 *
 * @slot - Text
 */
export class ShinbunByline extends ShinbunElement {
  static override defaultTag = "shinbun-byline";
  static override block = "sb-byline";
  static override role = "paragraph";
}

/**
 * Body paragraph for use where a plain `p` is not wanted. Indented by one character; `flush` removes the indent.
 *
 * @element shinbun-paragraph
 *
 * @attr {boolean} flush - No first-line indent
 *
 * @slot - Text
 */
export class ShinbunParagraph extends ShinbunElement {
  static override defaultTag = "shinbun-paragraph";
  static override role = "paragraph";
  static override flags = { flush: "sb-flush" };
}

declare global {
  interface HTMLElementTagNameMap {
    "shinbun-lead": ShinbunLead;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "shinbun-dateline": ShinbunDateline;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "shinbun-byline": ShinbunByline;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "shinbun-paragraph": ShinbunParagraph;
  }
}
