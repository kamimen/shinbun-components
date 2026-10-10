var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _ShinbunElement_instances, _a, _ShinbunElement_observer, _ShinbunElement_ctor_get, _PlacedElement_instances, _PlacedElement_int, _PlacedElement_set;
import { PLACEMENT_RANGE, parseIntInRange } from "./validate.js";
/** Utility classes available on every element as boolean attributes. */
const COMMON_FLAGS = { gothic: "sb-gothic", nowrap: "sb-nowrap" };
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
export class ShinbunElement extends HTMLElement {
    constructor() {
        super(...arguments);
        _ShinbunElement_instances.add(this);
        _ShinbunElement_observer.set(this, null);
    }
    static get observedAttributes() {
        return [...Object.keys(COMMON_FLAGS), ...Object.keys(this.flags), ...Object.keys(this.choices), ...this.extraAttributes];
    }
    /** Registers the element. Safe to call twice; the tag name can be changed. */
    static define(tag = this.defaultTag, registry = customElements) {
        if (registry.get(tag) === this)
            return;
        try {
            registry.define(tag, this);
        }
        catch (error) {
            throw new Error(`Cannot define <${tag}>: it is already registered by another copy of shinbun-components (or the class is registered under another tag). Load the library once.`, { cause: error });
        }
    }
    connectedCallback() {
        const ctor = __classPrivateFieldGet(this, _ShinbunElement_instances, "a", _ShinbunElement_ctor_get);
        if (ctor.block)
            this.classList.add(ctor.block);
        if (ctor.role && !this.hasAttribute("role"))
            this.setAttribute("role", ctor.role);
        if (Object.keys(ctor.parts).length > 0) {
            this.classifyChildren();
            __classPrivateFieldSet(this, _ShinbunElement_observer, __classPrivateFieldGet(this, _ShinbunElement_observer, "f") ?? new MutationObserver(() => this.classifyChildren()), "f");
            __classPrivateFieldGet(this, _ShinbunElement_observer, "f").observe(this, { childList: true });
        }
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _ShinbunElement_observer, "f")?.disconnect();
    }
    attributeChangedCallback(name, _old, value) {
        const ctor = __classPrivateFieldGet(this, _ShinbunElement_instances, "a", _ShinbunElement_ctor_get);
        const flag = COMMON_FLAGS[name] ?? ctor.flags[name];
        if (flag !== undefined) {
            this.classList.toggle(flag, value !== null);
            return;
        }
        const choice = ctor.choices[name];
        if (choice)
            this.applyChoice(name, choice, value);
    }
    /** Adds the `parts` classes to matching direct children. */
    classifyChildren() {
        const entries = Object.entries(__classPrivateFieldGet(this, _ShinbunElement_instances, "a", _ShinbunElement_ctor_get).parts);
        for (const child of this.children) {
            for (const [selector, cls] of entries)
                if (child.matches(selector))
                    child.classList.add(cls);
        }
    }
    applyChoice(name, { prefix, values, multiple }, value) {
        for (const v of values)
            this.classList.remove(`${prefix}${v}`);
        if (value === null)
            return;
        const tokens = multiple ? value.split(/\s+/).filter(Boolean) : [value.trim()];
        for (const token of tokens) {
            if (values.includes(token))
                this.classList.add(`${prefix}${token}`);
            else
                this.warn(`attribute ${name}="${token}" is invalid and ignored`);
        }
    }
    warn(message) {
        console.warn(`<${this.localName}> ${message}`);
    }
    setData(name, value) {
        if (value === null)
            this.removeAttribute(`data-sb-${name}`);
        else
            this.setAttribute(`data-sb-${name}`, String(value));
    }
    setProp(name, value) {
        if (value === null)
            this.style.removeProperty(name);
        else
            this.style.setProperty(name, String(value));
    }
    /** Returns null for a missing attribute, and warns and returns null for an invalid one. */
    parse(name, value, parser) {
        if (value === null)
            return null;
        const parsed = parser(value);
        if (parsed === null)
            this.warn(`attribute ${name}="${value}" is invalid and ignored`);
        return parsed;
    }
}
_a = ShinbunElement, _ShinbunElement_observer = new WeakMap(), _ShinbunElement_instances = new WeakSet(), _ShinbunElement_ctor_get = function _ShinbunElement_ctor_get() {
    return this.constructor;
};
ShinbunElement.defaultTag = "";
ShinbunElement.block = "";
ShinbunElement.role = null;
ShinbunElement.flags = {};
ShinbunElement.choices = {};
ShinbunElement.parts = {};
ShinbunElement.extraAttributes = [];
const PLACEMENT_NAMES = Object.keys(PLACEMENT_RANGE);
function isPlacement(name) {
    return Object.hasOwn(PLACEMENT_RANGE, name);
}
/** Base class for direct children of the column grid; maps `span`, `y`, `x`, `w` to `data-sb-*`. */
export class PlacedElement extends ShinbunElement {
    constructor() {
        super(...arguments);
        _PlacedElement_instances.add(this);
    }
    static get observedAttributes() {
        return [...super.observedAttributes, ...PLACEMENT_NAMES];
    }
    attributeChangedCallback(name, old, value) {
        if (isPlacement(name))
            this.setData(name, this.parse(name, value, (v) => parseIntInRange(v, PLACEMENT_RANGE[name])));
        else
            super.attributeChangedCallback(name, old, value);
    }
    get span() {
        return __classPrivateFieldGet(this, _PlacedElement_instances, "m", _PlacedElement_int).call(this, "span");
    }
    set span(value) {
        __classPrivateFieldGet(this, _PlacedElement_instances, "m", _PlacedElement_set).call(this, "span", value);
    }
    get y() {
        return __classPrivateFieldGet(this, _PlacedElement_instances, "m", _PlacedElement_int).call(this, "y");
    }
    set y(value) {
        __classPrivateFieldGet(this, _PlacedElement_instances, "m", _PlacedElement_set).call(this, "y", value);
    }
    get x() {
        return __classPrivateFieldGet(this, _PlacedElement_instances, "m", _PlacedElement_int).call(this, "x");
    }
    set x(value) {
        __classPrivateFieldGet(this, _PlacedElement_instances, "m", _PlacedElement_set).call(this, "x", value);
    }
    get w() {
        return __classPrivateFieldGet(this, _PlacedElement_instances, "m", _PlacedElement_int).call(this, "w");
    }
    set w(value) {
        __classPrivateFieldGet(this, _PlacedElement_instances, "m", _PlacedElement_set).call(this, "w", value);
    }
}
_PlacedElement_instances = new WeakSet(), _PlacedElement_int = function _PlacedElement_int(name) {
    return parseIntInRange(this.getAttribute(name), PLACEMENT_RANGE[name]);
}, _PlacedElement_set = function _PlacedElement_set(name, value) {
    if (value === null)
        this.removeAttribute(name);
    else
        this.setAttribute(name, String(value));
};
/** Sets `aria-level` from a `level` attribute (1-6, default 2) unless the author set `aria-level`. */
export function applyLevel(el, value) {
    const level = value === null ? null : parseIntInRange(value, { min: 1, max: 6 });
    if (value !== null && level === null)
        console.warn(`<${el.localName}> attribute level="${value}" is invalid and ignored`);
    el.setAttribute("aria-level", String(level ?? 2));
}
/** Runs after parsing; children are not available while the document is still loading. */
export function whenParsed(callback) {
    if (document.readyState === "loading")
        document.addEventListener("DOMContentLoaded", callback, { once: true });
    else
        callback();
}
