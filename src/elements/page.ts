import { ShinbunElement } from "../internal/base.ts";

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
  static override defaultTag = "shinbun-page";
  static override block = "sb-page";
  static override flags = { grid: "sb-page--grid" };

  #resize: ResizeObserver | null = null;
  #mutation: MutationObserver | null = null;
  #managedTabindex = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.#resize ??= new ResizeObserver(() => this.#syncFocusable());
    this.#resize.observe(this);
    // the host box does not change when only the content grows or shrinks
    this.#mutation ??= new MutationObserver(() => this.#syncFocusable());
    this.#mutation.observe(this, { childList: true, subtree: true, characterData: true });
    this.#syncFocusable();
    // layout can settle after connection (styles, fonts, nested tables)
    requestAnimationFrame(() => this.#syncFocusable());
    void document.fonts?.ready.then(() => this.#syncFocusable());
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#resize?.disconnect();
    this.#mutation?.disconnect();
  }

  // A scrollable region must be reachable by keyboard; an author-set tabindex is left alone
  #syncFocusable(): void {
    const { overflowX, overflowY } = getComputedStyle(this);
    const user = (overflow: string) => overflow === "auto" || overflow === "scroll";
    const scrollable =
      (user(overflowX) && this.scrollWidth > this.clientWidth + 1) || (user(overflowY) && this.scrollHeight > this.clientHeight + 1);
    if (scrollable && !this.hasAttribute("tabindex")) {
      this.setAttribute("tabindex", "0");
      this.#managedTabindex = true;
    } else if (!scrollable && this.#managedTabindex) {
      this.removeAttribute("tabindex");
      this.#managedTabindex = false;
    }
  }

  get grid(): boolean {
    return this.hasAttribute("grid");
  }
  set grid(value: boolean) {
    this.toggleAttribute("grid", value);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "shinbun-page": ShinbunPage;
  }
}
