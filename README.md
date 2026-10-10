# shinbun-components

Web Components for laying out Japanese newspaper pages with HTML tags alone. Built on [shinbun-css](https://github.com/kamimen/shinbun-css), with no runtime dependencies.

English | [日本語](README_ja.md)

```html
<shinbun-paper dan="6" chars="10" auto-tcy>
  <shinbun-page>
    <shinbun-article span="6" lead>
      <shinbun-headline size="l">A night library opens</shinbun-headline>
      <p>The town library will open until 9 p.m. on weekdays.</p>
    </shinbun-article>
  </shinbun-page>
</shinbun-paper>
```

[API documentation and examples](https://kamimen.github.io/shinbun-components/)

## Features

- **Vertical or horizontal writing**, switched by an attribute (`writing="horizontal"`), or automatically by viewport width (`responsive`).
- **Columns and column-spanning headlines**: an article occupies `span` columns; headlines and photos span all of them.
- **Coordinate placement**: fit articles into rectangles of "columns × lines", and find overflowing ones with `overflow()`.
- **Tate-chu-yoko**: `auto-tcy` sets two-digit numbers upright in one cell.
- **No dependencies, small**: about 14 KB of JS (about 5 KB gzipped) and 16 KB of CSS (about 4 KB gzipped).
- **Light DOM**: no Shadow DOM, so CSS works as it does with plain HTML (see [Design](#design)).

## Usage

Load from the CDN (jsDelivr), pinned to a tag so the page does not change after later releases:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/kamimen/shinbun-components@v0.1.0/dist/shinbun-components.min.css" />
<script type="module" src="https://cdn.jsdelivr.net/gh/kamimen/shinbun-components@v0.1.0/dist/shinbun-components.min.js"></script>
```

The CSS already contains [shinbun-css](https://github.com/kamimen/shinbun-css) v0.1.0; do not load it separately.

With a bundler, install from the repository tag (`dist/` is committed):

```sh
npm install github:kamimen/shinbun-components#v0.1.0
```

```js
import "shinbun-components/define"; // registers every element
import "shinbun-components/css";
```

To use other tag names, skip `define` and call `define()` on each class:

```js
import { ShinbunPaper } from "shinbun-components";
ShinbunPaper.define("my-paper");
```

## Elements

Every one of the 59 classes in shinbun-css v0.1.0 is produced by an element or an attribute. The mapping is [`src/coverage.json`](src/coverage.json), and the browser tests check each entry.

| Group | Element | Main attributes |
|---|---|---|
| Paper | `shinbun-paper` | `writing` `theme` `responsive` `auto-tcy` `dan` `dan-h` `chars` `lines` `font-size` `preset` `debug` |
| | `shinbun-page` | `grid` |
| Nameplate and folio | `shinbun-masthead`, `shinbun-folio` | |
| | `shinbun-nameplate` | `horizontal`, `span` `y` `x` `w` |
| Article | `shinbun-article` | `span` `y` `x` `w` `lead` `editorial` `column` |
| Headlines | `shinbun-headline` | `size` (xl, l, m, s), `level` |
| | `shinbun-kicker`, `shinbun-sleeve`, `shinbun-sub` | |
| | `shinbun-yoko` | `reverse` `level` `span` `y` `x` `w` |
| Text | `shinbun-lead`, `shinbun-dateline`, `shinbun-byline` | |
| | `shinbun-paragraph` | `flush` |
| Photo | `shinbun-photo` | `ratio` `span` `y` `x` `w` |
| Box, ad, table | `shinbun-box` | `span` `y` `x` `w` |
| | `shinbun-ad` | `kind` (space-separated), `span` `y` `x` `w` |
| | `shinbun-table` | `tv`, `span` `y` `x` `w`; wraps a real `table` |
| Rules and characters | `shinbun-rule` | `double` |
| | `shinbun-emphasis`, `shinbun-tcy`, `shinbun-sideways`, `shinbun-horizontal` | |

Every element also accepts the utility attributes `gothic` and `nowrap`. See the [API documentation](https://kamimen.github.io/shinbun-components/) for attributes, properties, methods and CSS custom properties.

In vertical writing the image height of `shinbun-photo` is the column length, so `ratio` sets the width relative to it (`1 / 3` is slim).

## Coordinate placement

Add `grid` to `shinbun-page` to fix the line axis too and fit articles into rectangles:

```html
<shinbun-paper dan="10" chars="10" lines="40">
  <shinbun-page grid>
    <shinbun-article x="1" w="20" y="1" span="5">…</shinbun-article>
    <shinbun-article x="21" w="20" y="1" span="5">…</shinbun-article>
  </shinbun-page>
</shinbun-paper>
```

In vertical writing, `y` counts columns from the top and `x` counts lines from the right. Find articles whose text does not fit:

```js
document.querySelector("shinbun-paper").overflow(); // array of overflowing articles
```

## Design

**Light DOM.** shinbun-css relies on parent-child relations: `column-span` works only on direct children of an article, and layout depends on `data-sb-writing` on an ancestor. Shadow DOM would break these. So each element only adds the shinbun-css classes and `data-sb-*` attributes to itself, and all visual rules come from shinbun-css.

- Attributes are validated. Out-of-range or invalid values are ignored with a console warning (for example `span` must be 1-15).
- Roles: headings get `role="heading"` and `aria-level`; articles `article`; photos `figure`; boxes `note`; rules `separator`. An explicit `role` wins.
- Before the script runs, `shinbun-paper` is hidden so that it does not flash unstyled (nothing is hidden when JavaScript is disabled).
- A vertical `shinbun-page` scrolls sideways, so it is keyboard-focusable (`tabindex="0"`) while it can scroll. An author-set `tabindex` wins.

Points that belong in shinbun-css are collected in [docs/UPSTREAM.md](docs/UPSTREAM.md).

## Browser support

shinbun-css requires `@layer`, CSS nesting and `light-dark()`: Chrome 123, Firefox 120 or Safari 17.5 and later (as stated by shinbun-css).

| Browser | Status |
|---|---|
| Google Chrome 154 | Verified: 144 browser tests and the example pages |
| WebKit 27.2 (Playwright build, the Safari engine) | Verified: 144 browser tests |
| Firefox | **Not verified.** Tests are configured, but the Playwright build of Firefox does not start on the author's machine (macOS 27) |

Reports from Safari and Firefox are welcome.

Text layout differs slightly between browsers: in CI, the same text needed more room in Firefox than in Chrome and WebKit. Use `overflow()` in the browsers you target, and leave some slack in coordinate-placed articles.

## Limitations

The limitations of shinbun-css apply:

- No column-spanning inside a column.
- No automatic placement of articles.
- No vertical tables (tables are always set horizontally).

## Development

```sh
npm install
npm run verify   # type check, build, consistency check, tests (unit, browser, pack), docs
SHINBUN_BROWSERS=chrome,webkit npm run test:browser   # choose browsers: chrome, firefox, webkit
```

See [docs/SPEC.md](docs/SPEC.md) for the specification, [CHANGELOG.md](CHANGELOG.md) for changes and [CONTRIBUTING.md](CONTRIBUTING.md) for how to contribute.

## License

[MIT License](LICENSE). Unrelated to any real newspaper company. All newspaper names, people, organizations and events in the examples are fictional.
