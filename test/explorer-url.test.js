import { test } from "node:test";
import assert from "node:assert/strict";
import { explorerUrl } from "../src/explorer-url.js";

const HASH = "0x" + "AB".repeat(32);
const ADDRESS = "0x23E8541dA96158d342477D694274E27639807686";

test("builds a transaction link", () => {
  assert.equal(explorerUrl("tx", HASH), `https://sepolia-explorer.giwa.io/tx/${HASH.toLowerCase()}`);
});

test("builds an address link", () => {
  assert.equal(explorerUrl("address", ADDRESS), "https://sepolia-explorer.giwa.io/address/0x23e8541da96158d342477d694274e27639807686");
});

test("builds a block link from a number and from a bigint", () => {
  assert.equal(explorerUrl("block", 42), "https://sepolia-explorer.giwa.io/block/42");
  assert.equal(explorerUrl("block", 42n), "https://sepolia-explorer.giwa.io/block/42");
});

test("hashes and addresses come back lowercase", () => {
  assert.equal(explorerUrl("tx", HASH).endsWith(HASH.toLowerCase()), true);
  assert.equal(explorerUrl("address", ADDRESS).endsWith(ADDRESS.toLowerCase()), true);
});

test("refuses a malformed value", () => {
  assert.throws(() => explorerUrl("tx", "0x1234"), RangeError);
  assert.throws(() => explorerUrl("address", "0x123"), RangeError);
  assert.throws(() => explorerUrl("block", -1), RangeError);
  assert.throws(() => explorerUrl("block", 1.5), RangeError);
  assert.throws(() => explorerUrl("block", -1n), RangeError);
  assert.throws(() => explorerUrl("block", "42"), RangeError);
});

test("refuses an unknown kind with a TypeError", () => {
  assert.throws(() => explorerUrl("receipt", HASH), TypeError);
  assert.throws(() => explorerUrl(undefined, HASH), TypeError);
});
