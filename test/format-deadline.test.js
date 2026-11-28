import { test } from "node:test";
import assert from "node:assert/strict";
import { formatDeadline } from "../src/format-deadline.js";

test("formats a deadline the way a receipt shows it", () => {
  assert.equal(formatDeadline(1_796_447_642), "Dec 5, 2026, 05:14 UTC");
});

test("accepts a bigint, because the chain returns one", () => {
  assert.equal(formatDeadline(1_796_447_642n), "Dec 5, 2026, 05:14 UTC");
});

test("pads hours and minutes to two digits", () => {
  assert.equal(formatDeadline(0), "Jan 1, 1970, 00:00 UTC");
  assert.equal(formatDeadline(60), "Jan 1, 1970, 00:01 UTC");
});

test("is UTC whatever the machine's time zone is", () => {
  const before = process.env.TZ;
  try {
    for (const zone of ["America/Lima", "Asia/Tokyo", "Pacific/Kiritimati"]) {
      process.env.TZ = zone;
      assert.equal(formatDeadline(1_796_447_642), "Dec 5, 2026, 05:14 UTC");
    }
  } finally {
    if (before === undefined) delete process.env.TZ;
    else process.env.TZ = before;
  }
});

test("refuses anything that is not a number or a bigint", () => {
  for (const value of ["1796447642", null, undefined, {}, []]) {
    assert.throws(() => formatDeadline(value), TypeError);
  }
});

test("refuses a negative or fractional value", () => {
  assert.throws(() => formatDeadline(-1), RangeError);
  assert.throws(() => formatDeadline(-1n), RangeError);
  assert.throws(() => formatDeadline(1.5), RangeError);
});
