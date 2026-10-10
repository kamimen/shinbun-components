// Builds the API documentation site (for GitHub Pages) in _site/ from custom-elements.json.
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const path = (p) => new URL(p, root).pathname;
const read = (p) => readFileSync(path(p), "utf8");
const write = (p, text) => {
  mkdirSync(new URL(".", new URL(p, new URL("_site/", root))).pathname, { recursive: true });
  writeFileSync(path(`_site/${p}`), text);
};

if (!existsSync(path("custom-elements.json")) || !existsSync(path("dist/shinbun-components.min.js"))) {
  console.error("Run npm run build first");
  process.exit(1);
}

const pkg = JSON.parse(read("package.json"));
const manifest = JSON.parse(read("custom-elements.json"));
const elements = manifest.modules
  .flatMap((m) => m.declarations ?? [])
  .filter((d) => d.tagName)
  .sort((a, b) => a.tagName.localeCompare(b.tagName));

const repo = "https://github.com/kamimen/shinbun-components";
const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const type = (t) => (t?.text ? `<code>${esc(t.text)}</code>` : "");

rmSync(path("_site"), { recursive: true, force: true });
mkdirSync(path("_site"), { recursive: true });
cpSync(path("dist"), path("_site/dist"), { recursive: true });
cpSync(path("site/examples"), path("_site/examples"), { recursive: true });
cpSync(path("site/style.css"), path("_site/style.css"));
cpSync(path("custom-elements.json"), path("_site/custom-elements.json"));

const layout = ({ title, body, base = "" }) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <link rel="stylesheet" href="${base}style.css" />
  <link rel="stylesheet" href="${base}dist/shinbun-components.min.css" />
  <script type="module" src="${base}dist/shinbun-components.min.js"></script>
</head>
<body>
  <header class="site"><div class="wrap">
    <a class="brand" href="${base}index.html">shinbun-components</a>
    <nav>
      <a href="${base}index.html#elements">Elements</a>
      <a href="${base}index.html#examples">Examples</a>
      <a href="${repo}">GitHub</a>
    </nav>
  </div></header>
  <main class="wrap">
${body}
  </main>
  <footer class="wrap">shinbun-components v${esc(pkg.version)} · MIT License · All people, organizations and events in the examples are fictional.</footer>
</body>
</html>
`;

const table = (head, rows) =>
  rows.length
    ? `<div class="table-wrap"><table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows
        .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
        .join("")}</tbody></table></div>`
    : "<p>None</p>";

const publicMembers = (el, kind) =>
  (el.members ?? []).filter(
    (m) => m.kind === kind && m.privacy !== "private" && !m.static && !m.name.startsWith("#") && !/Callback$/.test(m.name),
  );

function elementPage(el) {
  const snippetPath = `site/snippets/${el.tagName.replace(/^shinbun-/, "")}.html`;
  const snippet = existsSync(path(snippetPath)) ? read(snippetPath).trim() : "";
  const attrs = (el.attributes ?? []).map((a) => [`<code>${esc(a.name)}</code>`, type(a.type), esc(a.description)]);
  const props = publicMembers(el, "field").map((f) => [`<code>${esc(f.name)}</code>`, type(f.type), esc(f.description)]);
  const meths = publicMembers(el, "method").map((m) => [
    `<code>${esc(m.name)}(${(m.parameters ?? []).map((p) => esc(p.name)).join(", ")})</code>`,
    type(m.return?.type),
    esc(m.description ?? m.return?.description),
  ]);
  const slots = (el.slots ?? []).map((s) => [`<code>${s.name ? esc(s.name) : "(default)"}</code>`, esc(s.description)]);
  const cssProps = (el.cssProperties ?? []).map((c) => [`<code>${esc(c.name)}</code>`, esc(c.description)]);
  const intro = (el.description ?? "").split("\n").map((l) => l.trim()).filter(Boolean).join(" ");
  return layout({
    title: `${el.tagName} | shinbun-components`,
    base: "../",
    body: `    <h1><code>&lt;${el.tagName}&gt;</code></h1>
    <p class="lead">${esc(intro)}</p>
    ${snippet ? `<h2>Example</h2>
    <div class="preview">
${snippet}
    </div>
    <pre><code>${esc(snippet)}</code></pre>` : ""}
    <h2>Attributes</h2>
    ${table(["Name", "Type", "Description"], attrs)}
    <h2>Properties</h2>
    ${table(["Name", "Type", "Description"], props)}
    <h2>Methods</h2>
    ${table(["Name", "Returns", "Description"], meths)}
    <h2>Slots</h2>
    ${table(["Name", "Description"], slots)}
    <h2>CSS custom properties</h2>
    ${table(["Name", "Description"], cssProps)}`,
  });
}

for (const el of elements) write(`api/${el.tagName}.html`, elementPage(el));

const cdn = `https://cdn.jsdelivr.net/gh/kamimen/shinbun-components@v${pkg.version}/dist`;
write(
  "index.html",
  layout({
    title: "shinbun-components",
    body: `    <h1>shinbun-components</h1>
    <p class="lead">Lay out Japanese newspaper pages with HTML tags alone. The Web Components version of <a href="https://github.com/kamimen/shinbun-css">shinbun-css</a>, with no runtime dependencies.</p>

    <h2>Usage</h2>
    <pre><code>${esc(`<link rel="stylesheet" href="${cdn}/shinbun-components.min.css" />
<script type="module" src="${cdn}/shinbun-components.min.js"></script>

<shinbun-paper dan="6" chars="10" auto-tcy>
  <shinbun-page>
    <shinbun-article span="6" lead>
      <shinbun-headline size="l">Headline</shinbun-headline>
      <p>Body text.</p>
    </shinbun-article>
  </shinbun-page>
</shinbun-paper>`)}</code></pre>
    <p><code>v${esc(pkg.version)}</code> in the URL is a git tag. Pinning it keeps the page unchanged after later releases.</p>

    <h2 id="elements">Elements</h2>
    <p>Every element also accepts the utility attributes <code>gothic</code> and <code>nowrap</code>.</p>
    <ul class="card-list">
${elements
  .map((e) => {
    const first = (e.description ?? "").split("\n").map((l) => l.trim()).find(Boolean) ?? "";
    return `      <li><a href="api/${e.tagName}.html"><code>${e.tagName}</code></a><p>${esc(first)}</p></li>`;
  })
  .join("\n")}
    </ul>

    <h2 id="examples">Examples</h2>
    <ul>
${readdirSync(path("site/examples"))
  .filter((f) => f.endsWith(".html"))
  .sort()
  .map((f) => `      <li><a href="examples/${f}">${f}</a></li>`)
  .join("\n")}
    </ul>

    <h2>API manifest</h2>
    <p>Editors and tools can use <a href="custom-elements.json"><code>custom-elements.json</code></a> (Custom Elements Manifest).</p>`,
  }),
);

console.log(`✔ docs: wrote the index and ${elements.length} element pages to _site/`);
