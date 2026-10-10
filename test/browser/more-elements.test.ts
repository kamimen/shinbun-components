import { expect } from "@open-wc/testing";
import { TEXT, cleanup, mount } from "./helpers.ts";

const css = (el: Element) => getComputedStyle(el);

describe("children get shinbun-css classes", () => {
  afterEach(cleanup);

  it("nameplate, box and folio classify their children, including ones added later", async () => {
    const el = await mount(`<shinbun-nameplate><h1>t</h1><p>m</p></shinbun-nameplate>`);
    expect(el.querySelector("h1")!.classList.contains("sb-nameplate__title")).to.equal(true);
    const img = document.createElement("img");
    el.append(img);
    await Promise.resolve();
    expect(img.classList.contains("sb-nameplate__logo")).to.equal(true);
  });

  it("only direct children are classified", async () => {
    const el = await mount(`<shinbun-box><h3>direct</h3><div><h3>nested</h3></div></shinbun-box>`);
    const [direct, nested] = el.querySelectorAll("h3");
    expect(direct!.classList.contains("sb-box__title")).to.equal(true);
    expect(nested!.classList.contains("sb-box__title")).to.equal(false);
  });
});

describe("shinbun-ad", () => {
  afterEach(cleanup);

  it("accepts several space-separated kinds and replaces them when changed", async () => {
    const el = await mount(`<shinbun-ad kind="kijishita zen5"></shinbun-ad>`);
    expect(el.classList.contains("sb-ad--kijishita")).to.equal(true);
    expect(el.classList.contains("sb-ad--zen5")).to.equal(true);
    el.setAttribute("kind", "han");
    expect(el.classList.contains("sb-ad--kijishita")).to.equal(false);
    expect(el.classList.contains("sb-ad--han")).to.equal(true);
  });

  it("warns about an unknown kind and keeps the valid ones", async () => {
    const warns: string[] = [];
    const original = console.warn;
    console.warn = (m: string) => warns.push(m);
    try {
      const el = await mount(`<shinbun-ad kind="zen huge"></shinbun-ad>`);
      expect(el.classList.contains("sb-ad--zen")).to.equal(true);
      expect(warns.length).to.equal(1);
    } finally {
      console.warn = original;
    }
  });
});

describe("shinbun-table", () => {
  afterEach(cleanup);

  it("keeps the native table and styles it", async () => {
    const el = await mount(
      `<shinbun-table tv><table><caption>c</caption><tbody><tr><th scope="row">6</th><td num>10</td></tr></tbody></table></shinbun-table>`,
    );
    const table = el.querySelector("table")!;
    expect(table.classList.contains("sb-table")).to.equal(true);
    expect(table.classList.contains("sb-table--tv")).to.equal(true);
    expect(css(table).writingMode).to.equal("horizontal-tb");
    expect(css(el.querySelector("td")!).textAlign).to.equal("end");
    el.removeAttribute("tv");
    expect(table.classList.contains("sb-table--tv")).to.equal(false);
  });

  it("styles a table added later", async () => {
    const el = await mount(`<shinbun-table></shinbun-table>`);
    el.innerHTML = `<table><tbody><tr><td num>1</td></tr></tbody></table>`;
    await new Promise((r) => setTimeout(r));
    expect(el.querySelector("table")!.classList.contains("sb-table")).to.equal(true);
    expect(el.querySelector("td")!.classList.contains("sb-num")).to.equal(true);
  });
});

