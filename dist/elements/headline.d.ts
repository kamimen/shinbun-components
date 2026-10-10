import { ShinbunElement } from "../internal/base.js";
declare const SIZE: readonly ["xl", "l", "m", "s"];
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
export declare class ShinbunHeadline extends ShinbunElement {
    static defaultTag: string;
    static block: string;
    static role: string;
    static choices: {
        size: {
            prefix: string;
            values: readonly ["xl", "l", "m", "s"];
        };
    };
    static extraAttributes: string[];
    get size(): HeadlineSize | null;
    set size(value: HeadlineSize | null);
    connectedCallback(): void;
    attributeChangedCallback(name: string, old: string | null, value: string | null): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "shinbun-headline": ShinbunHeadline;
    }
}
export {};
