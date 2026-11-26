import { test } from "node:test";
import assert from "node:assert/strict";
import { formatBps } from "../src/format-bps.js";

test("shows whole percentages without decimals", () => {
  assert.equal(formatBps(0), "0%");
  assert.equal(formatBps(500), "5%");
  assert.equal(formatBps(10000), "100%");
});

test("shows the Mergit fee", () => {
  assert.equal(formatBps(150), "1.5%");
});

test("keeps two decimals only when needed", () => {
  assert.equal(formatBps(25), "0.25%");
  assert.equal(formatBps(5), "0.05%");
  assert.equal(formatBps(1234), "12.34%");
});

test("rejects what is not a whole number", () => {
  assert.throws(() => formatBps(1.5), TypeError);
  assert.throws(() => formatBps("150"), TypeError);
});

test("rejects values out of range", () => {
  assert.throws(() => formatBps(-1), RangeError);
  assert.throws(() => formatBps(10001), RangeError);
});
