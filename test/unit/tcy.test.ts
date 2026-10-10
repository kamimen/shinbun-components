import assert from "node:assert/strict";
import { test } from "node:test";
import { splitTcy } from "../../src/internal/tcy.ts";

const tcyOf = (text: string) => splitTcy(text).filter((p) => p.tcy).map((p) => p.text);

test("ちょうど2桁の数字だけが縦中横になる", () => {
  assert.deepEqual(tcyOf("10月15日"), ["10", "15"]);
});

test("1桁と3桁以上は対象外", () => {
  assert.deepEqual(tcyOf("9月"), []);
  assert.deepEqual(tcyOf("2026年"), []);
  assert.deepEqual(tcyOf("123"), []);
});

test("小数と桁区切りは対象外", () => {
  assert.deepEqual(tcyOf("3.14"), []);
  assert.deepEqual(tcyOf("1,234"), []);
  assert.deepEqual(tcyOf("12.5%"), []);
});

test("日付では年を除き、月日が縦中横になる", () => {
  assert.deepEqual(tcyOf("2026年10月11日"), ["10", "11"]);
});

test("分割した結果を結合すると元の文字列に戻る", () => {
  const text = "令和8年10月11日、気温は23度。1,234人が来場した。";
  assert.equal(splitTcy(text).map((p) => p.text).join(""), text);
});

test("空文字列は空の配列", () => {
  assert.deepEqual(splitTcy(""), []);
});
