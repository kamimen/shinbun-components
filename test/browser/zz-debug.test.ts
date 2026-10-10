import { cleanup, mount } from "./helpers.ts";

describe("debug: firefox overflow", () => {
  afterEach(cleanup);

  it("prints the geometry of the overflowing article", async () => {
    const html = await (await fetch("/site/examples/front.html")).text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const paper = await mount(doc.querySelector("shinbun-paper")!.outerHTML);
    const art = [...paper.querySelectorAll("shinbun-article")].find((a) => a.querySelector("shinbun-headline")?.textContent === "朗読会に40人")!;
    const r = (e: Element | Range) => {
      const b = e.getBoundingClientRect();
      return [b.left, b.top, b.right, b.bottom].map(Math.round).join(",");
    };
    const lines: string[] = [`article box ${r(art)} wm=${getComputedStyle(art).writingMode} cols=${getComputedStyle(art).columnCount}`];
    const walk = (node: Node, depth: number) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const range = document.createRange();
        range.selectNodeContents(node);
        const rects = [...range.getClientRects()].map((x) => [x.left, x.top, x.right, x.bottom].map(Math.round).join(","));
        lines.push(`${"  ".repeat(depth)}"${(node.nodeValue ?? "").trim().slice(0, 12)}" ${rects.join(" | ")}`);
      } else if (node instanceof Element) {
        lines.push(`${"  ".repeat(depth)}<${node.localName}.${node.className}> ${r(node)}`);
        node.childNodes.forEach((c) => walk(c, depth + 1));
      }
    };
    art.childNodes.forEach((c) => walk(c, 1));
    console.log("GEOMETRY2 " + navigator.userAgent.match(/Firefox|Chrome|AppleWebKit/)?.[0] + "\n" + lines.join("\n"));
  });
});
