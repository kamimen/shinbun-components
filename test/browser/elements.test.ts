import { expect } from "@open-wc/testing";
import type { ShinbunArticle } from "../../src/elements/article.ts";
import type { ShinbunHeadline } from "../../src/elements/headline.ts";
import type { ShinbunPaper } from "../../src/elements/paper.ts";
import type { ShinbunPhoto } from "../../src/elements/photo.ts";
import { ShinbunPaper as Paper } from "../../src/elements/paper.ts";
import { TEXT, cleanup, mount } from "./helpers.ts";

const css = (el: Element) => getComputedStyle(el);

describe("登録", () => {
  it("5つの要素が既定のタグ名で登録される", () => {
    for (const tag of ["paper", "page", "article", "headline", "photo"]) {
      expect(customElements.get(`shinbun-${tag}`), tag).to.exist;
    }
  });

  it("define() は二重に呼んでも例外にならず、別のタグ名でも登録できる", () => {
    Paper.define();
    class Alias extends Paper {}
    Alias.define("x-paper");
    expect(customElements.get("x-paper")).to.equal(Alias);
  });
});

describe("shinbun-paper", () => {
  afterEach(cleanup);

  it("sb-paper のクラスが付き、ブロック要素になる", async () => {
    const el = await mount<ShinbunPaper>(`<shinbun-paper></shinbun-paper>`);
    expect(el.classList.contains("sb-paper")).to.equal(true);
    expect(css(el).display).to.equal("block");
  });

  it("既定は縦組みで、writing=horizontal で横組みになる", async () => {
    const el = await mount<ShinbunPaper>(`<shinbun-paper><shinbun-page></shinbun-page></shinbun-paper>`);
    const page = el.querySelector("shinbun-page")!;
    expect(css(page).writingMode).to.equal("vertical-rl");
    expect(el.writing).to.equal("vertical");
    el.setAttribute("writing", "horizontal");
    expect(el.getAttribute("data-sb-writing")).to.equal("horizontal");
    expect(css(page).writingMode).to.equal("horizontal-tb");
    el.writing = "vertical";
    expect(css(page).writingMode).to.equal("vertical-rl");
  });

  it("不正な値は無視して警告する", async () => {
    const warns: string[] = [];
    const original = console.warn;
    console.warn = (m: string) => warns.push(m);
    try {
      const el = await mount<ShinbunPaper>(`<shinbun-paper writing="diagonal" dan="0" font-size="1rem; x"></shinbun-paper>`);
      expect(el.hasAttribute("data-sb-writing")).to.equal(false);
      expect(el.style.getPropertyValue("--sb-dan")).to.equal("");
      expect(el.style.getPropertyValue("--sb-fs")).to.equal("");
      expect(warns.length).to.equal(3);
    } finally {
      console.warn = original;
    }
  });

  it("dan・chars・lines・font-size が CSS カスタムプロパティになる", async () => {
    const el = await mount<ShinbunPaper>(`<shinbun-paper dan="8" chars="12" lines="40" font-size="0.9rem"></shinbun-paper>`);
    expect(el.style.getPropertyValue("--sb-dan")).to.equal("8");
    expect(el.style.getPropertyValue("--sb-chars")).to.equal("12");
    expect(el.style.getPropertyValue("--sb-lines")).to.equal("40");
    expect(el.style.getPropertyValue("--sb-fs")).to.equal("0.9rem");
  });

  it("横組みでは dan を使わず、dan-h が段数になる", async () => {
    const el = await mount<ShinbunPaper>(
      `<shinbun-paper dan="8" dan-h="4" writing="horizontal"><shinbun-page></shinbun-page></shinbun-paper>`,
    );
    const page = el.querySelector("shinbun-page")!;
    expect(el.style.getPropertyValue("--sb-dan")).to.equal("");
    expect(css(page).gridTemplateColumns.split(" ").length).to.equal(4);
    el.setAttribute("writing", "vertical");
    expect(el.style.getPropertyValue("--sb-dan")).to.equal("8");
    expect(css(page).gridTemplateColumns.split(" ").length).to.equal(8);
  });

  it("theme と debug が data 属性になる", async () => {
    const el = await mount<ShinbunPaper>(`<shinbun-paper theme="dark" debug></shinbun-paper>`);
    expect(el.getAttribute("data-sb-theme")).to.equal("dark");
    expect(el.hasAttribute("data-sb-debug")).to.equal(true);
    expect(css(el).colorScheme).to.equal("dark");
    el.removeAttribute("debug");
    expect(el.hasAttribute("data-sb-debug")).to.equal(false);
  });

  it("auto-tcy は2桁の数字だけを縦中横にし、二重には包まない", async () => {
    const el = await mount<ShinbunPaper>(
      `<shinbun-paper auto-tcy><p>2026年10月11日に23人が参加した。</p></shinbun-paper>`,
    );
    const spans = [...el.querySelectorAll(".sb-tcy")].map((s) => s.textContent);
    expect(spans).to.deep.equal(["10", "11", "23"]);
    expect(el.applyTcy()).to.equal(0);
    expect(el.querySelectorAll(".sb-tcy").length).to.equal(3);
  });

  it("responsive は、画面幅が足りないとき横組みにする", async () => {
    const el = await mount<ShinbunPaper>(`<shinbun-paper responsive="99999"></shinbun-paper>`);
    expect(el.writing).to.equal("horizontal");
    el.setAttribute("responsive", "1");
    expect(el.writing).to.equal("vertical");
    el.removeAttribute("responsive");
    expect(el.writing).to.equal("vertical");
  });
});

