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
var _ShinbunPaper_instances, _ShinbunPaper_stopResponsive, _ShinbunPaper_dan, _ShinbunPaper_applyWriting, _ShinbunPaper_applyDan, _ShinbunPaper_syncResponsive, _ShinbunPaper_syncTcy;
import { ShinbunElement, whenParsed } from "../internal/base.js";
import { findOverflow } from "../internal/overflow.js";
import { autoTcy } from "../internal/tcy.js";
import { parseEnum, parseLength, parsePositiveInt } from "../internal/validate.js";
const WRITING = ["vertical", "horizontal"];
const THEME = ["light", "dark", "auto"];
const DEFAULT_BREAKPOINT = 768;
/**
 * Outer frame of a page: writing mode, theme and the page grid settings.
 *
 * @element shinbun-paper
 *
 * @attr {"vertical"|"horizontal"} writing - Writing mode (default: vertical)
 * @attr {"light"|"dark"|"auto"} theme - Color scheme
 * @attr {"15dan"|"12dan"} preset - Column preset (15 or 12 columns)
 * @attr {boolean} debug - Outline the placed items
 * @attr {number} responsive - Switch to horizontal below this viewport width in px (default: 768)
 * @attr {boolean} auto-tcy - Wrap two-digit numbers for tate-chu-yoko
 * @attr {number} dan - Columns per page in vertical writing
 * @attr {number} dan-h - Columns per page in horizontal writing
 * @attr {number} chars - Characters per column in vertical writing
 * @attr {number} lines - Lines in the coordinate grid
 * @attr {string} font-size - Body font size, e.g. 0.8rem
 *
 * @slot - shinbun-page, nameplate, folio
 *
 * @cssprop --sb-paper - Paper color
 * @cssprop --sb-ink - Text color
 * @cssprop --sb-accent - Accent color
 * @cssprop --sb-font-body - Body font
 * @cssprop --sb-gap - Gap between columns and articles
 */
