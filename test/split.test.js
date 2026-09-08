import { test } from "node:test";
import assert from "node:assert/strict";
import { split, MAX_FEE_BPS } from "../src/split.js";

test("splits a bounty at the 1.5% fee used on GIWA Sepolia", () => {
  const { payout, fee } = split(500_000_000_000_000n, 150);
  assert.equal(fee, 7_500_000_000_000n);
  assert.equal(payout, 492_500_000_000_000n);
});

test("payout and fee always add back up to the original amount", () => {
  for (const amount of [1n, 999n, 10n ** 18n, 123_456_789n]) {
    const { payout, fee } = split(amount, 150);
    assert.equal(payout + fee, amount);
  }
});

test("a zero fee pays the developer everything", () => {
  const { payout, fee } = split(1_000n, 0);
  assert.equal(payout, 1_000n);
  assert.equal(fee, 0n);
});

test("rounding never pays out more than was locked", () => {
  const { payout, fee } = split(1n, 150);
  assert.equal(fee, 0n);
  assert.equal(payout, 1n);
});

test("rejects a fee above the hard cap", () => {
  assert.throws(() => split(1_000n, MAX_FEE_BPS + 1), RangeError);
});

test("rejects a number where wei is expected", () => {
  assert.throws(() => split(1000, 150), TypeError);
});
