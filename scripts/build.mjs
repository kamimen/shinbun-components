// Builds dist/ and custom-elements.json.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { build, transform } from "esbuild";

const root = new URL("../", import.meta.url);
const path = (p) => new URL(p, root).pathname;
const pkg = JSON.parse(readFileSync(path("package.json"), "utf8"));
const banner = `/*! shinbun-components v${pkg.version} | MIT License | shinbun-css as Web Components */`;

const run = (bin, args) => execFileSync(path(`node_modules/.bin/${bin}`), args, { cwd: path("."), stdio: "inherit" });

rmSync(path("dist"), { recursive: true, force: true });
mkdirSync(path("dist"), { recursive: true });

// npm: unbundled ES modules and .d.ts (tsc rewrites .ts imports to .js)
run("tsc", ["-p", "tsconfig.json"]);
// tsc leaves .ts specifiers in declaration files, which consumers cannot resolve
const declarations = readdirSync(path("dist"), { recursive: true }).filter((f) => f.endsWith(".d.ts"));
for (const f of declarations) {
  const p = path(`dist/${f}`);
  writeFileSync(p, readFileSync(p, "utf8").replace(/(from "\.[^"]*)\.ts"/g, '$1.js"'));
}
for (const file of ["index", "define"]) {
  const p = path(`dist/${file}.js`);
  writeFileSync(p, `${banner}\n${readFileSync(p, "utf8")}`);
}

// CDN: a single ESM file that also registers the elements
await build({
  entryPoints: [path("src/cdn.ts")],
  outfile: path("dist/shinbun-components.min.js"),
  bundle: true,
  format: "esm",
  target: "es2021",
  minify: true,
  legalComments: "none",
  // package.json sideEffects would otherwise drop the registration import
  ignoreAnnotations: true,
  banner: { js: banner },
});

const css = ["src/css/shinbun.css", "src/css/components.css"]
  .map((f) => readFileSync(path(f), "utf8").replace(/^\/\*![^\n]*\*\/\n/, ""))
  .join("\n");
writeFileSync(path("dist/shinbun-components.css"), `${banner}\n${css}`);
const min = await transform(css, { loader: "css", minify: true });
writeFileSync(path("dist/shinbun-components.min.css"), `${banner}\n${min.code}`);

// API manifest
run("cem", ["analyze", "--config", "custom-elements-manifest.config.mjs"]);

for (const f of ["dist/shinbun-components.min.js", "dist/shinbun-components.min.css"]) {
  const buf = readFileSync(path(f));
  console.log(`${f}  ${buf.length} B (gzip ${gzipSync(buf).length} B)`);
}
