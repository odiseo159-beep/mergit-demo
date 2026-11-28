import { test } from "node:test";
import assert from "node:assert/strict";
import { feeTable } from "../src/fee-table.js";

test("the first two lines are the header and the separator", () => {
  const lines = feeTable([], 150).split("\n");
  assert.equal(lines[0], "| Amount (wei) | Fee (wei) | Payout (wei) |");
  assert.equal(lines[1], "|---|---|---|");
});

test("an empty list gives only the two header lines", () => {
  assert.equal(feeTable([], 150), "| Amount (wei) | Fee (wei) | Payout (wei) |\n|---|---|---|");
});

test("one row per amount, in order", () => {
  const table = feeTable([500_000_000_000_000n], 150);
  assert.ok(table.includes("| 500000000000000 | 7500000000000 | 492500000000000 |"));
});

test("rows keep the order they were given", () => {
  const lines = feeTable([1n, 2n], 0).split("\n").slice(2);
  assert.equal(lines[0], "| 1 | 0 | 1 |");
  assert.equal(lines[1], "| 2 | 0 | 2 |");
});

test("there is no trailing newline", () => {
  assert.ok(!feeTable([1n], 150).endsWith("\n"));
});

test("rejects a list that is not an array", () => {
  assert.throws(() => feeTable(1n, 150), TypeError);
});

test("bad amounts or fees fail the way split does", () => {
  assert.throws(() => feeTable([1000], 150), TypeError);
  assert.throws(() => feeTable([1n], 501), RangeError);
});
