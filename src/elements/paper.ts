import { ShinbunElement, whenParsed } from "../internal/base.ts";
import { findOverflow } from "../internal/overflow.ts";
import { autoTcy } from "../internal/tcy.ts";
import { parseEnum, parseLength, parsePositiveInt } from "../internal/validate.ts";

const WRITING = ["vertical", "horizontal"] as const;
const THEME = ["light", "dark", "auto"] as const;

export type Writing = (typeof WRITING)[number];
export type Theme = (typeof THEME)[number];

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
  static override defaultTag = "shinbun-paper";

  static override block = "sb-paper";
  static override choices = { preset: { prefix: "sb-paper--", values: ["15dan", "12dan"] } };
  static override extraAttributes = ["writing", "theme", "debug", "responsive", "auto-tcy", "dan", "dan-h", "chars", "lines", "font-size"];

  #stopResponsive: (() => void) | null = null;

  get writing(): Writing {
    return this.getAttribute("data-sb-writing") === "horizontal" ? "horizontal" : "vertical";
  }
  set writing(value: Writing) {
    this.setAttribute("writing", value);
  }

  get theme(): Theme | null {
    return parseEnum(this.getAttribute("theme"), THEME);
  }
  set theme(value: Theme | null) {
    if (value === null) this.removeAttribute("theme");
    else this.setAttribute("theme", value);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.#syncResponsive();
    this.#syncTcy();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#stopResponsive?.();
    this.#stopResponsive = null;
  }

  override attributeChangedCallback(name: string, old: string | null, value: string | null): void {
    switch (name) {
      case "writing":
        // responsive takes precedence over writing
        if (!this.hasAttribute("responsive")) this.#applyWriting(this.parse(name, value, (v) => parseEnum(v, WRITING)));
        break;
      case "theme":
        this.setData("theme", this.parse(name, value, (v) => parseEnum(v, THEME)));
        break;
      case "debug":
        this.setData("debug", value === null ? null : "");
        break;
      case "responsive":
        this.#syncResponsive();
        break;
      case "auto-tcy":
        this.#syncTcy();
        break;
      case "dan":
        this.#dan = this.parse(name, value, parsePositiveInt);
        this.#applyDan();
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

  #dan: number | null = null;

  #applyWriting(writing: Writing | null): void {
    this.setData("writing", writing);
    this.#applyDan();
  }

  // Horizontal writing derives --sb-dan from --sb-dan-h; an inline --sb-dan would override it.
  #applyDan(): void {
    this.setProp("--sb-dan", this.writing === "horizontal" ? null : this.#dan);
  }

  #syncResponsive(): void {
    const wasResponsive = this.#stopResponsive !== null;
    this.#stopResponsive?.();
    this.#stopResponsive = null;
    if (!this.hasAttribute("responsive")) {
      if (wasResponsive) this.#applyWriting(parseEnum(this.getAttribute("writing"), WRITING));
      return;
    }
    const value = this.getAttribute("responsive");
    const breakpoint = value === "" || value === null ? DEFAULT_BREAKPOINT : (Number(value) || DEFAULT_BREAKPOINT);
    const mq = matchMedia(`(min-width: ${breakpoint}px)`);
    const apply = () => this.#applyWriting(mq.matches ? "vertical" : "horizontal");
    apply();
    mq.addEventListener("change", apply);
    this.#stopResponsive = () => mq.removeEventListener("change", apply);
  }

  #syncTcy(): void {
    if (this.hasAttribute("auto-tcy") && this.isConnected) whenParsed(() => this.applyTcy());
  }

  /** Wraps two-digit numbers in `sb-tcy` spans. Returns the number of spans added. */
  applyTcy(): number {
    return autoTcy(this);
  }

  /** Returns articles in the coordinate grid whose text overflows the box. */
  overflow(): Element[] {
    return findOverflow(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "shinbun-paper": ShinbunPaper;
  }
}
