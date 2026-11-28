import { test } from "node:test";
import assert from "node:assert/strict";
import { deadlineFrom } from "../src/deadline.js";

test("14 days from a fixed moment", () => {
  assert.equal(deadlineFrom(14, 1_700_000_000), 1_701_209_600n);
});

test("the deadline is a bigint, like the chain returns", () => {
  assert.equal(typeof deadlineFrom(1, 1_700_000_000), "bigint");
});

test("one day and 365 days are both allowed", () => {
  assert.equal(deadlineFrom(1, 0), 86_400n);
  assert.equal(deadlineFrom(365, 0), 31_536_000n);
});

test("days outside 1 to 365 are refused", () => {
  assert.throws(() => deadlineFrom(0, 1_700_000_000), RangeError);
  assert.throws(() => deadlineFrom(366, 1_700_000_000), RangeError);
  assert.throws(() => deadlineFrom(-1, 1_700_000_000), RangeError);
  assert.throws(() => deadlineFrom(1.5, 1_700_000_000), RangeError);
});

test("a negative or fractional now is refused", () => {
  assert.throws(() => deadlineFrom(14, -1), RangeError);
  assert.throws(() => deadlineFrom(14, 1_700_000_000.5), RangeError);
});
