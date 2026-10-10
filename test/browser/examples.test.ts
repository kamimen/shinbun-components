import { expect } from "@open-wc/testing";
import type { ShinbunPaper } from "../../src/elements/paper.ts";
import { cleanup, mount } from "./helpers.ts";

const pages = ["starter", "front", "horizontal", "full-page"];

describe("example pages", () => {
  afterEach(cleanup);

  for (const page of pages) {
    describe(page, () => {
      let papers: string[] = [];
      before(async () => {
        const html = await (await fetch(`/site/examples/${page}.html`)).text();
        const doc = new DOMParser().parseFromString(html, "text/html");
        papers = [...doc.querySelectorAll("shinbun-paper")].map((p) => p.outerHTML);
      });

      it("has at least one paper", () => {
        expect(papers.length).to.be.greaterThan(0);
      });

      it("renders without warnings and without overflowing articles", async () => {
        const warns: string[] = [];
        const original = console.warn;
        console.warn = (m: string) => warns.push(m);
        try {
          for (const html of papers) {
            const paper = await mount<ShinbunPaper>(html);
            expect(paper.overflow().length, "overflow").to.equal(0);
            expect(paper.getBoundingClientRect().height).to.be.greaterThan(0);
          }
        } finally {
          console.warn = original;
        }
        expect(warns).to.deep.equal([]);
      });

      it("has no accessibility violations", async () => {
        for (const html of papers) {
          const paper = await mount<ShinbunPaper>(html);
          await expect(paper).to.be.accessible();
        }
      });
    });
  }
});
