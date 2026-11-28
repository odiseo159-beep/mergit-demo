import { test } from "node:test";
import assert from "node:assert/strict";
import { explorerUrl } from "../src/explorer-url.js";

const TX_HASH = "0x" + "ab".repeat(32);
const ADDRESS = "0x" + "cd".repeat(20);

test("links a tx hash to the explorer tx page", () => {
  assert.equal(
    explorerUrl("tx", TX_HASH),
    `https://sepolia-explorer.giwa.io/tx/${TX_HASH}`,
  );
});

test("lowercases an uppercase tx hash", () => {
  assert.equal(
    explorerUrl("tx", TX_HASH.toUpperCase().replace("0X", "0x")),
    `https://sepolia-explorer.giwa.io/tx/${TX_HASH}`,
  );
});

test("rejects a tx hash that is not 0x plus 64 hex characters", () => {
  for (const bad of [
    "0x" + "ab".repeat(31),
    "0x" + "ab".repeat(33),
    "0x" + "zz".repeat(32),
    "ab".repeat(32),
    "0X" + "ab".repeat(32),
    123,
    null,
    undefined,
  ]) {
    assert.throws(() => explorerUrl("tx", bad), RangeError);
  }
});

test("links an address to the explorer address page", () => {
  assert.equal(
    explorerUrl("address", ADDRESS),
    `https://sepolia-explorer.giwa.io/address/${ADDRESS}`,
  );
});

test("lowercases an uppercase address", () => {
  assert.equal(
    explorerUrl("address", ADDRESS.toUpperCase().replace("0X", "0x")),
    `https://sepolia-explorer.giwa.io/address/${ADDRESS}`,
  );
});

test("rejects an address that is not 0x plus 40 hex characters", () => {
  for (const bad of [
    "0x" + "cd".repeat(19),
    "0x" + "cd".repeat(21),
    "0x" + "zz".repeat(20),
    "cd".repeat(20),
    123,
    null,
    undefined,
  ]) {
    assert.throws(() => explorerUrl("address", bad), RangeError);
  }
});

test("links a block number to the explorer block page", () => {
  assert.equal(
    explorerUrl("block", 123),
    "https://sepolia-explorer.giwa.io/block/123",
  );
});

test("links block zero", () => {
  assert.equal(
    explorerUrl("block", 0),
    "https://sepolia-explorer.giwa.io/block/0",
  );
});

test("accepts a bigint block number", () => {
  assert.equal(
    explorerUrl("block", 123n),
    "https://sepolia-explorer.giwa.io/block/123",
  );
});

test("prints large block numbers in full, not in exponent form", () => {
  assert.equal(
    explorerUrl("block", 1e21),
    "https://sepolia-explorer.giwa.io/block/1000000000000000000000",
  );
  assert.equal(
    explorerUrl("block", Number.MAX_SAFE_INTEGER),
    "https://sepolia-explorer.giwa.io/block/9007199254740991",
  );
});

test("rejects a block that is not a whole number >= 0", () => {
  for (const bad of [-1, -1n, 1.5, Number.NaN, Number.POSITIVE_INFINITY, "123", null, undefined]) {
    assert.throws(() => explorerUrl("block", bad), RangeError);
  }
});

test("rejects an unknown kind", () => {
  for (const bad of ["receipt", "transaction", "", 42, null, undefined]) {
    assert.throws(() => explorerUrl(bad, TX_HASH), TypeError);
  }
});
