# shinbun-components

HTML のタグだけで、日本の新聞のような紙面を組む Web Components。[shinbun-css](https://github.com/kamimen/shinbun-css) を土台にしています。実行時の依存はありません。

[English](README.md) | 日本語

```html
<shinbun-paper dan="6" chars="10" auto-tcy>
  <shinbun-page>
    <shinbun-article span="6" lead>
      <shinbun-headline size="l">町の図書館、夜も開館へ</shinbun-headline>
      <p>架空の町の図書館が、来月から平日の夜9時まで開館する。</p>
    </shinbun-article>
  </shinbun-page>
</shinbun-paper>
```

## 特徴

- **縦組み・横組みを属性で切り替え**: `writing="horizontal"`。`responsive` を付けると、画面幅に応じて自動で切り替わります。
- **段組みと段抜き見出し**: 記事は `span` 段を占め、見出しや写真は全段にまたがります。
- **座標指定**: 「何段 × 何行」の長方形に記事を敷き詰められます。収まらない記事は `overflow()` で見つけられます。
- **縦中横**: `auto-tcy` で、2桁の数字だけを縦中横にします。
- **依存なし・軽量**: JS は約 14 KB（gzip 約 5 KB）、CSS は約 16 KB（gzip 約 4 KB）。
- **Light DOM**: Shadow DOM を使わないので、素の HTML と同じように CSS が効きます。理由は「設計」を参照。

## 使い方

CDN（jsDelivr）から、タグを指定して読み込みます。版を固定すると、更新後も見た目が変わりません。

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/kamimen/shinbun-components@v0.1.0/dist/shinbun-components.min.css" />
<script type="module" src="https://cdn.jsdelivr.net/gh/kamimen/shinbun-components@v0.1.0/dist/shinbun-components.min.js"></script>
```

CSS（約 15 KB）には [shinbun-css](https://github.com/kamimen/shinbun-css) v0.1.0 が入っているので、別に読み込む必要はありません。

バンドラを使う場合は、リポジトリのタグを指定してインストールできます（`dist/` をコミットしてあります）。

```sh
npm install github:kamimen/shinbun-components#v0.1.0
```

```js
import "shinbun-components/define"; // すべての要素を登録する
import "shinbun-components/css";
```

タグ名を変えたいときは、`define` を読み込まずに、各クラスの `define()` を呼びます。

```js
import { ShinbunPaper } from "shinbun-components";
ShinbunPaper.define("my-paper");
```

## 要素

shinbun-css v0.1.0 のクラス 59 個すべてに、要素・属性のどれかが対応します（対応表は [`src/coverage.json`](src/coverage.json)、ブラウザテストで毎回確かめています）。

| 分類 | 要素 | 主な属性 |
|---|---|---|
| 紙面 | `shinbun-paper` | `writing` `theme` `responsive` `auto-tcy` `dan` `dan-h` `chars` `lines` `font-size` `preset` `debug` |
| | `shinbun-page` | `grid` |
| 題字・欄外 | `shinbun-masthead` `shinbun-nameplate` `shinbun-folio` | `horizontal`（nameplate）、`span` `y` `x` `w`（nameplate） |
| 記事 | `shinbun-article` | `span` `y` `x` `w` `lead` `editorial` `column` |
| 見出し | `shinbun-headline` | `size`（xl・l・m・s）`level` |
| | `shinbun-kicker` `shinbun-sleeve` `shinbun-sub` | |
| | `shinbun-yoko` | `reverse` `level` `span` `y` `x` `w` |
| 本文 | `shinbun-lead` `shinbun-dateline` `shinbun-byline` | |
| | `shinbun-paragraph` | `flush` |
| 写真 | `shinbun-photo` | `ratio` `span` `y` `x` `w` |
| 囲み・広告・表 | `shinbun-box` | `span` `y` `x` `w` |
| | `shinbun-ad` | `kind`（空白区切りで複数）`span` `y` `x` `w` |
| | `shinbun-table` | `tv` `span` `y` `x` `w`。中に本物の `table` を置く |
| 罫線・文字 | `shinbun-rule` | `double` |
| | `shinbun-emphasis` `shinbun-tcy` `shinbun-sideways` `shinbun-horizontal` | |

すべての要素が、ユーティリティの属性 `gothic`（ゴシック体）と `nowrap`（折り返さない）を受け付けます。属性・プロパティ・メソッド・CSS カスタムプロパティの一覧は [API ドキュメント](https://kamimen.github.io/shinbun-components/) にあります。

写真の `ratio` は、縦組みでは画像の高さが段の天地の長さで決まるため、「天地に対する幅」の比になります（`1 / 3` なら細長くなります）。

## 座標指定

`shinbun-page` に `grid` を付けると、行軸方向も固定され、記事を長方形に敷き詰められます。

```html
<shinbun-paper dan="10" chars="10" lines="40">
  <shinbun-page grid>
    <shinbun-article x="1" w="20" y="1" span="5">…</shinbun-article>
    <shinbun-article x="21" w="20" y="1" span="5">…</shinbun-article>
  </shinbun-page>
</shinbun-paper>
```

縦組みでは、`y` は上から数えた段、`x` は右から数えた行です。収まらない記事は、次のように探せます。

```js
const paper = document.querySelector("shinbun-paper");
paper.overflow(); // はみ出している記事の配列
```

## 設計

**Light DOM にしています。** shinbun-css の規則は、記事の直接の子にだけ効く段抜き（`column-span`）や、親の `data-sb-writing` による分岐のように、要素どうしの親子関係に頼っています。Shadow DOM に閉じ込めると、これらが効かなくなります。そこで要素は、自分に shinbun-css のクラス（`sb-paper`、`sb-article` など）と `data-sb-*` 属性を付けるだけにし、見た目の規則は shinbun-css のものをそのまま使っています。

- 属性は検証されます。範囲外や不正な値は、警告を出して無視します（例: `span` は 1〜15）。
- 見出しは `role="heading"` と `aria-level`、記事は `role="article"`、写真は `role="figure"`、囲みは `note`、罫線は `separator` を持ちます。自分で `role` を指定すれば、それが優先されます。
- JS を読み込む前は、`shinbun-paper` を隠して、紙面が崩れた状態で見えないようにしています（JS が無効のときは隠しません）。
- 縦組みの `shinbun-page` は横にスクロールするため、スクロールできる間だけキーボードで操作できる（`tabindex="0"`）ようにします。自分で `tabindex` を指定すればそちらが優先されます。

shinbun-css 側で直すとよい点は [docs/UPSTREAM.md](docs/UPSTREAM.md) にまとめています。

## ブラウザ対応

shinbun-css が使う `@layer`、CSS ネスティング、`light-dark()` に必要なバージョンは、Chrome 123、Firefox 120、Safari 17.5 以降です（shinbun-css の記載）。

| ブラウザ | 状態 |
|---|---|
| Google Chrome 154 | 確認済み。ブラウザテスト 144 件と、例ページの目視確認 |
| WebKit 27.2（Playwright 版。Safari と同じエンジン） | 確認済み。ブラウザテスト 144 件 |
| Firefox | **未確認**。テストは設定済みですが、作者の環境（macOS 27）では Playwright 版の Firefox が起動せず、実行できていません |

Safari 本体と Firefox での確認は歓迎します。

組版はブラウザによって少し違います。CI では、同じ本文が Chrome・WebKit では収まっても Firefox では溢れました。座標指定の記事には余裕を持たせ、対象のブラウザで `overflow()` を確認してください。

## 制限

shinbun-css の制限を引き継ぎます。

- 段の内側にまたがる段抜きはできません。
- 記事の自動配置はしません。
- 縦組みの表は扱いません。

## 開発

```sh
npm install
npm run verify   # 型検査・ビルド・整合性検査・テスト（単体・ブラウザ・配布物）・ドキュメント生成
SHINBUN_BROWSERS=chrome,webkit npm run test:browser   # ブラウザを選ぶ（chrome・firefox・webkit）
npm run build    # dist/ と custom-elements.json を作る
npm run docs     # _site/（API ドキュメント）を作る
npm run serve    # _site/ を http://127.0.0.1:5190 で配信する
```

仕様は [docs/SPEC.md](docs/SPEC.md)、変更の履歴は [CHANGELOG.md](CHANGELOG.md)、貢献の方法は [CONTRIBUTING.md](CONTRIBUTING.md) にあります。

## ライセンス

[MIT License](LICENSE)。実在の新聞社とは関係ありません。例に出てくる新聞名、人物、団体、出来事はすべて架空です。
