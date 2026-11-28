import { test } from "node:test";
import assert from "node:assert/strict";
import { explorerUrl } from "../src/explorer-url.js";

const TX = "0xAbCdEf0123456789aBcDeF0123456789AbCdEf0123456789aBcDeF0123456789";

test("builds the tx link and lowercases the hash", () => {
  assert.equal(explorerUrl("tx", TX), `https://sepolia-explorer.giwa.io/tx/${TX.toLowerCase()}`);
});

test("builds the address link and lowercases it", () => {
  const address = "0xAbCdEf0123456789aBcDeF0123456789AbCdEf01";
  assert.equal(
    explorerUrl("address", address),
    `https://sepolia-explorer.giwa.io/address/${address.toLowerCase()}`,
  );
});

test("builds the block link from a number and from a bigint", () => {
  assert.equal(explorerUrl("block", 0), "https://sepolia-explorer.giwa.io/block/0");
  assert.equal(explorerUrl("block", 1234567), "https://sepolia-explorer.giwa.io/block/1234567");
  assert.equal(explorerUrl("block", 1234567n), "https://sepolia-explorer.giwa.io/block/1234567");
});

test("rejects a malformed tx hash", () => {
  assert.throws(() => explorerUrl("tx", "0x1234"), RangeError);
  assert.throws(() => explorerUrl("tx", TX.slice(2)), RangeError);
  assert.throws(() => explorerUrl("tx", `${TX}00`), RangeError);
  assert.throws(() => explorerUrl("tx", TX.replace("0xAbCd", "0xAbCG")), RangeError);
});

test("rejects a malformed address", () => {
  assert.throws(() => explorerUrl("address", "0x1234"), RangeError);
  assert.throws(() => explorerUrl("address", TX), RangeError);
  assert.throws(() => explorerUrl("address", 42), RangeError);
});

test("rejects a block that is not a whole, non-negative number", () => {
  assert.throws(() => explorerUrl("block", 1.5), RangeError);
  assert.throws(() => explorerUrl("block", -1), RangeError);
  assert.throws(() => explorerUrl("block", -1n), RangeError);
  assert.throws(() => explorerUrl("block", "12"), RangeError);
});

test("rejects an unknown kind with a TypeError", () => {
  assert.throws(() => explorerUrl("receipt", TX), TypeError);
  assert.throws(() => explorerUrl(undefined, TX), TypeError);
});
