import { test } from "node:test";
import assert from "node:assert/strict";
import { explorerUrl } from "../src/explorer-url.js";

const HASH = "0x" + "ab".repeat(32);
const ADDRESS = "0x" + "cd".repeat(20);

test("a tx hash builds the explorer link under /tx", () => {
  assert.equal(explorerUrl("tx", HASH), `https://sepolia-explorer.giwa.io/tx/${HASH}`);
});

test("an address builds the explorer link under /address", () => {
  assert.equal(explorerUrl("address", ADDRESS), `https://sepolia-explorer.giwa.io/address/${ADDRESS}`);
});

test("a block number builds the explorer link under /block", () => {
  assert.equal(explorerUrl("block", 123), "https://sepolia-explorer.giwa.io/block/123");
});

test("a block bigint builds the explorer link under /block", () => {
  assert.equal(explorerUrl("block", 123n), "https://sepolia-explorer.giwa.io/block/123");
});

test("a block of zero is allowed", () => {
  assert.equal(explorerUrl("block", 0), "https://sepolia-explorer.giwa.io/block/0");
  assert.equal(explorerUrl("block", 0n), "https://sepolia-explorer.giwa.io/block/0");
});

test("hashes and addresses come back lowercase", () => {
  const upperHash = "0x" + HASH.slice(2).toUpperCase();
  const upperAddress = "0x" + ADDRESS.slice(2).toUpperCase();
  assert.equal(explorerUrl("tx", upperHash), `https://sepolia-explorer.giwa.io/tx/${HASH}`);
  assert.equal(explorerUrl("address", upperAddress), `https://sepolia-explorer.giwa.io/address/${ADDRESS}`);
});

test("rejects a tx hash of the wrong shape", () => {
  for (const bad of [HASH.slice(0, -1), HASH + "a", HASH.replace("0x", ""), "0x" + "zz".repeat(32), 123, null, undefined]) {
    assert.throws(() => explorerUrl("tx", bad), RangeError);
  }
});

test("rejects an address of the wrong shape", () => {
  for (const bad of [ADDRESS.slice(0, -1), ADDRESS + "a", ADDRESS.replace("0x", ""), "0x" + "zz".repeat(20), 123, null, undefined]) {
    assert.throws(() => explorerUrl("address", bad), RangeError);
  }
});

test("rejects a block that is not a non-negative whole number", () => {
  for (const bad of [-1, -1n, 1.5, Number.NaN, "123", null, undefined]) {
    assert.throws(() => explorerUrl("block", bad), RangeError);
  }
});

test("rejects an unknown kind", () => {
  assert.throws(() => explorerUrl("transaction", HASH), TypeError);
  assert.throws(() => explorerUrl("", HASH), TypeError);
});
