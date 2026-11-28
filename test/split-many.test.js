import { test } from "node:test";
import assert from "node:assert/strict";
import { splitMany } from "../src/split-many.js";
import { MAX_FEE_BPS } from "../src/split.js";

test("splits a batch of bounties at the 1.5% fee used on GIWA Sepolia", () => {
  const amounts = [500_000_000_000_000n, 300_000_000_000_000n, 200_000_000_000_000n];
  const { items, totalPayout, totalFee } = splitMany(amounts, 150);

  // First: 500T -> fee 7.5T, payout 492.5T
  assert.equal(items[0].fee, 7_500_000_000_000n);
  assert.equal(items[0].payout, 492_500_000_000_000n);

  // Second: 300T -> fee 4.5T, payout 295.5T
  assert.equal(items[1].fee, 4_500_000_000_000n);
  assert.equal(items[1].payout, 295_500_000_000_000n);

  // Third: 200T -> fee 3T, payout 197T
  assert.equal(items[2].fee, 3_000_000_000_000n);
  assert.equal(items[2].payout, 197_000_000_000_000n);

  // Totals
  assert.equal(totalPayout + totalFee, 1_000_000_000_000_000n);
  assert.equal(totalFee, 15_000_000_000_000n);
  assert.equal(totalPayout, 985_000_000_000_000n);
});

test("totalPayout + totalFee equals sum of amounts", () => {
  const amounts = [1n, 999n, 10n ** 18n, 123_456_789n];
  for (const feeBps of [0, 150, 500]) {
    const { items, totalPayout, totalFee } = splitMany(amounts, feeBps);
    const sum = amounts.reduce((a, b) => a + b, 0n);
    assert.equal(totalPayout + totalFee, sum);
  }
});

test("empty list gives empty items and zero totals", () => {
  const { items, totalPayout, totalFee } = splitMany([], 150);
  assert.deepEqual(items, []);
  assert.equal(totalPayout, 0n);
  assert.equal(totalFee, 0n);
});

test("throws TypeError when amounts is not an array", () => {
  assert.throws(() => splitMany("not an array", 150), TypeError);
  assert.throws(() => splitMany(123, 150), TypeError);
  assert.throws(() => splitMany(null, 150), TypeError);
  assert.throws(() => splitMany({ 0: 100n }, 150), TypeError);
});

test("rejects a fee above the hard cap", () => {
  assert.throws(() => splitMany([1000n], MAX_FEE_BPS + 1), RangeError);
});

test("rejects non-integer feeBps", () => {
  assert.throws(() => splitMany([1000n], 1.5), RangeError);
  assert.throws(() => splitMany([1000n], -1), RangeError);
});

test("rejects a number where wei is expected in amounts", () => {
  assert.throws(() => splitMany([1000n, 1000], 150), TypeError);
});

test("rejects negative amount in amounts", () => {
  assert.throws(() => splitMany([-1n], 150), RangeError);
});

test("a zero fee pays the developer everything for all amounts", () => {
  const amounts = [1000n, 2000n, 3000n];
  const { items, totalPayout, totalFee } = splitMany(amounts, 0);
  assert.equal(items[0].payout, 1000n);
  assert.equal(items[0].fee, 0n);
  assert.equal(items[1].payout, 2000n);
  assert.equal(items[1].fee, 0n);
  assert.equal(items[2].payout, 3000n);
  assert.equal(items[2].fee, 0n);
  assert.equal(totalPayout, 6000n);
  assert.equal(totalFee, 0n);
});

test("rounding never pays out more than was locked per item", () => {
  const amounts = [1n, 1n, 1n];
  const { items, totalPayout, totalFee } = splitMany(amounts, 150);
  for (const item of items) {
    assert.equal(item.payout + item.fee, 1n);
    assert.ok(item.payout <= 1n);
  }
});