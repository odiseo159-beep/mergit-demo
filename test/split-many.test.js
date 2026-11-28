import { test } from "node:test";
import assert from "node:assert/strict";
import { splitMany } from "../src/split-many.js";
import { MAX_FEE_BPS } from "../src/split.js";

test("splitMany splits a list of bounties and adds them up", () => {
  const amounts = [100_000n, 200_000n, 300_000n];
  const feeBps = 150;
  const result = splitMany(amounts, feeBps);

  assert.equal(result.items.length, 3);
  assert.equal(result.items[0].fee, 1500n);
  assert.equal(result.items[0].payout, 98500n);
  assert.equal(result.items[1].fee, 3000n);
  assert.equal(result.items[1].payout, 197000n);
  assert.equal(result.items[2].fee, 4500n);
  assert.equal(result.items[2].payout, 295500n);

  assert.equal(result.totalPayout, 98500n + 197000n + 295500n);
  assert.equal(result.totalFee, 1500n + 3000n + 4500n);
  assert.equal(result.totalPayout + result.totalFee, 600_000n);
});

test("totalPayout + totalFee equals the sum of the amounts", () => {
  const amounts = [1n, 999n, 10n ** 18n, 500_000_000_000_000n];
  const feeBps = 150;
  const { totalPayout, totalFee } = splitMany(amounts, feeBps);
  const sum = amounts.reduce((acc, val) => acc + val, 0n);
  assert.equal(totalPayout + totalFee, sum);
});

test("an empty list gives items: [] and both totals at 0n", () => {
  const result = splitMany([], 150);
  assert.deepEqual(result.items, []);
  assert.equal(result.totalPayout, 0n);
  assert.equal(result.totalFee, 0n);
});

test("throws TypeError when amounts is not an array", () => {
  assert.throws(() => splitMany(null, 150), TypeError);
  assert.throws(() => splitMany(undefined, 150), TypeError);
  assert.throws(() => splitMany("100", 150), TypeError);
  assert.throws(() => splitMany(100n, 150), TypeError);
  assert.throws(() => splitMany({}, 150), TypeError);
});

test("bad amounts fail the same way split does", () => {
  assert.throws(() => splitMany([1000], 150), TypeError); // number instead of bigint
  assert.throws(() => splitMany([100n, -50n], 150), RangeError); // negative amount
});

test("bad fees fail the same way split does", () => {
  assert.throws(() => splitMany([100n], MAX_FEE_BPS + 1), RangeError);
  assert.throws(() => splitMany([100n], -1), RangeError);
  assert.throws(() => splitMany([100n], 1.5), RangeError);
});
