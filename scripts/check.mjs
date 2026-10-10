// Checks that the source, custom-elements.json, docs, examples and dist agree. Run after build.
import { existsSync, readFileSync, readdirSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (p) => readFileSync(new URL(p, root), "utf8");
const errors = [];
const fail = (msg) => errors.push(msg);

const pkg = JSON.parse(read("package.json"));
if (!existsSync(new URL("custom-elements.json", root))) {
  console.error("custom-elements.json not found. Run npm run build first");
  process.exit(1);
}
const manifest = JSON.parse(read("custom-elements.json"));

// every element in the source must be in the manifest, and the other way round.
// Attributes are compared in the browser tests, which can read observedAttributes.
const declarations = manifest.modules.flatMap((m) => m.declarations ?? []).filter((d) => d.tagName);
const byTag = new Map(declarations.map((d) => [d.tagName, d]));

const sourceTags = new Set();
for (const f of readdirSync(new URL("src/elements/", root)).filter((f) => f.endsWith(".ts"))) {
  for (const m of read(`src/elements/${f}`).matchAll(/static override defaultTag = "([a-z-]+)"/g)) sourceTags.add(m[1]);
}
for (const tag of sourceTags) if (!byTag.has(tag)) fail(`${tag}: not in custom-elements.json`);
for (const tag of byTag.keys()) if (!sourceTags.has(tag)) fail(`${tag}: in the manifest but not in the source`);

const defineSrc = read("src/define.ts");
const registered = new Set([...defineSrc.matchAll(/(Shinbun[A-Za-z]+)\.define\(\)/g)].map((m) => m[1]));
const classes = new Set();
for (const f of readdirSync(new URL("src/elements/", root)).filter((f) => f.endsWith(".ts"))) {
  for (const m of read(`src/elements/${f}`).matchAll(/export class (Shinbun[A-Za-z]+)/g)) classes.add(m[1]);
}
for (const c of classes) if (!registered.has(c)) fail(`${c}: not registered in src/define.ts`);

// every shinbun-css class must have a way to get it from an element (verified in the browser tests)
const upstream = JSON.parse(read("src/css/shinbun-css.manifest.json")).classes.map((c) => c.name);
const coverage = JSON.parse(read("src/coverage.json")).classes;
for (const name of upstream) if (!coverage[name]) fail(`coverage.json: no mapping for upstream class ${name}`);
for (const name of Object.keys(coverage)) if (!upstream.includes(name)) fail(`coverage.json: ${name} is not an upstream class`);

// tags and attributes used in docs and examples must exist
const GLOBAL_ATTR = /^(id|class|style|role|lang|title|slot|hidden|dir|tabindex|gothic|nowrap|data-.+|aria-.+)$/;
function checkMarkup(label, text) {
  for (const m of text.matchAll(/<(shinbun-[a-z]+)((?:\s+[^<>]*?)?)\/?>/g)) {
    const tag = m[1];
    const decl = byTag.get(tag);
    if (!decl) {
      fail(`${label}: <${tag}> does not exist`);
      continue;
    }
    const known = new Set((decl.attributes ?? []).map((a) => a.name));
    for (const a of m[2].matchAll(/\s([a-z][a-z0-9-]*)(?==|\s|$)/g)) {
      if (!known.has(a[1]) && !GLOBAL_ATTR.test(a[1])) fail(`${label}: <${tag}> has unknown attribute ${a[1]}`);
    }
  }
}
for (const [name, entry] of Object.entries(coverage)) checkMarkup(`coverage.json ${name}`, entry.html);
const markupFiles = ["README.md", "README_en.md", ...walk("docs", ".md"), ...walk("site/examples", ".html"), ...walk("site/snippets", ".html")];
for (const f of markupFiles) if (existsSync(new URL(f, root))) checkMarkup(f, read(f));

function walk(dir, ext) {
  const base = new URL(`${dir}/`, root);
  if (!existsSync(base)) return [];
  return readdirSync(base, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(`${dir}/${e.name}`, ext) : e.name.endsWith(ext) ? [`${dir}/${e.name}`] : [],
  );
}

// banner versions
for (const f of ["dist/shinbun-components.css", "dist/shinbun-components.min.css", "dist/shinbun-components.min.js", "dist/index.js", "dist/define.js"]) {
  const head = existsSync(new URL(f, root)) ? read(f).slice(0, 120) : "";
  if (!head.includes(`shinbun-components v${pkg.version}`)) fail(`${f}: banner version does not match package.json (${pkg.version})`);
}
if (!read("CHANGELOG.md").includes(`## [${pkg.version}]`) && !/## \[Unreleased\]/.test(read("CHANGELOG.md"))) {
  fail(`CHANGELOG.md has no heading for ${pkg.version}`);
}

// the CDN bundle must register every element (regression: sideEffects dropped the registration)
const bundle = read("dist/shinbun-components.min.js");
for (const tag of sourceTags.keys()) {
  if (!bundle.includes(`"${tag}"`)) fail(`dist/shinbun-components.min.js does not register ${tag}`);
}
if (!/customElements/.test(bundle)) fail("dist/shinbun-components.min.js has no customElements registration");

// vendored shinbun-css version must match package.json
const vendored = read("src/css/shinbun.css").slice(0, 80);
const recorded = pkg.shinbunCss?.version;
if (!recorded) fail("package.json has no shinbunCss.version");
else if (!vendored.includes(`shinbun.css v${recorded}`)) fail(`src/css/shinbun.css version does not match shinbunCss.version (${recorded})`);

// exports must point to existing files
for (const target of Object.values(pkg.exports).flatMap((v) => (typeof v === "string" ? [v] : Object.values(v)))) {
  if (typeof target === "string" && !existsSync(new URL(target, root))) fail(`exports target ${target} does not exist`);
}

if (errors.length) {
  console.error(`✖ ${errors.length} problem(s)\n${errors.map((e) => `  - ${e}`).join("\n")}`);
  process.exit(1);
}
console.log(`✔ check: ${sourceTags.size} elements, ${markupFiles.filter((f) => existsSync(new URL(f, root))).length} docs and examples`);
