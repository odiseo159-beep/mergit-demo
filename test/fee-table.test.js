import { test } from "node:test";
import assert from "node:assert/strict";
import { feeTable } from "../src/fee-table.js";
import { MAX_FEE_BPS } from "../src/split.js";

const HEADER = "| Amount (wei) | Fee (wei) | Payout (wei) |";
const SEPARATOR = "|---|---|---|";

test("renders the header, separator and one row per amount", () => {
  const table = feeTable([500_000_000_000_000n], 150);
  assert.equal(
    table,
    [
      HEADER,
      SEPARATOR,
      "| 500000000000000 | 7500000000000 | 492500000000000 |",
    ].join("\n"),
  );
});

test("keeps the amounts in order, one row each", () => {
  const table = feeTable([1_000n, 2_000n, 3_000n], 0);
  const lines = table.split("\n");
  assert.equal(lines[0], HEADER);
  assert.equal(lines[1], SEPARATOR);
  assert.deepEqual(lines.slice(2), [
    "| 1000 | 0 | 1000 |",
    "| 2000 | 0 | 2000 |",
    "| 3000 | 0 | 3000 |",
  ]);
});

test("an empty list gives only the two header lines", () => {
  assert.equal(feeTable([], 150), [HEADER, SEPARATOR].join("\n"));
});

test("has no trailing newline", () => {
  const table = feeTable([1n], 150);
  assert.ok(!table.endsWith("\n"));
});

test("fee and payout always add back up to the amount", () => {
  for (const amount of [1n, 999n, 10n ** 18n, 123_456_789n]) {
    const row = feeTable([amount], 150).split("\n")[2];
    const cells = row.split("|").map((cell) => cell.trim());
    assert.equal(cells[1], amount.toString());
    const fee = BigInt(cells[2]);
    const payout = BigInt(cells[3]);
    assert.equal(fee + payout, amount);
  }
});

test("rejects anything that is not an array", () => {
  for (const bad of [42, "1000", null, undefined, {}]) {
    assert.throws(() => feeTable(bad, 150), TypeError);
  }
});

test("bad amounts fail the way split does", () => {
  assert.throws(() => feeTable([1000], 150), TypeError);
  assert.throws(() => feeTable([-1n], 150), RangeError);
});

test("bad fees fail the way split does", () => {
  assert.throws(() => feeTable([1_000n], MAX_FEE_BPS + 1), RangeError);
  assert.throws(() => feeTable([1_000n], -1), RangeError);
  assert.throws(() => feeTable([1_000n], 1.5), RangeError);
});
