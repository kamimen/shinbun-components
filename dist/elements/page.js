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
var _ShinbunPage_instances, _ShinbunPage_resize, _ShinbunPage_mutation, _ShinbunPage_managedTabindex, _ShinbunPage_syncFocusable;
import { ShinbunElement } from "../internal/base.js";
/**
 * Page grid. Lays out articles and photos in columns.
 *
 * @element shinbun-page
 *
 * @attr {boolean} grid - Coordinate grid: fix the line axis too and fit articles into rectangles
 *
 * @slot - shinbun-article, shinbun-photo, shinbun-nameplate, shinbun-box
 *
 * The page becomes keyboard-focusable (`tabindex="0"`) while its content scrolls.
 *
 * @cssprop --sb-dan - Columns per page in vertical writing
 * @cssprop --sb-lines - Lines in the coordinate grid
 */
export class ShinbunPage extends ShinbunElement {
    constructor() {
        super(...arguments);
        _ShinbunPage_instances.add(this);
        _ShinbunPage_resize.set(this, null);
        _ShinbunPage_mutation.set(this, null);
        _ShinbunPage_managedTabindex.set(this, false);
    }
    connectedCallback() {
        super.connectedCallback();
        __classPrivateFieldSet(this, _ShinbunPage_resize, __classPrivateFieldGet(this, _ShinbunPage_resize, "f") ?? new ResizeObserver(() => __classPrivateFieldGet(this, _ShinbunPage_instances, "m", _ShinbunPage_syncFocusable).call(this)), "f");
        __classPrivateFieldGet(this, _ShinbunPage_resize, "f").observe(this);
        // the host box does not change when only the content grows or shrinks
        __classPrivateFieldSet(this, _ShinbunPage_mutation, __classPrivateFieldGet(this, _ShinbunPage_mutation, "f") ?? new MutationObserver(() => __classPrivateFieldGet(this, _ShinbunPage_instances, "m", _ShinbunPage_syncFocusable).call(this)), "f");
        __classPrivateFieldGet(this, _ShinbunPage_mutation, "f").observe(this, { childList: true, subtree: true, characterData: true });
        __classPrivateFieldGet(this, _ShinbunPage_instances, "m", _ShinbunPage_syncFocusable).call(this);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        __classPrivateFieldGet(this, _ShinbunPage_resize, "f")?.disconnect();
        __classPrivateFieldGet(this, _ShinbunPage_mutation, "f")?.disconnect();
    }
    get grid() {
        return this.hasAttribute("grid");
    }
    set grid(value) {
        this.toggleAttribute("grid", value);
    }
}
_ShinbunPage_resize = new WeakMap(), _ShinbunPage_mutation = new WeakMap(), _ShinbunPage_managedTabindex = new WeakMap(), _ShinbunPage_instances = new WeakSet(), _ShinbunPage_syncFocusable = function _ShinbunPage_syncFocusable() {
    const { overflowX, overflowY } = getComputedStyle(this);
    const user = (overflow) => overflow === "auto" || overflow === "scroll";
    const scrollable = (user(overflowX) && this.scrollWidth > this.clientWidth + 1) || (user(overflowY) && this.scrollHeight > this.clientHeight + 1);
    if (scrollable && !this.hasAttribute("tabindex")) {
        this.setAttribute("tabindex", "0");
        __classPrivateFieldSet(this, _ShinbunPage_managedTabindex, true, "f");
    }
    else if (!scrollable && __classPrivateFieldGet(this, _ShinbunPage_managedTabindex, "f")) {
        this.removeAttribute("tabindex");
        __classPrivateFieldSet(this, _ShinbunPage_managedTabindex, false, "f");
    }
};
ShinbunPage.defaultTag = "shinbun-page";
ShinbunPage.block = "sb-page";
ShinbunPage.flags = { grid: "sb-page--grid" };
