# Changelog

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.1.1] - 2026-10-11

### Added

- Published to npm (`npm install @kamimen/shinbun-components`), with provenance from the Release workflow
- `publishConfig`, `homepage` and `bugs` in `package.json`; the `engines` field is removed because this is a browser library

### Fixed

- `shinbun-table` inside a vertical page: the table inherited vertical writing and was pushed off the page
- Horizontal pages had no padding, so text touched the edge of the paper
- A scrolling `shinbun-page` is made keyboard-focusable again after layout settles
- The starter example no longer puts a photo inside an article, where it spanned every column

## [0.1.0] - 2026-10-11

### Added

- 24 elements covering all 59 classes of shinbun-css v0.1.0: `shinbun-paper`, `-page`, `-masthead`, `-nameplate`, `-folio`, `-article`, `-headline`, `-kicker`, `-sleeve`, `-sub`, `-yoko`, `-lead`, `-dateline`, `-byline`, `-paragraph`, `-photo`, `-box`, `-ad`, `-table`, `-rule`, `-emphasis`, `-tcy`, `-sideways`, `-horizontal`
- Modifiers as attributes (`lead`, `editorial`, `column`, `preset`, `kind`, `reverse`, `flush`, `double`, `tv`, ...) and the utility attributes `gothic` and `nowrap` on every element
- Writing mode (`writing`), automatic switching by viewport width (`responsive`), theme (`theme`) and tate-chu-yoko (`auto-tcy`)
- Validation of attributes (placement `span`/`y`/`x`/`w`, lengths, ratios, enums) with console warnings, and `overflow()` for the coordinate grid
- Roles and `aria-level` on headings, articles, figures, boxes, ads and rules; scrolling pages are keyboard-focusable
- `shinbun-paper` is hidden until defined (only when scripting is enabled); photos placed in the page without `w` keep their ratio
- Type definitions (`.d.ts`) and `custom-elements.json`
- CSS bundling shinbun-css v0.1.0 (`dist/shinbun-components.css`) and its class manifest (`src/css/shinbun-css.manifest.json`)
- API documentation generator (`npm run docs`) and example pages
- Tests: 12 unit tests, 144 browser tests (Chromium, Firefox and WebKit) including a check that every shinbun-css class is produced, axe accessibility checks on the example pages, and a pack test that installs the tarball and type-checks a consumer. CI runs all three on Linux.
