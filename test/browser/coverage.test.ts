import { expect } from "@open-wc/testing";
import { cleanup, mount } from "./helpers.ts";

interface Entry {
  html: string;
  target: string | null;
}

const { classes } = (await (await fetch("/src/coverage.json")).json()) as { classes: Record<string, Entry> };
const upstream = ((await (await fetch("/src/css/shinbun-css.manifest.json")).json()) as { classes: { name: string }[] }).classes.map(
  (c) => c.name,
);

describe("shinbun-css classes", () => {
  afterEach(cleanup);

  it("has a mapping for every upstream class", () => {
    expect(Object.keys(classes).sort()).to.deep.equal([...upstream].sort());
  });

  for (const [name, entry] of Object.entries(classes)) {
    it(`${name} is produced by ${entry.html}`, async () => {
      const root = await mount(entry.html);
      const target = entry.target ? root.querySelector(entry.target) : root;
      expect(target, "target").to.exist;
      expect(target!.classList.contains(name)).to.equal(true);
    });
  }
});