describe("text elements", () => {
  afterEach(cleanup);

  it("shinbun-paragraph is indented by one character unless flush", async () => {
    const paper = await mount(
      `<shinbun-paper><shinbun-page><shinbun-article><shinbun-paragraph>a</shinbun-paragraph><shinbun-paragraph flush>b</shinbun-paragraph></shinbun-article></shinbun-page></shinbun-paper>`,
    );
    const [a, b] = paper.querySelectorAll("shinbun-paragraph");
    expect(parseFloat(css(a!).textIndent)).to.be.greaterThan(0);
    expect(parseFloat(css(b!).textIndent)).to.equal(0);
  });

  it("kicker, sleeve, sub and box span all columns of their article", async () => {
    const paper = await mount(
      `<shinbun-paper><shinbun-page><shinbun-article span="3">
         <shinbun-kicker>k</shinbun-kicker><shinbun-sleeve>s</shinbun-sleeve><shinbun-sub>u</shinbun-sub>
         <p>${TEXT}</p><shinbun-box><h3>t</h3>b</shinbun-box>
       </shinbun-article></shinbun-page></shinbun-paper>`,
    );
    for (const tag of ["shinbun-kicker", "shinbun-sleeve", "shinbun-sub", "shinbun-box"]) {
      expect(css(paper.querySelector(tag)!).columnSpan, tag).to.equal("all");
    }
  });

  it("yoko is a heading set horizontally", async () => {
    const el = await mount(`<shinbun-paper><shinbun-page><shinbun-yoko span="4" reverse level="1">y</shinbun-yoko></shinbun-page></shinbun-paper>`);
    const yoko = el.querySelector("shinbun-yoko")!;
    expect(yoko.getAttribute("role")).to.equal("heading");
    expect(yoko.getAttribute("aria-level")).to.equal("1");
    expect(css(yoko).writingMode).to.equal("horizontal-tb");
    expect(css(yoko).display).to.equal("flex");
  });

  it("inline elements stay inline", async () => {
    const el = await mount(`<p><shinbun-tcy>10</shinbun-tcy><shinbun-emphasis>e</shinbun-emphasis></p>`);
    for (const tag of ["shinbun-tcy", "shinbun-emphasis"]) expect(css(el.querySelector(tag)!).display, tag).to.equal("inline");
  });
});

describe("roles", () => {
  afterEach(cleanup);

  const roles: Record<string, string> = {
    "shinbun-kicker": "paragraph",
    "shinbun-lead": "paragraph",
    "shinbun-box": "note",
    "shinbun-ad": "group",
    "shinbun-rule": "separator",
    "shinbun-yoko": "heading",
  };
  for (const [tag, role] of Object.entries(roles)) {
    it(`${tag} has role=${role}, and an explicit role wins`, async () => {
      const el = await mount(`<${tag}></${tag}>`);
      expect(el.getAttribute("role")).to.equal(role);
      const custom = await mount(`<${tag} role="presentation"></${tag}>`);
      expect(custom.getAttribute("role")).to.equal("presentation");
    });
  }
});

describe("utility attributes", () => {
  afterEach(cleanup);

  it("gothic and nowrap work on any element", async () => {
    const el = await mount(`<shinbun-lead gothic nowrap>a</shinbun-lead>`);
    expect(el.classList.contains("sb-gothic")).to.equal(true);
    expect(css(el).whiteSpace).to.equal("nowrap");
    el.removeAttribute("gothic");
    expect(el.classList.contains("sb-gothic")).to.equal(false);
  });
});

describe("photo in the page grid", () => {
  afterEach(cleanup);

  it("keeps the image height from ratio when `w` is missing", async () => {
    const el = await mount(
      `<shinbun-paper dan="6" chars="8"><shinbun-page><shinbun-photo span="3" ratio="1 / 2"><img alt="" /></shinbun-photo></shinbun-page></shinbun-paper>`,
    );
    const img = el.querySelector("img")!.getBoundingClientRect();
    expect(img.height).to.be.greaterThan(20);
    expect(img.width).to.be.greaterThan(10);
  });
});