describe("shinbun-article と段グリッド", () => {
  afterEach(cleanup);

  const paper = (inner: string, attrs = "") =>
    mount<ShinbunPaper>(`<shinbun-paper ${attrs}><shinbun-page>${inner}</shinbun-page></shinbun-paper>`);

  it("span・y・x・w が data 属性になり、配置が変わる", async () => {
    const paperEl = await paper(`<shinbun-article span="4" y="2" x="3" w="5"><p>${TEXT}</p></shinbun-article>`);
    const a = paperEl.querySelector<ShinbunArticle>("shinbun-article")!;
    expect(a.getAttribute("data-sb-span")).to.equal("4");
    expect(a.getAttribute("data-sb-y")).to.equal("2");
    expect(a.getAttribute("data-sb-x")).to.equal("3");
    expect(a.getAttribute("data-sb-w")).to.equal("5");
    expect(css(a).gridColumnStart).to.equal("2");
    expect(css(a).gridColumnEnd).to.equal("span 4");
    expect(css(a).gridRowStart).to.equal("3");
    expect(css(a).gridRowEnd).to.equal("span 5");
  });

  it("範囲外の配置は無視する", async () => {
    const original = console.warn;
    console.warn = () => {};
    try {
      const paperEl = await paper(`<shinbun-article span="16" y="0" x="61" w="abc"></shinbun-article>`);
      const a = paperEl.querySelector<ShinbunArticle>("shinbun-article")!;
      for (const n of ["span", "y", "x", "w"]) expect(a.hasAttribute(`data-sb-${n}`), n).to.equal(false);
    } finally {
      console.warn = original;
    }
  });

  it("プロパティからも配置できる", async () => {
    const paperEl = await paper(`<shinbun-article></shinbun-article>`);
    const a = paperEl.querySelector<ShinbunArticle>("shinbun-article")!;
    a.span = 5;
    expect(a.getAttribute("span")).to.equal("5");
    expect(a.getAttribute("data-sb-span")).to.equal("5");
    a.span = null;
    expect(a.hasAttribute("span")).to.equal(false);
    expect(a.hasAttribute("data-sb-span")).to.equal(false);
  });

  it("記事は span 段の段組みになり、見出しと写真は段抜きになる", async () => {
    const paperEl = await paper(
      `<shinbun-article span="3">
         <shinbun-headline size="l">見出し</shinbun-headline>
         <p>${TEXT}</p>
         <shinbun-photo><img alt="" /><figcaption>写真の説明</figcaption></shinbun-photo>
       </shinbun-article>`,
    );
    const a = paperEl.querySelector<ShinbunArticle>("shinbun-article")!;
    expect(css(a).columnCount).to.equal("3");
    expect(css(a.querySelector("shinbun-headline")!).columnSpan).to.equal("all");
    expect(css(a.querySelector("shinbun-photo")!).columnSpan).to.equal("all");
  });

  it("lead でトップ記事のクラスが付く", async () => {
    const paperEl = await paper(`<shinbun-article lead></shinbun-article>`);
    const a = paperEl.querySelector<ShinbunArticle>("shinbun-article")!;
    expect(a.classList.contains("sb-article--lead")).to.equal(true);
    a.lead = false;
    expect(a.classList.contains("sb-article--lead")).to.equal(false);
  });

  it("縦組みでは、段が天地方向に並ぶ", async () => {
    const paperEl = await paper(
      `<shinbun-article span="3" y="1"><p>${TEXT}</p></shinbun-article>
       <shinbun-article span="3" y="4"><p>${TEXT}</p></shinbun-article>`,
      `dan="6"`,
    );
    const [a, b] = [...paperEl.querySelectorAll("shinbun-article")];
    // inline axis is top-to-bottom in vertical writing
    expect(a!.getBoundingClientRect().top).to.be.lessThan(b!.getBoundingClientRect().top);
  });
});

