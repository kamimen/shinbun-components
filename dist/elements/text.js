import { ShinbunElement } from "../internal/base.js";
/**
 * Lead paragraph (summary) of an article.
 *
 * @element shinbun-lead
 *
 * @slot - Text
 */
export class ShinbunLead extends ShinbunElement {
}
ShinbunLead.defaultTag = "shinbun-lead";
ShinbunLead.block = "sb-lead";
ShinbunLead.role = "paragraph";
/**
 * Dateline: the place and date an article was filed from.
 *
 * @element shinbun-dateline
 *
 * @slot - Text
 */
export class ShinbunDateline extends ShinbunElement {
}
ShinbunDateline.defaultTag = "shinbun-dateline";
ShinbunDateline.block = "sb-dateline";
ShinbunDateline.role = "paragraph";
/**
 * Byline: the author credit at the end of an article.
 *
 * @element shinbun-byline
 *
 * @slot - Text
 */
export class ShinbunByline extends ShinbunElement {
}
ShinbunByline.defaultTag = "shinbun-byline";
ShinbunByline.block = "sb-byline";
ShinbunByline.role = "paragraph";
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
}
ShinbunParagraph.defaultTag = "shinbun-paragraph";
ShinbunParagraph.role = "paragraph";
ShinbunParagraph.flags = { flush: "sb-flush" };
