import { test } from "node:test";
import assert from "node:assert/strict";
import { splitMany } from "../src/split-many.js";

test("splits every amount, in order", () => {
  const { items } = splitMany([500_000_000_000_000n, 1_000n], 150);
  assert.deepEqual(items, [
    { payout: 492_500_000_000_000n, fee: 7_500_000_000_000n },
    { payout: 985n, fee: 15n },
  ]);
});

test("the totals add up to the amounts that were split", () => {
  const amounts = [1n, 999n, 10n ** 18n, 123_456_789n];
  const { totalPayout, totalFee } = splitMany(amounts, 150);
  const sum = amounts.reduce((acc, a) => acc + a, 0n);
  assert.equal(totalPayout + totalFee, sum);
});

test("an empty list gives no items and zero totals", () => {
  assert.deepEqual(splitMany([], 150), { items: [], totalPayout: 0n, totalFee: 0n });
});

test("rejects a list that is not an array", () => {
  assert.throws(() => splitMany(500n, 150), TypeError);
  assert.throws(() => splitMany("500", 150), TypeError);
});

test("bad amounts fail the way split does", () => {
  assert.throws(() => splitMany([1000], 150), TypeError);
  assert.throws(() => splitMany([1_000n], 501), RangeError);
});
