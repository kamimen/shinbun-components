# shinbun-components

Web Components for laying out Japanese newspaper pages with HTML tags alone. Built on [shinbun-css](https://github.com/kamimen/shinbun-css), with no runtime dependencies.

[日本語](README.md) | English

```html
<shinbun-paper dan="6" chars="10" auto-tcy>
  <shinbun-page>
    <shinbun-article span="6" lead>
      <shinbun-headline size="l">Headline</shinbun-headline>
      <p>Body text.</p>
    </shinbun-article>
  </shinbun-page>
</shinbun-paper>
```

## Features

- Vertical or horizontal writing, switched by an attribute (`writing`), or automatically by viewport width (`responsive`)
- Multi-column articles with headlines and photos spanning all columns
- Coordinate placement: fit articles into rectangles of "columns × lines", and find overflowing ones with `overflow()`
- Tate-chu-yoko for two-digit numbers (`auto-tcy`)
- No dependencies. About 14 KB of JS (about 5 KB gzipped) and 16 KB of CSS (about 4 KB gzipped)
- Light DOM (no Shadow DOM), so CSS works as it does with plain HTML

## Usage

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/kamimen/shinbun-components@v0.1.0/dist/shinbun-components.min.css" />
<script type="module" src="https://cdn.jsdelivr.net/gh/kamimen/shinbun-components@v0.1.0/dist/shinbun-components.min.js"></script>
```

The CSS already contains shinbun-css v0.1.0. With a bundler:

```sh
npm install github:kamimen/shinbun-components#v0.1.0
```

```js
import "shinbun-components/define";
import "shinbun-components/css";
```

## Elements

Every one of the 59 classes in shinbun-css v0.1.0 is produced by an element or an attribute (the mapping is [`src/coverage.json`](src/coverage.json), checked by the browser tests).

| Group | Elements |
|---|---|
| Paper | `shinbun-paper`, `shinbun-page` |
| Nameplate and folio | `shinbun-masthead`, `shinbun-nameplate`, `shinbun-folio` |
| Article | `shinbun-article` (`lead`, `editorial`, `column`) |
| Headlines | `shinbun-headline`, `shinbun-kicker`, `shinbun-sleeve`, `shinbun-sub`, `shinbun-yoko` |
| Text | `shinbun-lead`, `shinbun-dateline`, `shinbun-byline`, `shinbun-paragraph` (`flush`) |
| Photo | `shinbun-photo` |
| Box, ad, table | `shinbun-box`, `shinbun-ad` (`kind`, space-separated), `shinbun-table` (wraps a real `table`) |
| Rules and characters | `shinbun-rule`, `shinbun-emphasis`, `shinbun-tcy`, `shinbun-sideways`, `shinbun-horizontal` |

Every element also accepts the utility attributes `gothic` and `nowrap`. See the [API documentation](https://kamimen.github.io/shinbun-components/) for attributes, properties, methods and CSS custom properties.

In vertical writing the image height of `shinbun-photo` is the column length, so `ratio` sets the width relative to it (`1 / 3` is slim).

## Browser support

shinbun-css requires `@layer`, CSS nesting and `light-dark()`: Chrome 123, Firefox 120 or Safari 17.5 and later (as stated by shinbun-css).

| Browser | Status |
|---|---|
| Google Chrome 154 | Verified: 144 browser tests and the example pages |
| WebKit 27.2 (Playwright build, the Safari engine) | Verified: 144 browser tests |
| Firefox | **Not verified.** Tests are configured, but the Playwright build of Firefox does not start on the author's machine (macOS 27) |

Reports from Safari and Firefox are welcome.

## Limitations

The limitations of shinbun-css apply: no column-spanning inside a column, no automatic placement of articles, and no vertical tables.

## License

[MIT License](LICENSE). Unrelated to any real newspaper company. All newspaper names, people, organizations and events in the examples are fictional.
