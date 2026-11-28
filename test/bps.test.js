import { test } from "node:test";
import assert from "node:assert/strict";
import { bpsFromPercent } from "../src/bps.js";

test("turns a percentage with a percent sign into basis points", () => {
  assert.equal(bpsFromPercent("1.5%"), 150);
  assert.equal(bpsFromPercent("0%"), 0);
  assert.equal(bpsFromPercent("5%"), 500);
});

test("accepts a percentage without a percent sign", () => {
  assert.equal(bpsFromPercent("1.5"), 150);
});

test("rejects anything above 5 percent", () => {
  for (const bad of ["5.01%", "6%", "100%"]) {
    assert.throws(() => bpsFromPercent(bad), RangeError);
  }
});

test("rejects more than 2 decimals", () => {
  for (const bad of ["1.555%", "0.001%"]) {
    assert.throws(() => bpsFromPercent(bad), RangeError);
  }
});

test("rejects a negative value", () => {
  assert.throws(() => bpsFromPercent("-1%"), RangeError);
});

test("rejects an empty string", () => {
  assert.throws(() => bpsFromPercent(""), RangeError);
});

test("rejects anything that is not a string", () => {
  for (const bad of [150, 1.5, null, undefined, {}]) {
    assert.throws(() => bpsFromPercent(bad), TypeError);
  }
});