describe("before the elements are defined", () => {
  it("hides the paper only when scripting is enabled", async () => {
    const frame = document.createElement("iframe");
    frame.srcdoc = `<!doctype html><link rel="stylesheet" href="${location.origin}/src/css/shinbun.css"><link rel="stylesheet" href="${location.origin}/src/css/components.css"><shinbun-paper id="p">x</shinbun-paper>`;
    document.body.append(frame);
    await new Promise((resolve) => frame.addEventListener("load", resolve, { once: true }));
    await new Promise((r) => setTimeout(r, 100));
    const p = frame.contentDocument!.getElementById("p")!;
    expect(frame.contentWindow!.getComputedStyle(p).visibility).to.equal("hidden");
    frame.remove();
  });
});

describe("shinbun-page scrolling", () => {
  afterEach(cleanup);

  const long = (extra = "") =>
    `<shinbun-paper dan="2" chars="6" font-size="1rem"><shinbun-page ${extra}><shinbun-article span="2"><p>${TEXT.repeat(30)}</p></shinbun-article></shinbun-page></shinbun-paper>`;

  it("is focusable while it scrolls, and not otherwise", async () => {
    const paper = await mount(long());
    const page = paper.querySelector("shinbun-page")!;
    await new Promise((r) => setTimeout(r, 150));
    expect(page.scrollWidth).to.be.greaterThan(page.clientWidth);
    expect(page.getAttribute("tabindex")).to.equal("0");
    paper.querySelector("p")!.textContent = "short";
    await new Promise((r) => setTimeout(r, 150));
    expect(page.hasAttribute("tabindex")).to.equal(false);
  });

  it("keeps an author-set tabindex", async () => {
    const paper = await mount(long('tabindex="-1"'));
    await new Promise((r) => setTimeout(r, 150));
    expect(paper.querySelector("shinbun-page")!.getAttribute("tabindex")).to.equal("-1");
  });
});

describe("page alignment", () => {
  afterEach(cleanup);

  const page = (writing: string) =>
    `<shinbun-paper writing="${writing}" dan="3" chars="6" lines="10"><shinbun-page grid><shinbun-article span="3" x="1" w="4"><p>${TEXT}</p></shinbun-article></shinbun-page></shinbun-paper>`;

  it("a vertical page starts at the right edge of the paper", async () => {
    const paper = await mount(page("vertical"));
    const p = paper.getBoundingClientRect();
    const g = paper.querySelector("shinbun-page")!.getBoundingClientRect();
    expect(g.width).to.be.lessThan(p.width);
    expect(Math.abs(p.right - g.right)).to.be.lessThan(2);
  });

  it("a horizontal page starts at the left edge", async () => {
    const paper = await mount(page("horizontal"));
    const p = paper.getBoundingClientRect();
    const g = paper.querySelector("shinbun-page")!.getBoundingClientRect();
    expect(Math.abs(p.left - g.left)).to.be.lessThan(2);
  });
});

describe("table inside a vertical page", () => {
  afterEach(cleanup);

  it("stays inside the page and keeps its cells visible", async () => {
    const paper = await mount(
      `<shinbun-paper dan="6" chars="8"><shinbun-page><shinbun-table span="4"><table><caption>c</caption><tbody><tr><th scope="row">18</th><td>program</td></tr></tbody></table></shinbun-table></shinbun-page></shinbun-paper>`,
    );
    const page = paper.querySelector("shinbun-page")!.getBoundingClientRect();
    const table = paper.querySelector("table")!.getBoundingClientRect();
    expect(table.left).to.be.at.least(page.left - 1);
    expect(table.right).to.be.at.most(page.right + 1);
    expect(table.width).to.be.lessThan(page.width);
    expect(paper.querySelector("td")!.getBoundingClientRect().width).to.be.greaterThan(10);
  });
});

describe("horizontal page padding", () => {
  afterEach(cleanup);

  it("keeps text away from the paper edge", async () => {
    const paper = await mount(`<shinbun-paper writing="horizontal"><shinbun-page><shinbun-article span="3"><p>${TEXT}</p></shinbun-article></shinbun-page></shinbun-paper>`);
    const gap = paper.querySelector("p")!.getBoundingClientRect().left - paper.getBoundingClientRect().left;
    expect(gap).to.be.greaterThan(2);
  });
});
