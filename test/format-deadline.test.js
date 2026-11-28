import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { formatDeadline } from "../src/format-deadline.js";

test("formats the escrow deadline the way a receipt reads it", () => {
  assert.equal(formatDeadline(1796447642), "Dec 5, 2026, 05:14 UTC");
});

test("zero-pads the hours and minutes", () => {
  assert.equal(formatDeadline(1796447640), "Dec 5, 2026, 05:14 UTC");
  // 2026-01-02T03:04:00Z
  assert.equal(formatDeadline(Date.UTC(2026, 0, 2, 3, 4) / 1000), "Jan 2, 2026, 03:04 UTC");
});

test("accepts a bigint, as the chain returns it", () => {
  assert.equal(formatDeadline(1796447642n), "Dec 5, 2026, 05:14 UTC");
});

test("stays in UTC whatever the machine's time zone is", () => {
  const moduleUrl = new URL("../src/format-deadline.js", import.meta.url).href;
  const printed = execFileSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `import { formatDeadline } from ${JSON.stringify(moduleUrl)};
       process.stdout.write(formatDeadline(1796447642));`,
    ],
    { env: { ...process.env, TZ: "Pacific/Kiritimati" }, encoding: "utf8" },
  );
  assert.equal(printed, "Dec 5, 2026, 05:14 UTC");
});

test("rejects what is not a number or a bigint", () => {
  assert.throws(() => formatDeadline("1796447642"), TypeError);
  assert.throws(() => formatDeadline(new Date()), TypeError);
  assert.throws(() => formatDeadline(undefined), TypeError);
});

test("rejects a negative or fractional value", () => {
  assert.throws(() => formatDeadline(-1), RangeError);
  assert.throws(() => formatDeadline(-1n), RangeError);
  assert.throws(() => formatDeadline(1.5), RangeError);
});
