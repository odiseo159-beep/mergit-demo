import { test } from "node:test";
import assert from "node:assert/strict";
import { formatDeadline } from "../src/format-deadline.js";

test("formats a deadline in UTC", () => {
  assert.equal(formatDeadline(1796447642), "Dec 5, 2026, 05:14 UTC");
});

test("accepts a bigint, as the chain returns", () => {
  assert.equal(formatDeadline(1796447642n), "Dec 5, 2026, 05:14 UTC");
});

test("stays in UTC no matter the machine's time zone", () => {
  const original = process.env.TZ;
  process.env.TZ = "America/New_York";
  try {
    assert.equal(formatDeadline(1796447642), "Dec 5, 2026, 05:14 UTC");
  } finally {
    if (original === undefined) delete process.env.TZ;
    else process.env.TZ = original;
  }
});

test("pads hours and minutes to two digits", () => {
  assert.equal(formatDeadline(1704067500), "Jan 1, 2024, 00:05 UTC");
});

test("rejects anything that is not a number or a bigint", () => {
  for (const bad of ["1796447642", null, undefined, {}, [], true]) {
    assert.throws(() => formatDeadline(bad), TypeError);
  }
});

test("rejects a negative value", () => {
  assert.throws(() => formatDeadline(-1), RangeError);
  assert.throws(() => formatDeadline(-1n), RangeError);
});

test("rejects a number that is not a whole number", () => {
  assert.throws(() => formatDeadline(1.5), RangeError);
  assert.throws(() => formatDeadline(Number.NaN), RangeError);
});
