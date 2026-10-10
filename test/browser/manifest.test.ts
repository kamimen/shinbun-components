import { expect } from "@open-wc/testing";
import "../../src/define.ts";

interface Declaration {
  tagName?: string;
  attributes?: { name: string }[];
}

const manifest = (await (await fetch("/custom-elements.json")).json()) as { modules: { declarations?: Declaration[] }[] };
const declarations = manifest.modules.flatMap((m) => m.declarations ?? []).filter((d) => d.tagName);

/** Utility attributes every element accepts; documented once in the README, not per element */
const COMMON = ["gothic", "nowrap"];

describe("custom-elements.json", () => {
  it("lists every registered shinbun element", () => {
    const tags = declarations.map((d) => d.tagName!).sort();
    expect(tags.length).to.be.greaterThan(20);
    for (const tag of tags) expect(customElements.get(tag), tag).to.exist;
  });

  for (const decl of declarations) {
    it(`${decl.tagName}: documented attributes match observedAttributes`, () => {
      const ctor = customElements.get(decl.tagName!) as unknown as { observedAttributes: string[] };
      const observed = ctor.observedAttributes.filter((a) => !COMMON.includes(a)).sort();
      const documented = (decl.attributes ?? []).map((a) => a.name).sort();
      expect(documented).to.deep.equal(observed);
      for (const a of COMMON) expect(ctor.observedAttributes, a).to.include(a);
    });
  }
});
