import { ShinbunElement } from "../internal/base.js";
/**
 * Lead paragraph (summary) of an article.
 *
 * @element shinbun-lead
 *
 * @slot - Text
 */
export declare class ShinbunLead extends ShinbunElement {
    static defaultTag: string;
    static block: string;
    static role: string;
}
/**
 * Dateline: the place and date an article was filed from.
 *
 * @element shinbun-dateline
 *
 * @slot - Text
 */
export declare class ShinbunDateline extends ShinbunElement {
    static defaultTag: string;
    static block: string;
    static role: string;
}
/**
 * Byline: the author credit at the end of an article.
 *
 * @element shinbun-byline
 *
 * @slot - Text
 */
export declare class ShinbunByline extends ShinbunElement {
    static defaultTag: string;
    static block: string;
    static role: string;
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
export declare class ShinbunParagraph extends ShinbunElement {
    static defaultTag: string;
    static role: string;
    static flags: {
        flush: string;
    };
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
