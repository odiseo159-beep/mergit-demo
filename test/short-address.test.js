import { test } from "node:test";
import assert from "node:assert/strict";
import { shortAddress } from "../src/short-address.js";

test("shortens an address the way the site does", () => {
  assert.equal(shortAddress("0x23E8541dA96158d342477D694274E27639807686"), "0x23E8\u20267686");
});

test("uses the ellipsis character, not three dots", () => {
  const short = shortAddress("0x23E8541dA96158d342477D694274E27639807686");
  assert.ok(short.includes("\u2026"));
  assert.ok(!short.includes("..."));
});

test("throws for anything that is not a full address", () => {
  for (const value of ["0x123", "0x23E8541dA96158d342477D694274E2763980768", "23E8541dA96158d342477D694274E27639807686", "", null, 42]) {
    assert.throws(() => shortAddress(value), TypeError);
  }
});
