# Specification

This document describes how the elements map onto shinbun-css v0.1.0. For the layout model itself (columns, line axis, writing modes), see the shinbun-css specification.

## 1. Design

- Elements use Light DOM. They never call `attachShadow`.
- On connection, each element adds a shinbun-css class to itself (`sb-paper`, `sb-page`, `sb-article`, `sb-headline`, `sb-photo`).
- Attributes are validated and mirrored to `data-sb-*` attributes or CSS custom properties. Invalid values are ignored with a console warning.
- Visual rules come from shinbun-css. `components.css` only sets `display: block` on block-level elements, hides `shinbun-paper` until defined, and fixes two cases that shinbun-css styles by tag name (paragraph indent, photos without `w`).
- Elements are registered by `define.ts` (or `Element.define(tag)`); importing the classes has no side effects.

## 2. Elements and attribute mapping

Each element adds the class in the second column to itself. Attributes are listed with what they produce.

| Element | Class | Attributes |
|---|---|---|
| `shinbun-paper` | `sb-paper` | `writing` -> `data-sb-writing`; `theme` -> `data-sb-theme`; `debug` -> `data-sb-debug`; `preset` -> `sb-paper--15dan` / `--12dan`; `responsive` -> switches `data-sb-writing` with `matchMedia`; `dan` -> `--sb-dan` (vertical only); `dan-h` -> `--sb-dan-h`; `chars` -> `--sb-chars`; `lines` -> `--sb-lines`; `font-size` -> `--sb-fs`; `auto-tcy` -> `autoTcy()` after parsing |
| `shinbun-page` | `sb-page` | `grid` -> `sb-page--grid` |
| `shinbun-masthead` | `sb-masthead` | children: `h1` -> `__title`, `[side]` -> `__side`, `[side=end]` -> `__side--end` |
| `shinbun-nameplate` | `sb-nameplate` | `horizontal` -> `--horizontal`; children: `h1` -> `__title`, `img` -> `__logo`, `p` -> `__meta`; placement |
| `shinbun-folio` | `sb-folio` | children: `[section]` -> `__section` |
| `shinbun-article` | `sb-article` | `lead` -> `--lead`; `editorial` -> `--editorial`; `column` -> `sb-column`; placement |
| `shinbun-headline` | `sb-headline` | `size` -> `--xl/l/m/s`; `level` -> `aria-level` |
| `shinbun-kicker`, `-sleeve`, `-sub` | `sb-kicker`, `sb-sleeve`, `sb-sub` | |
| `shinbun-yoko` | `sb-yoko` | `reverse` -> `--reverse`; `level` -> `aria-level`; placement |
| `shinbun-lead`, `-dateline`, `-byline` | `sb-lead`, `sb-dateline`, `sb-byline` | |
| `shinbun-paragraph` | (none) | `flush` -> `sb-flush` |
| `shinbun-photo` | `sb-photo` | `ratio` -> `--sb-photo-ratio`; children: `img` -> `__img`, `figcaption` -> `__caption`; placement |
| `shinbun-box` | `sb-box` | children: `h3` -> `__title`; placement |
| `shinbun-ad` | `sb-ad` | `kind` (space-separated) -> `sb-ad--kijishita/zen/han/zen5/han5/zen2/han2/full`; placement |
| `shinbun-table` | (none) | wraps a `table`: `table` -> `sb-table`; `tv` -> `sb-table--tv`; cells with `num` -> `sb-num`; placement |
| `shinbun-rule` | `sb-rule` | `double` -> `--double` |
| `shinbun-emphasis`, `-tcy`, `-sideways`, `-horizontal` | `sb-emphasis`, `sb-tcy`, `sb-sideways`, `sb-horizontal` | |
| every element | | `gothic` -> `sb-gothic`; `nowrap` -> `sb-nowrap` |

Placement attributes: `span` and `y` are 1-15; `x` and `w` are 1-60 -> `data-sb-span`, `-y`, `-x`, `-w`.
Other ranges: `dan`, `dan-h`, `chars` and `lines` are positive integers; `font-size` is a positive CSS length (`px`, `rem`, `em`, `pt`, `vw`, `vh`, `ch`, `cqw`); `level` is 1-6.

Roles added when `role` is not set: `article` (article), `heading` (headline, yoko), `figure` (photo), `note` (box), `group` (ad), `separator` (rule), `paragraph` (kicker, sleeve, sub, lead, dateline, byline, paragraph).

## 3. Behaviour

- **Writing mode.** `responsive` takes precedence over `writing`. Removing `responsive` restores `writing`.
- **Column count.** In horizontal writing, shinbun-css derives `--sb-dan` from `--sb-dan-h`, so the inline `--sb-dan` from `dan` is removed while the paper is horizontal and restored when it is vertical again.
- **Children.** Children listed under `parts` get their classes, including children added later. Only direct children are classified.
- **Photo in the page grid.** Without `w` the image keeps the height given by `ratio`.
- **Scrolling.** `shinbun-page` gets `tabindex="0"` while it can scroll (vertical writing scrolls sideways), so it can be reached by keyboard. An author-set `tabindex` is kept.
- **Before definition.** `shinbun-paper:not(:defined)` is hidden when scripting is enabled, to avoid an unstyled flash.
- **Accessibility.** See the roles above; an explicit `role` or `aria-level` is kept.
- **Overflow.** `shinbun-paper.overflow()` returns articles in a `grid` page whose text extends beyond the box.

## 4. Known limitations

- Before the script runs, only `shinbun-paper` is hidden; other content is unstyled until then.
- Tables are always set horizontally, and vertical tables are not supported.
- The limitations of shinbun-css apply: no column-spanning inside a column, no automatic article placement, no vertical tables.
