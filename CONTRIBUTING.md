# Contributing

```sh
npm install
npm run verify
```

`verify` runs the type check, build, consistency check, tests and docs generation. Run it before opening a PR.

## Rules

1. When you add or change an attribute, update both the JSDoc `@attr` and the static fields (`flags`, `choices`, `extraAttributes`). The browser tests fail if they disagree.
   When you add an element, add it to `src/define.ts`, `src/index.ts` and `src/coverage.json` if it produces an upstream class.
2. Do not copy shinbun-css rules into this repository's own CSS. Rules that belong to shinbun-css are fixed there; list the changes you want in [docs/UPSTREAM.md](docs/UPSTREAM.md).
3. When updating the vendored shinbun-css, change `src/css/shinbun.css` and `shinbunCss.version` in `package.json` together.
4. Examples must use fictional newspapers, people, organizations and events. Reproducing a real newspaper's logo, typeface or design is not accepted.
5. For visual changes, attach screenshots and the browser versions you checked.
6. New examples must report zero overflowing articles from `overflow()`.
7. Code comments and documents are written in English. A Japanese README is kept as `README_ja.md`.

## Browsers

Vertical writing can only be verified in a real browser. `npm run test:browser` runs Google Chrome, Firefox and WebKit (Playwright builds; run `npx playwright install firefox webkit` once). Pick a subset with `SHINBUN_BROWSERS=chrome,webkit`. Checks in Safari itself are welcome.

## Releasing

1. Update `version` in `package.json` and the heading in `CHANGELOG.md`.
2. Run `npm run verify` and commit the result, including `dist/` and `custom-elements.json` (the CDN serves `dist/` straight from the tag).
3. Tag and push: `git tag vX.Y.Z && git push origin main vX.Y.Z`.
4. The Release workflow checks that the tag matches `package.json`, runs the checks, **stages** the package on npm with provenance, attaches `dist/` as a zip and creates the GitHub Release. The Pages workflow publishes the API documentation from `main`.
5. Approve the staged package with 2FA: `npm stage list @kamimen/shinbun-components`, then `npm stage approve <stage-id>` (or use Staged Packages on npmjs.com). Only then does it appear on npm.
6. Check `https://cdn.jsdelivr.net/npm/@kamimen/shinbun-components@X.Y.Z/dist/shinbun-components.min.js` loads.

### npm setup

The workflow stages with a granular access token stored as the GitHub secret `NPM_TOKEN`. Create it on npmjs.com with **Read and write (stage only)** on the `@kamimen` scope, no organization access, and Bypass 2FA left off. Such a token can only stage, so a leaked token cannot publish; publishing always needs your 2FA at approval.

```sh
pbpaste | gh secret set NPM_TOKEN --repo kamimen/shinbun-components
```
