import assert from "node:assert/strict";
import { test } from "node:test";
import {
  PLACEMENT_RANGE,
  parseEnum,
  parseIntInRange,
  parseLength,
  parsePositiveInt,
  parseRatio,
} from "../../src/internal/validate.ts";

test("整数の範囲: 境界を含み、範囲外と整数でない値は null", () => {
  const r = PLACEMENT_RANGE.span;
  assert.equal(parseIntInRange("1", r), 1);
  assert.equal(parseIntInRange("15", r), 15);
  assert.equal(parseIntInRange("0", r), null);
  assert.equal(parseIntInRange("16", r), null);
  assert.equal(parseIntInRange("3.5", r), null);
  assert.equal(parseIntInRange("3px", r), null);
  assert.equal(parseIntInRange("-1", r), null);
  assert.equal(parseIntInRange("", r), null);
  assert.equal(parseIntInRange(null, r), null);
});

test("配置の範囲は SPEC どおり（span/y は 1〜15、x/w は 1〜60）", () => {
  assert.deepEqual(PLACEMENT_RANGE.span, { min: 1, max: 15 });
  assert.deepEqual(PLACEMENT_RANGE.y, { min: 1, max: 15 });
  assert.deepEqual(PLACEMENT_RANGE.x, { min: 1, max: 60 });
  assert.deepEqual(PLACEMENT_RANGE.w, { min: 1, max: 60 });
});

test("正の整数", () => {
  assert.equal(parsePositiveInt("10"), 10);
  assert.equal(parsePositiveInt("0"), null);
  assert.equal(parsePositiveInt("abc"), null);
});

test("長さは単位つきの正の数だけ", () => {
  assert.equal(parseLength("0.8rem"), "0.8rem");
  assert.equal(parseLength(" 12px "), "12px");
  assert.equal(parseLength(".5em"), ".5em");
  assert.equal(parseLength("0px"), null);
  assert.equal(parseLength("12"), null);
  assert.equal(parseLength("1rem; color: red"), null);
  assert.equal(parseLength("calc(1rem)"), null);
});

test("縦横比は数または「数 / 数」。0 は不可", () => {
  assert.equal(parseRatio("4 / 5"), "4 / 5");
  assert.equal(parseRatio("10/11"), "10/11");
  assert.equal(parseRatio("1.5"), "1.5");
  assert.equal(parseRatio("0 / 5"), null);
  assert.equal(parseRatio("4 / 0"), null);
  assert.equal(parseRatio("auto"), null);
  assert.equal(parseRatio("4 / 5; x"), null);
});

test("列挙", () => {
  const allowed = ["vertical", "horizontal"] as const;
  assert.equal(parseEnum("vertical", allowed), "vertical");
  assert.equal(parseEnum(" horizontal ", allowed), "horizontal");
  assert.equal(parseEnum("diagonal", allowed), null);
  assert.equal(parseEnum(null, allowed), null);
});
