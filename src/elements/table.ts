import { PlacedElement } from "../internal/base.ts";

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
  static override defaultTag = "shinbun-table";
  static override extraAttributes = ["tv"];

  #observer: MutationObserver | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    this.#sync();
    this.#observer ??= new MutationObserver(() => this.#sync());
    this.#observer.observe(this, { childList: true, subtree: true, attributes: true, attributeFilter: ["num"] });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#observer?.disconnect();
  }

  override attributeChangedCallback(name: string, old: string | null, value: string | null): void {
    if (name === "tv") this.#sync();
    else super.attributeChangedCallback(name, old, value);
  }

  #sync(): void {
    for (const table of this.querySelectorAll("table")) {
      table.classList.add("sb-table");
      table.classList.toggle("sb-table--tv", this.hasAttribute("tv"));
    }
    for (const cell of this.querySelectorAll("td, th")) cell.classList.toggle("sb-num", cell.hasAttribute("num"));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "shinbun-table": ShinbunTable;
  }
}
