type Definable = CustomElementConstructor & {
    defaultTag: string;
};
export interface Choice {
    prefix: string;
    values: readonly string[];
    /** Accept several space-separated values */
    multiple?: boolean;
}
/**
 * Base class. Elements use Light DOM and only add shinbun-css classes and `data-sb-*` attributes,
 * so the stylesheet's child combinators and `column-span` keep working.
 *
 * A subclass is configured with static fields:
 * - `block`: class added to the host
 * - `flags`: boolean attribute -> class
 * - `choices`: attribute -> `prefix + value` classes
 * - `parts`: selector -> class, added to matching direct children (also to children added later)
 * - `role`: default ARIA role (an explicit `role` attribute wins)
 * - `extraAttributes`: attributes the subclass handles itself
 */
export declare abstract class ShinbunElement extends HTMLElement {
    #private;
    static defaultTag: string;
    static block: string;
    static role: string | null;
    static flags: Readonly<Record<string, string>>;
    static choices: Readonly<Record<string, Choice>>;
    static parts: Readonly<Record<string, string>>;
    static extraAttributes: readonly string[];
    static get observedAttributes(): string[];
    /** Registers the element. Safe to call twice; the tag name can be changed. */
    static define(this: Definable, tag?: string, registry?: CustomElementRegistry): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string, _old: string | null, value: string | null): void;
    /** Adds the `parts` classes to matching direct children. */
    protected classifyChildren(): void;
    protected applyChoice(name: string, { prefix, values, multiple }: Choice, value: string | null): void;
    protected warn(message: string): void;
    protected setData(name: string, value: string | number | null): void;
    protected setProp(name: string, value: string | number | null): void;
    /** Returns null for a missing attribute, and warns and returns null for an invalid one. */
    protected parse<T>(name: string, value: string | null, parser: (v: string | null) => T | null): T | null;
}
/** Base class for direct children of the column grid; maps `span`, `y`, `x`, `w` to `data-sb-*`. */
export declare abstract class PlacedElement extends ShinbunElement {
    #private;
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string, old: string | null, value: string | null): void;
    get span(): number | null;
    set span(value: number | null);
    get y(): number | null;
    set y(value: number | null);
    get x(): number | null;
    set x(value: number | null);
    get w(): number | null;
    set w(value: number | null);
}
/** Sets `aria-level` from a `level` attribute (1-6, default 2) unless the author set `aria-level`. */
export declare function applyLevel(el: ShinbunElement, value: string | null): void;
/** Runs after parsing; children are not available while the document is still loading. */
export declare function whenParsed(callback: () => void): void;
export {};