export class ShinbunPaper extends ShinbunElement {
    constructor() {
        super(...arguments);
        _ShinbunPaper_instances.add(this);
        _ShinbunPaper_stopResponsive.set(this, null);
        _ShinbunPaper_dan.set(this, null);
    }
    get writing() {
        return this.getAttribute("data-sb-writing") === "horizontal" ? "horizontal" : "vertical";
    }
    set writing(value) {
        this.setAttribute("writing", value);
    }
    get theme() {
        return parseEnum(this.getAttribute("theme"), THEME);
    }
    set theme(value) {
        if (value === null)
            this.removeAttribute("theme");
        else
            this.setAttribute("theme", value);
    }
    connectedCallback() {
        super.connectedCallback();
        __classPrivateFieldGet(this, _ShinbunPaper_instances, "m", _ShinbunPaper_syncResponsive).call(this);
        __classPrivateFieldGet(this, _ShinbunPaper_instances, "m", _ShinbunPaper_syncTcy).call(this);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        __classPrivateFieldGet(this, _ShinbunPaper_stopResponsive, "f")?.call(this);
        __classPrivateFieldSet(this, _ShinbunPaper_stopResponsive, null, "f");
    }
    attributeChangedCallback(name, old, value) {
        switch (name) {
            case "writing":
                // responsive takes precedence over writing
                if (!this.hasAttribute("responsive"))
                    __classPrivateFieldGet(this, _ShinbunPaper_instances, "m", _ShinbunPaper_applyWriting).call(this, this.parse(name, value, (v) => parseEnum(v, WRITING)));
                break;
            case "theme":
                this.setData("theme", this.parse(name, value, (v) => parseEnum(v, THEME)));
                break;
            case "debug":
                this.setData("debug", value === null ? null : "");
                break;
            case "responsive":
                __classPrivateFieldGet(this, _ShinbunPaper_instances, "m", _ShinbunPaper_syncResponsive).call(this);
                break;
            case "auto-tcy":
                __classPrivateFieldGet(this, _ShinbunPaper_instances, "m", _ShinbunPaper_syncTcy).call(this);
                break;
            case "dan":
                __classPrivateFieldSet(this, _ShinbunPaper_dan, this.parse(name, value, parsePositiveInt), "f");
                __classPrivateFieldGet(this, _ShinbunPaper_instances, "m", _ShinbunPaper_applyDan).call(this);
                break;
            case "dan-h":
                this.setProp("--sb-dan-h", this.parse(name, value, parsePositiveInt));
                break;
            case "chars":
                this.setProp("--sb-chars", this.parse(name, value, parsePositiveInt));
                break;
            case "lines":
                this.setProp("--sb-lines", this.parse(name, value, parsePositiveInt));
                break;
            case "font-size":
                this.setProp("--sb-fs", this.parse(name, value, parseLength));
                break;
            default:
                super.attributeChangedCallback(name, old, value);
        }
    }
    /** Wraps two-digit numbers in `sb-tcy` spans. Returns the number of spans added. */
    applyTcy() {
        return autoTcy(this);
    }
    /** Returns articles in the coordinate grid whose text overflows the box. */
    overflow() {
        return findOverflow(this);
    }
}
_ShinbunPaper_stopResponsive = new WeakMap(), _ShinbunPaper_dan = new WeakMap(), _ShinbunPaper_instances = new WeakSet(), _ShinbunPaper_applyWriting = function _ShinbunPaper_applyWriting(writing) {
    this.setData("writing", writing);
    __classPrivateFieldGet(this, _ShinbunPaper_instances, "m", _ShinbunPaper_applyDan).call(this);
}, _ShinbunPaper_applyDan = function _ShinbunPaper_applyDan() {
    this.setProp("--sb-dan", this.writing === "horizontal" ? null : __classPrivateFieldGet(this, _ShinbunPaper_dan, "f"));
}, _ShinbunPaper_syncResponsive = function _ShinbunPaper_syncResponsive() {
    const wasResponsive = __classPrivateFieldGet(this, _ShinbunPaper_stopResponsive, "f") !== null;
    __classPrivateFieldGet(this, _ShinbunPaper_stopResponsive, "f")?.call(this);
    __classPrivateFieldSet(this, _ShinbunPaper_stopResponsive, null, "f");
    if (!this.hasAttribute("responsive")) {
        if (wasResponsive)
            __classPrivateFieldGet(this, _ShinbunPaper_instances, "m", _ShinbunPaper_applyWriting).call(this, parseEnum(this.getAttribute("writing"), WRITING));
        return;
    }
    const value = this.getAttribute("responsive");
    const breakpoint = value === "" || value === null ? DEFAULT_BREAKPOINT : (Number(value) || DEFAULT_BREAKPOINT);
    const mq = matchMedia(`(min-width: ${breakpoint}px)`);
    const apply = () => __classPrivateFieldGet(this, _ShinbunPaper_instances, "m", _ShinbunPaper_applyWriting).call(this, mq.matches ? "vertical" : "horizontal");
    apply();
    mq.addEventListener("change", apply);
    __classPrivateFieldSet(this, _ShinbunPaper_stopResponsive, () => mq.removeEventListener("change", apply), "f");
}, _ShinbunPaper_syncTcy = function _ShinbunPaper_syncTcy() {
    if (this.hasAttribute("auto-tcy") && this.isConnected)
        whenParsed(() => this.applyTcy());
};
ShinbunPaper.defaultTag = "shinbun-paper";
ShinbunPaper.block = "sb-paper";
ShinbunPaper.choices = { preset: { prefix: "sb-paper--", values: ["15dan", "12dan"] } };
ShinbunPaper.extraAttributes = ["writing", "theme", "debug", "responsive", "auto-tcy", "dan", "dan-h", "chars", "lines", "font-size"];
