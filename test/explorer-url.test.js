import { test } from "node:test";
import assert from "node:assert/strict";
import { explorerUrl } from "../src/explorer-url.js";

test("builds transaction explorer URLs and lowercases hashes", () => {
  assert.equal(
    explorerUrl("tx", "0x" + "Ab".repeat(32)),
    "https://sepolia-explorer.giwa.io/tx/0x" + "ab".repeat(32),
  );
});

test("builds address explorer URLs and lowercases addresses", () => {
  assert.equal(
    explorerUrl("address", "0x" + "Ab".repeat(20)),
    "https://sepolia-explorer.giwa.io/address/0x" + "ab".repeat(20),
  );
});

test("builds block explorer URLs for numbers and bigints", () => {
  assert.equal(explorerUrl("block", 0), "https://sepolia-explorer.giwa.io/block/0");
  assert.equal(explorerUrl("block", 12345678901234567890n), "https://sepolia-explorer.giwa.io/block/12345678901234567890");
});

test("rejects invalid transaction hashes", () => {
  for (const bad of ["0x", "0x" + "a".repeat(63), "0x" + "a".repeat(65), "0X" + "a".repeat(64), "0x" + "g".repeat(64), 1, null]) {
    assert.throws(() => explorerUrl("tx", bad), RangeError);
  }
});

test("rejects invalid addresses", () => {
  for (const bad of ["0x", "0x" + "a".repeat(39), "0x" + "a".repeat(41), "0X" + "a".repeat(40), "0x" + "g".repeat(40), 1, null]) {
    assert.throws(() => explorerUrl("address", bad), RangeError);
  }
});

test("rejects invalid blocks", () => {
  for (const bad of [-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY, -1n, "0", null]) {
    assert.throws(() => explorerUrl("block", bad), RangeError);
  }
});

test("rejects unknown kinds", () => {
  for (const bad of ["transaction", "", null, undefined]) {
    assert.throws(() => explorerUrl(bad, "0"), TypeError);
  }
});
