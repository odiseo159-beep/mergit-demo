import { test } from "node:test";
import assert from "node:assert/strict";
import { isAddress } from "../src/address.js";

test("accepts a full address", () => {
  assert.equal(isAddress("0x23E8541dA96158d342477D694274E27639807686"), true);
});

test("accepts any letter case", () => {
  assert.equal(isAddress("0x23e8541da96158d342477d694274e27639807686"), true);
  assert.equal(isAddress("0X23E8541DA96158D342477D694274E27639807686"), false);
});

test("rejects a wrong length", () => {
  assert.equal(isAddress("0x123"), false);
  assert.equal(isAddress("0x23E8541dA96158d342477D694274E2763980768"), false);
  assert.equal(isAddress("0x23E8541dA96158d342477D694274E276398076861"), false);
});

test("rejects a missing 0x", () => {
  assert.equal(isAddress("23E8541dA96158d342477D694274E27639807686"), false);
});

test("rejects characters that are not hex", () => {
  assert.equal(isAddress("0x23E8541dA96158d342477D694274E2763980768Z"), false);
  assert.equal(isAddress("0x23E8541dA96158d342477D694274E27639807 86"), false);
});

test("never throws, and says no to everything that is not a string", () => {
  for (const value of [null, undefined, 42, 42n, {}, [], true, Symbol("x")]) {
    assert.equal(isAddress(value), false);
  }
});
