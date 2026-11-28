import { test } from "node:test";
import assert from "node:assert/strict";
import { formatDeadline } from "../src/format-deadline.js";

test("formats timestamp to UTC receipt date", () => {
  assert.equal(formatDeadline(1796447642), "Dec 5, 2026, 05:14 UTC");
});

test("accepts bigint and matches number output", () => {
  assert.equal(formatDeadline(1796447642n), "Dec 5, 2026, 05:14 UTC");
  assert.equal(formatDeadline(0n), "Jan 1, 1970, 00:00 UTC");
  for (const seconds of [2_147_483_647n, 2_147_483_648n, 4_294_967_296n]) {
    assert.equal(formatDeadline(seconds), formatDeadline(Number(seconds)));
  }
});

test("formats Unix epoch and negative zero as Jan 1, 1970, 00:00 UTC", () => {
  assert.equal(formatDeadline(0), "Jan 1, 1970, 00:00 UTC");
  assert.equal(formatDeadline(-0), "Jan 1, 1970, 00:00 UTC");
  assert.equal(formatDeadline(0n), "Jan 1, 1970, 00:00 UTC");
});

test("zero-pads hours and minutes without padding single-digit days", () => {
  assert.equal(formatDeadline(1767582245), "Jan 5, 2026, 03:04 UTC");
  assert.equal(formatDeadline(1735689599), "Dec 31, 2024, 23:59 UTC");
  assert.equal(formatDeadline(1735689600), "Jan 1, 2025, 00:00 UTC");
});

test("drops sub-minute seconds instead of rounding up", () => {
  assert.equal(formatDeadline(59), "Jan 1, 1970, 00:00 UTC");
  assert.equal(formatDeadline(60), "Jan 1, 1970, 00:01 UTC");
  assert.equal(formatDeadline(1796447699), "Dec 5, 2026, 05:14 UTC");
  assert.equal(formatDeadline(1796447700), "Dec 5, 2026, 05:15 UTC");
});

test("handles leap day and all twelve months", () => {
  assert.equal(formatDeadline(1709208000), "Feb 29, 2024, 12:00 UTC");

  const expectedMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  for (let i = 0; i < expectedMonths.length; i++) {
    const seconds = Date.UTC(2026, i, 9, 7, 5, 42) / 1000;
    assert.equal(formatDeadline(seconds), `${expectedMonths[i]} 9, 2026, 07:05 UTC`);
  }
});

test("handles the maximum representable Date timestamp", () => {
  assert.equal(formatDeadline(8_640_000_000_000), "Sep 13, 275760, 00:00 UTC");
  assert.equal(formatDeadline(8_640_000_000_000n), "Sep 13, 275760, 00:00 UTC");
});

test("always returns UTC regardless of local timezone", () => {
  const hadTz = Object.prototype.hasOwnProperty.call(process.env, "TZ");
  const originalTz = process.env.TZ;

  try {
    for (const tz of ["UTC", "America/New_York", "Asia/Kolkata", "Pacific/Auckland"]) {
      process.env.TZ = tz;
      assert.equal(formatDeadline(0), "Jan 1, 1970, 00:00 UTC");
      assert.equal(formatDeadline(1796447642), "Dec 5, 2026, 05:14 UTC");
      assert.equal(formatDeadline(1796447642n), "Dec 5, 2026, 05:14 UTC");
    }
  } finally {
    if (hadTz) {
      process.env.TZ = originalTz;
    } else {
      delete process.env.TZ;
    }
  }
});

test("throws TypeError for anything not number or bigint", () => {
  assert.throws(() => formatDeadline(), TypeError);

  for (const bad of [
    "1796447642",
    "",
    "0",
    null,
    undefined,
    true,
    false,
    {},
    { valueOf: () => 0 },
    [],
    [0],
    Symbol("0"),
    () => 0,
    new Date(0),
    new Number(0),
    Object(0n),
  ]) {
    assert.throws(() => formatDeadline(bad), TypeError);
  }
});

test("throws RangeError for negative values", () => {
  for (const bad of [
    -1,
    -1n,
    -1796447642,
    -1796447642n,
    Number.MIN_SAFE_INTEGER,
    -Number.MAX_VALUE,
    -8_640_000_000_001n,
  ]) {
    assert.throws(() => formatDeadline(bad), RangeError);
  }
});

test("throws RangeError for non-integer or non-finite numbers", () => {
  for (const bad of [
    0.1,
    1.5,
    -0.5,
    -1.5,
    1796447642.5,
    Number.MIN_VALUE,
    Number.NaN,
    Infinity,
    -Infinity,
  ]) {
    assert.throws(() => formatDeadline(bad), RangeError);
  }
});

test("throws RangeError for timestamps beyond maximum representable Date", () => {
  for (const bad of [
    8_640_000_000_001,
    8_640_000_000_001n,
    Number.MAX_SAFE_INTEGER,
    Number.MAX_VALUE,
    1e20,
    2n ** 64n - 1n,
    2n ** 256n - 1n,
  ]) {
    assert.throws(() => formatDeadline(bad), RangeError);
  }
});
