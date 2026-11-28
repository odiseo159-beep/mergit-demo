import { test } from "node:test";
import assert from "node:assert/strict";
import { grossFor } from "../src/split.js";

test("rejects a number where wei is expected", () => {
  assert.throws(() => grossFor(1_000_000, 150), TypeError);
});

test("rejects a negative net target", () => {
  assert.throws(() => grossFor(-1n, 150), RangeError);
});

test("rejects a fee that is not a whole number", () => {
  assert.throws(() => grossFor(1_000n, 1.5), RangeError);
});

test("rejects a negative fee", () => {
  assert.throws(() => grossFor(1_000n, -1), RangeError);
});
