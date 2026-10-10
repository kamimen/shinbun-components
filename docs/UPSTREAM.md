# Suggestions for shinbun-css

Points found while building shinbun-components on shinbun-css v0.1.0. They are proposals; nothing here has been changed upstream.

1. **`autoTcy` is tied to the global `document`.** It calls `document.createTreeWalker`, so it cannot process nodes in a Shadow root or another document. Using `root.ownerDocument` fixes this. shinbun-components ships its own copy for that reason.
2. **`findOverflow` only matches `.sb-page--grid > .sb-article`.** Elements that are not `.sb-article` are never reported. Accepting a selector, or the `article` tag as the CSS already does, would help.
   It also measures `Range.getClientRects()` over the whole article, which includes the boxes of child elements. In Firefox a column-spanning headline gets a box taller than its text, so an article that fits is reported as overflowing. Measuring text nodes only avoids this; shinbun-components does so.
3. **Auto-initialisation reads `document` on load.** `[data-sb-auto-tcy]` and `[data-sb-responsive]` are applied once at load, so elements added later are ignored.
4. **Selectors depend on tag names (`article`, `figure`, `aside`, `header`).** A custom element cannot match them, so every component has to add the equivalent `.sb-*` class. Documenting the class form as the stable contract would make this explicit.
5. **Inline `--sb-dan` overrides horizontal writing.** The horizontal rule sets `--sb-dan: var(--sb-dan-h)`, which an inline `--sb-dan` silently beats. A separate property for the vertical column count would avoid the trap.
6. **No test uses a browser.** The test suite covers `splitTcy` only; layout behaviour is checked by hand in Chrome.
7. **A vertical page is left-aligned in the paper.** `.sb-page` is a vertical box inside a horizontal-tb paper, so it shrinks to its content and sits on the left instead of starting at the right edge. shinbun-components fixes this in `components.css` (`width: fit-content; margin-left: auto`).
