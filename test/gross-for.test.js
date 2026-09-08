import { test } from "node:test";
import assert from "node:assert/strict";
import { split, grossFor, MAX_FEE_BPS } from "../src/split.js";

test("a funder locking grossFor() leaves the developer whole", () => {
  for (const net of [1n, 7n, 1_000n, 492_500_000_000_000n, 10n ** 18n]) {
    const gross = grossFor(net, 150);
    assert.ok(split(gross, 150).payout >= net, `developer short for net=${net}`);
  }
});

test("with no fee the funder locks exactly the target", () => {
  assert.equal(grossFor(1_000n, 0), 1_000n);
});

test("rounds up rather than leaving the developer a wei short", () => {
  assert.equal(grossFor(1n, 150), 2n);
});

test("rejects a fee above the hard cap", () => {
  assert.throws(() => grossFor(1_000n, MAX_FEE_BPS + 1), RangeError);
});
