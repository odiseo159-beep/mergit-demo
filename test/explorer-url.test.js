import { test } from "node:test";
import assert from "node:assert/strict";
import { explorerUrl } from "../src/explorer-url.js";

const BASE = "https://sepolia-explorer.giwa.io";
const TX_LOWER = "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
const TX_UPPER = "0x0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF";
const TX_MIXED = "0x0123456789AbCdEf0123456789aBcDeF0123456789ABCDEF0123456789abcdef";

const ADDR_LOWER = "0x23e8541da96158d342477d694274e27639807686";
const ADDR_CHECKSUM = "0x23E8541dA96158d342477D694274E27639807686";
const ADDR_UPPER = "0x23E8541DA96158D342477D694274E27639807686";

test("builds a tx URL and normalizes hex to lowercase", () => {
  assert.equal(explorerUrl("tx", TX_LOWER), `${BASE}/tx/${TX_LOWER}`);
  assert.equal(explorerUrl("tx", TX_UPPER), `${BASE}/tx/${TX_LOWER}`);
  assert.equal(explorerUrl("tx", TX_MIXED), `${BASE}/tx/${TX_LOWER}`);
});

test("builds an address URL and normalizes hex to lowercase", () => {
  assert.equal(explorerUrl("address", ADDR_LOWER), `${BASE}/address/${ADDR_LOWER}`);
  assert.equal(explorerUrl("address", ADDR_CHECKSUM), `${BASE}/address/${ADDR_LOWER}`);
  assert.equal(explorerUrl("address", ADDR_UPPER), `${BASE}/address/${ADDR_LOWER}`);
  const zeroAddr = `0x${"0".repeat(40)}`;
  assert.equal(explorerUrl("address", zeroAddr), `${BASE}/address/${zeroAddr}`);
});

test("builds a block URL for non-negative safe integer numbers and bigints", () => {
  assert.equal(explorerUrl("block", 0), `${BASE}/block/0`);
  assert.equal(explorerUrl("block", -0), `${BASE}/block/0`);
  assert.equal(explorerUrl("block", 123456), `${BASE}/block/123456`);
  assert.equal(
    explorerUrl("block", Number.MAX_SAFE_INTEGER),
    `${BASE}/block/${Number.MAX_SAFE_INTEGER}`,
  );
  assert.equal(explorerUrl("block", 0n), `${BASE}/block/0`);
  assert.equal(explorerUrl("block", 1n), `${BASE}/block/1`);
  assert.equal(
    explorerUrl("block", 123456789012345678901234567890n),
    `${BASE}/block/123456789012345678901234567890`,
  );
});

test("rejects an invalid or non-string kind with TypeError", () => {
  const invalidKinds = [
    "",
    "TX",
    "Address",
    "BLOCK",
    " tx",
    "tx ",
    "transaction",
    "account",
    "blocks",
    "toString",
    "constructor",
    "__proto__",
    "hasOwnProperty",
    null,
    undefined,
    123,
    0n,
    true,
    false,
    {},
    ["tx"],
    new String("tx"),
    Symbol("tx"),
    Object.create(null),
  ];

  for (const kind of invalidKinds) {
    assert.throws(() => explorerUrl(kind, TX_LOWER), TypeError);
    assert.throws(() => explorerUrl(kind, null), TypeError);
  }
});

test("rejects invalid tx hashes with RangeError", () => {
  const invalidTxs = [
    "",
    "0x",
    TX_LOWER.slice(2), // missing 0x prefix
    `0X${TX_LOWER.slice(2)}`, // uppercase 0X prefix
    `0x${"a".repeat(63)}`, // too short
    `0x${"a".repeat(65)}`, // too long
    ADDR_LOWER, // 40 hex chars instead of 64
    `0x${"g".repeat(64)}`, // non-hex chars
    `0x${"a".repeat(63)}z`,
    ` ${TX_LOWER}`,
    `${TX_LOWER} `,
    `${TX_LOWER}\n`,
    `0x${"a".repeat(31)} ${"a".repeat(32)}`,
    null,
    undefined,
    123,
    0n,
    true,
    {},
    [],
    [TX_LOWER],
    new String(TX_LOWER),
    Symbol("tx"),
    Object.create(null),
  ];

  for (const bad of invalidTxs) {
    assert.throws(() => explorerUrl("tx", bad), RangeError);
  }
});

test("rejects invalid addresses with RangeError", () => {
  const invalidAddresses = [
    "",
    "0x",
    ADDR_LOWER.slice(2), // missing 0x prefix
    `0X${ADDR_LOWER.slice(2)}`, // uppercase 0X prefix
    `0x${"a".repeat(39)}`, // too short
    `0x${"a".repeat(41)}`, // too long
    TX_LOWER, // 64 hex chars instead of 40
    `0x${"g".repeat(40)}`, // non-hex chars
    `0x${"a".repeat(39)}!`,
    ` ${ADDR_LOWER}`,
    `${ADDR_LOWER} `,
    `${ADDR_LOWER}\n`,
    `0x${"a".repeat(19)} ${"a".repeat(20)}`,
    null,
    undefined,
    123,
    0n,
    false,
    {},
    [],
    [ADDR_LOWER],
    new String(ADDR_LOWER),
    Symbol("address"),
    Object.create(null),
  ];

  for (const bad of invalidAddresses) {
    assert.throws(() => explorerUrl("address", bad), RangeError);
  }
});

test("rejects invalid block numbers with RangeError", () => {
  const invalidBlocks = [
    -1,
    -42,
    -1n,
    -100n,
    0.5,
    1.5,
    -1.5,
    Number.EPSILON,
    Number.NaN,
    Infinity,
    -Infinity,
    Number.MAX_SAFE_INTEGER + 1,
    1e21,
    "",
    "0",
    "123",
    "0x1",
    " 1 ",
    null,
    undefined,
    true,
    false,
    {},
    [],
    [1],
    new Number(1),
    Object(1n),
    Symbol("block"),
    Object.create(null),
  ];

  for (const bad of invalidBlocks) {
    assert.throws(() => explorerUrl("block", bad), RangeError);
  }
});
