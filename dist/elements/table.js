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
var _ShinbunTable_instances, _ShinbunTable_observer, _ShinbunTable_sync;
import { PlacedElement } from "../internal/base.js";
/**
 * Wrapper for a real `table`. The wrapper keeps native table semantics: the inner `table` gets the
 * shinbun-css classes, and cells with `num` are right-aligned. Tables are always set horizontally.
 *
 * @element shinbun-table
 *
 * @attr {boolean} tv - Compact TV-listing style
 * @attr {number} span - Number of columns (1-15)
 * @attr {number} y - Start column (1-15)
 * @attr {number} x - Start position on the line axis (1-60)
 * @attr {number} w - Lines occupied on the line axis (1-60)
 *
 * @slot - A `table` element
 */
export class ShinbunTable extends PlacedElement {
    constructor() {
        super(...arguments);
        _ShinbunTable_instances.add(this);
        _ShinbunTable_observer.set(this, null);
    }
    connectedCallback() {
        super.connectedCallback();
        __classPrivateFieldGet(this, _ShinbunTable_instances, "m", _ShinbunTable_sync).call(this);
        __classPrivateFieldSet(this, _ShinbunTable_observer, __classPrivateFieldGet(this, _ShinbunTable_observer, "f") ?? new MutationObserver(() => __classPrivateFieldGet(this, _ShinbunTable_instances, "m", _ShinbunTable_sync).call(this)), "f");
        __classPrivateFieldGet(this, _ShinbunTable_observer, "f").observe(this, { childList: true, subtree: true, attributes: true, attributeFilter: ["num"] });
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        __classPrivateFieldGet(this, _ShinbunTable_observer, "f")?.disconnect();
    }
    attributeChangedCallback(name, old, value) {
        if (name === "tv")
            __classPrivateFieldGet(this, _ShinbunTable_instances, "m", _ShinbunTable_sync).call(this);
        else
            super.attributeChangedCallback(name, old, value);
    }
}
_ShinbunTable_observer = new WeakMap(), _ShinbunTable_instances = new WeakSet(), _ShinbunTable_sync = function _ShinbunTable_sync() {
    for (const table of this.querySelectorAll("table")) {
        table.classList.add("sb-table");
        table.classList.toggle("sb-table--tv", this.hasAttribute("tv"));
    }
    for (const cell of this.querySelectorAll("td, th"))
        cell.classList.toggle("sb-num", cell.hasAttribute("num"));
};
ShinbunTable.defaultTag = "shinbun-table";
ShinbunTable.extraAttributes = ["tv"];