describe("座標指定グリッドと overflow()", () => {
  afterEach(cleanup);

  it("収まる記事は報告せず、収まらない記事を報告する", async () => {
    const long = TEXT.repeat(12);
    const el = await mount<ShinbunPaper>(
      `<shinbun-paper lines="20" chars="10" dan="6">
         <shinbun-page grid>
           <shinbun-article id="fit" span="3" y="1" x="1" w="8"><p>短い記事。</p></shinbun-article>
           <shinbun-article id="over" span="3" y="4" x="1" w="4"><p>${long}</p></shinbun-article>
         </shinbun-page>
       </shinbun-paper>`,
    );
    expect(el.querySelector("shinbun-page")!.classList.contains("sb-page--grid")).to.equal(true);
    const ids = el.overflow().map((a) => a.id);
    expect(ids).to.deep.equal(["over"]);
  });
});

describe("shinbun-headline", () => {
  afterEach(cleanup);

  it("見出しの役割とレベルを持つ", async () => {
    const el = await mount<ShinbunHeadline>(`<shinbun-headline>見出し</shinbun-headline>`);
    expect(el.getAttribute("role")).to.equal("heading");
    expect(el.getAttribute("aria-level")).to.equal("2");
    el.setAttribute("level", "1");
    expect(el.getAttribute("aria-level")).to.equal("1");
  });

  it("size でクラスが入れ替わり、文字の大きさが変わる", async () => {
    const paperEl = await mount<ShinbunPaper>(
      `<shinbun-paper><shinbun-headline size="xl">大</shinbun-headline><shinbun-headline size="s">小</shinbun-headline></shinbun-paper>`,
    );
    const [xl, s] = [...paperEl.querySelectorAll<ShinbunHeadline>("shinbun-headline")];
    expect(parseFloat(css(xl!).fontSize)).to.be.greaterThan(parseFloat(css(s!).fontSize));
    xl!.size = "s";
    expect(xl!.classList.contains("sb-headline--xl")).to.equal(false);
    expect(xl!.classList.contains("sb-headline--s")).to.equal(true);
  });
});

describe("shinbun-photo", () => {
  afterEach(cleanup);

  it("子の img と figcaption に shinbun-css のクラスが付く", async () => {
    const el = await mount<ShinbunPhoto>(`<shinbun-photo><img alt="" /><figcaption>説明</figcaption></shinbun-photo>`);
    expect(el.getAttribute("role")).to.equal("figure");
    expect(el.querySelector("img")!.classList.contains("sb-photo__img")).to.equal(true);
    expect(el.querySelector("figcaption")!.classList.contains("sb-photo__caption")).to.equal(true);
  });

  it("あとから追加した子にもクラスが付く", async () => {
    const el = await mount<ShinbunPhoto>(`<shinbun-photo></shinbun-photo>`);
    const img = document.createElement("img");
    el.append(img);
    await Promise.resolve();
    expect(img.classList.contains("sb-photo__img")).to.equal(true);
  });

  it("ratio が縦横比になる", async () => {
    const paperEl = await mount<ShinbunPaper>(
      `<shinbun-paper><shinbun-page><shinbun-article><shinbun-photo ratio="2 / 1"><img alt="" /></shinbun-photo></shinbun-article></shinbun-page></shinbun-paper>`,
    );
    const img = paperEl.querySelector("img")!;
    const { width, height } = img.getBoundingClientRect();
    expect(width / height).to.be.closeTo(2, 0.05);
  });
});

describe("アクセシビリティの属性", () => {
  afterEach(cleanup);

  it("記事は article の役割を持つ", async () => {
    const el = await mount<ShinbunArticle>(`<shinbun-article></shinbun-article>`);
    expect(el.getAttribute("role")).to.equal("article");
  });

  it("利用者が指定した role は上書きしない", async () => {
    const el = await mount<ShinbunArticle>(`<shinbun-article role="region"></shinbun-article>`);
    expect(el.getAttribute("role")).to.equal("region");
  });
});
