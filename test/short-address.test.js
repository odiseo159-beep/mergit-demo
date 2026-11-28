import { test } from "node:test";
import assert from "node:assert/strict";
import { shortAddress } from "../src/short-address.js";

test("shortens a full EVM address into first 6 + ellipsis + last 4", () => {
  const result = shortAddress("0x23E8541dA96158d342477D694274E27639807686");
  assert.equal(result, "0x23E8\u20267686");
});

test("preserves case of hexadecimal characters", () => {
  const lowercase = "0x1234567890abcdef1234567890abcdef12345678";
  assert.equal(shortAddress(lowercase), "0x1234\u20265678");

  const uppercase = "0xABCDEF1234567890ABCDEF1234567890ABCDEF12";
  assert.equal(shortAddress(uppercase), "0xABCD\u2026EF12");
});

test("throws TypeError for anything that is not a full address", () => {
  // Too short
  assert.throws(() => shortAddress("0x1234"), TypeError);
  // Missing 0x prefix
  assert.throws(() => shortAddress("23E8541dA96158d342477D694274E27639807686"), TypeError);
  // Too long
  assert.throws(() => shortAddress("0x23E8541dA96158d342477D694274E2763980768600"), TypeError);
  // Non-hex characters
  assert.throws(() => shortAddress("0xZZZZ541dA96158d342477D694274E27639807686"), TypeError);
  // Non-strings
  assert.throws(() => shortAddress(null), TypeError);
  assert.throws(() => shortAddress(undefined), TypeError);
  assert.throws(() => shortAddress(123456), TypeError);
  assert.throws(() => shortAddress({}), TypeError);
  assert.throws(() => shortAddress([]), TypeError);
});
