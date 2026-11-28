import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { formatDeadline } from "../src/format-deadline.js";

test("formats a deadline in UTC", () => {
  assert.equal(formatDeadline(1796447642), "Dec 5, 2026, 05:14 UTC");
  assert.equal(formatDeadline(1796447642n), "Dec 5, 2026, 05:14 UTC");
});

test("is unaffected by the machine time zone", () => {
  const result = spawnSync(process.execPath, [
    "-e",
    "import('./src/format-deadline.js').then(({ formatDeadline }) => console.log(formatDeadline(1796447642)))",
  ], { env: { ...process.env, TZ: "Pacific/Auckland" }, encoding: "utf8" });

  assert.equal(result.status, 0);
  assert.equal(result.stdout.trim(), "Dec 5, 2026, 05:14 UTC");
});

test("rejects values with the required error types", () => {
  for (const bad of ["1796447642", null, undefined, {}, true]) {
    assert.throws(() => formatDeadline(bad), TypeError);
  }
  for (const bad of [-1, -1n, 1.5, Number.NaN, Infinity]) {
    assert.throws(() => formatDeadline(bad), RangeError);
  }
});
