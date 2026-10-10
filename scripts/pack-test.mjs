// Installs the packed tarball into a scratch project and checks that consumers can resolve and type-check it.
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const work = mkdtempSync(join(tmpdir(), "shinbun-pack-"));
const env = { ...process.env, npm_config_cache: join(work, "cache") };
const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, env, encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] });

try {
  const tgz = run("npm", ["pack", "--pack-destination", work, "--silent"], root).trim().split("\n").pop();
  const app = join(work, "app");
  run("mkdir", ["-p", app], work);
  writeFileSync(join(app, "package.json"), '{"name":"consumer","private":true,"type":"module"}');
  run("npm", ["install", join(work, tgz), "--no-audit", "--no-fund", "--silent"], app);

  const installed = join(app, "node_modules", "@kamimen", "shinbun-components");
  for (const f of ["dist/index.js", "dist/define.js", "dist/shinbun-components.min.css", "custom-elements.json", "README.md", "LICENSE"]) {
    if (!existsSync(join(installed, f))) throw new Error(`${f} is missing from the package`);
  }
  for (const f of ["dist/index.d.ts", "dist/define.d.ts", "dist/elements/paper.d.ts", "dist/internal/base.d.ts"]) {
    if (/from "\.[^"]*\.ts"/.test(readFileSync(join(installed, f), "utf8"))) throw new Error(`${f} imports a .ts file`);
  }

  writeFileSync(
    join(app, "consumer.ts"),
    `import "@kamimen/shinbun-components/define";
import { ShinbunPaper, ShinbunArticle, ShinbunHeadline, ShinbunAd, ShinbunTable, PlacedElement, splitTcy, type Writing } from "@kamimen/shinbun-components";

const paper: ShinbunPaper = document.createElement("shinbun-paper");
const writing: Writing = paper.writing;
paper.writing = "horizontal";
const rest: Element[] = paper.overflow();
const article = document.createElement("shinbun-article");
article.span = 4;
const level: number | null = article.y;
const headline: ShinbunHeadline = document.createElement("shinbun-headline");
headline.size = "xl";
const parts = splitTcy("10");
const ad: ShinbunAd = document.createElement("shinbun-ad");
ad.span = 5;
const table: PlacedElement = document.createElement("shinbun-table");
const kicker: HTMLElement = document.createElement("shinbun-kicker");
void [table, kicker, ShinbunTable];
ShinbunArticle.define("my-article");
export { writing, rest, level, parts };
`,
  );
  run(
    join(root, "node_modules/.bin/tsc"),
    ["--noEmit", "--strict", "--module", "esnext", "--moduleResolution", "bundler", "--target", "es2022", "--lib", "es2022,dom", "consumer.ts"],
    app,
  );
  console.log(`✔ pack-test: ${tgz} installs and type-checks`);
} finally {
  rmSync(work, { recursive: true, force: true });
}
