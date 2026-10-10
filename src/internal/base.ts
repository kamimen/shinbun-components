import { PLACEMENT_RANGE, parseIntInRange, type PlacementName } from "./validate.ts";

type Definable = CustomElementConstructor & { defaultTag: string };

export interface Choice {
  prefix: string;
  values: readonly string[];
  /** Accept several space-separated values */
  multiple?: boolean;
}

/** Utility classes available on every element as boolean attributes. */
const COMMON_FLAGS: Readonly<Record<string, string>> = { gothic: "sb-gothic", nowrap: "sb-nowrap" };

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
export abstract class ShinbunElement extends HTMLElement {
  static defaultTag = "";
  static block = "";
  static role: string | null = null;
  static flags: Readonly<Record<string, string>> = {};
  static choices: Readonly<Record<string, Choice>> = {};
  static parts: Readonly<Record<string, string>> = {};
  static extraAttributes: readonly string[] = [];

  static get observedAttributes(): string[] {
    return [...Object.keys(COMMON_FLAGS), ...Object.keys(this.flags), ...Object.keys(this.choices), ...this.extraAttributes];
  }

  /** Registers the element. Safe to call twice; the tag name can be changed. */
  static define(this: Definable, tag: string = this.defaultTag, registry: CustomElementRegistry = customElements): void {
    if (registry.get(tag) === this) return;
    try {
      registry.define(tag, this);
    } catch (error) {
      throw new Error(
        `Cannot define <${tag}>: it is already registered by another copy of shinbun-components (or the class is registered under another tag). Load the library once.`,
        { cause: error },
      );
    }
  }

  #observer: MutationObserver | null = null;

  get #ctor(): typeof ShinbunElement {
    return this.constructor as typeof ShinbunElement;
  }

  connectedCallback(): void {
    const ctor = this.#ctor;
    if (ctor.block) this.classList.add(ctor.block);
    if (ctor.role && !this.hasAttribute("role")) this.setAttribute("role", ctor.role);
    if (Object.keys(ctor.parts).length > 0) {
      this.classifyChildren();
      this.#observer ??= new MutationObserver(() => this.classifyChildren());
      this.#observer.observe(this, { childList: true });
    }
  }

  disconnectedCallback(): void {
    this.#observer?.disconnect();
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    const ctor = this.#ctor;
    const flag = COMMON_FLAGS[name] ?? ctor.flags[name];
    if (flag !== undefined) {
      this.classList.toggle(flag, value !== null);
      return;
    }
    const choice = ctor.choices[name];
    if (choice) this.applyChoice(name, choice, value);
  }

  /** Adds the `parts` classes to matching direct children. */
  protected classifyChildren(): void {
    const entries = Object.entries(this.#ctor.parts);
    for (const child of this.children) {
      for (const [selector, cls] of entries) if (child.matches(selector)) child.classList.add(cls);
    }
  }

  protected applyChoice(name: string, { prefix, values, multiple }: Choice, value: string | null): void {
    for (const v of values) this.classList.remove(`${prefix}${v}`);
    if (value === null) return;
    const tokens = multiple ? value.split(/\s+/).filter(Boolean) : [value.trim()];
    for (const token of tokens) {
      if ((values as readonly string[]).includes(token)) this.classList.add(`${prefix}${token}`);
      else this.warn(`attribute ${name}="${token}" is invalid and ignored`);
    }
  }

  protected warn(message: string): void {
    console.warn(`<${this.localName}> ${message}`);
  }

  protected setData(name: string, value: string | number | null): void {
    if (value === null) this.removeAttribute(`data-sb-${name}`);
    else this.setAttribute(`data-sb-${name}`, String(value));
  }

  protected setProp(name: string, value: string | number | null): void {
    if (value === null) this.style.removeProperty(name);
    else this.style.setProperty(name, String(value));
  }

  /** Returns null for a missing attribute, and warns and returns null for an invalid one. */
  protected parse<T>(name: string, value: string | null, parser: (v: string | null) => T | null): T | null {
    if (value === null) return null;
    const parsed = parser(value);
    if (parsed === null) this.warn(`attribute ${name}="${value}" is invalid and ignored`);
    return parsed;
  }
}

const PLACEMENT_NAMES = Object.keys(PLACEMENT_RANGE) as PlacementName[];

function isPlacement(name: string): name is PlacementName {
  return Object.hasOwn(PLACEMENT_RANGE, name);
}

/** Base class for direct children of the column grid; maps `span`, `y`, `x`, `w` to `data-sb-*`. */
export abstract class PlacedElement extends ShinbunElement {
  static override get observedAttributes(): string[] {
    return [...super.observedAttributes, ...PLACEMENT_NAMES];
  }

  override attributeChangedCallback(name: string, old: string | null, value: string | null): void {
    if (isPlacement(name)) this.setData(name, this.parse(name, value, (v) => parseIntInRange(v, PLACEMENT_RANGE[name])));
    else super.attributeChangedCallback(name, old, value);
  }

  get span(): number | null {
    return this.#int("span");
  }
  set span(value: number | null) {
    this.#set("span", value);
  }

  get y(): number | null {
    return this.#int("y");
  }
  set y(value: number | null) {
    this.#set("y", value);
  }

  get x(): number | null {
    return this.#int("x");
  }
  set x(value: number | null) {
    this.#set("x", value);
  }

  get w(): number | null {
    return this.#int("w");
  }
  set w(value: number | null) {
    this.#set("w", value);
  }

  #int(name: PlacementName): number | null {
    return parseIntInRange(this.getAttribute(name), PLACEMENT_RANGE[name]);
  }

  #set(name: PlacementName, value: number | null): void {
    if (value === null) this.removeAttribute(name);
    else this.setAttribute(name, String(value));
  }
}

/** Sets `aria-level` from a `level` attribute (1-6, default 2) unless the author set `aria-level`. */
export function applyLevel(el: ShinbunElement, value: string | null): void {
  const level = value === null ? null : parseIntInRange(value, { min: 1, max: 6 });
  if (value !== null && level === null) console.warn(`<${el.localName}> attribute level="${value}" is invalid and ignored`);
  el.setAttribute("aria-level", String(level ?? 2));
}

/** Runs after parsing; children are not available while the document is still loading. */
export function whenParsed(callback: () => void): void {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", callback, { once: true });
  else callback();
}
