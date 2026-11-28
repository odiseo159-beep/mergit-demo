import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { formatDeadline } from "../src/format-deadline.js";

test("formats the issue example", () => {
  assert.equal(formatDeadline(1796447642), "Dec 5, 2026, 05:14 UTC");
});

test("accepts a bigint, as the chain returns", () => {
  assert.equal(formatDeadline(1796447642n), "Dec 5, 2026, 05:14 UTC");
});

test("always uses UTC, with two-digit hours and minutes", () => {
  assert.equal(formatDeadline(0), "Jan 1, 1970, 00:00 UTC");
  assert.equal(formatDeadline(1700000000), "Nov 14, 2023, 22:13 UTC");
});

test("gives the same answer in another time zone", () => {
  const repoRoot = fileURLToPath(new URL("../", import.meta.url));
  const out = execFileSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      "import { formatDeadline } from './src/format-deadline.js'; console.log(formatDeadline(1796447642));",
    ],
    { cwd: repoRoot, env: { ...process.env, TZ: "America/New_York" }, encoding: "utf8" },
  ).trim();
  assert.equal(out, "Dec 5, 2026, 05:14 UTC");
});

test("rejects what is not a number or a bigint", () => {
  assert.throws(() => formatDeadline("1796447642"), TypeError);
  assert.throws(() => formatDeadline(null), TypeError);
  assert.throws(() => formatDeadline(undefined), TypeError);
  assert.throws(() => formatDeadline({}), TypeError);
  assert.throws(() => formatDeadline(true), TypeError);
});

test("rejects a negative value or a number that is not whole", () => {
  assert.throws(() => formatDeadline(-1), RangeError);
  assert.throws(() => formatDeadline(-1n), RangeError);
  assert.throws(() => formatDeadline(1.5), RangeError);
  assert.throws(() => formatDeadline(Number.NaN), RangeError);
  assert.throws(() => formatDeadline(Infinity), RangeError);
});
