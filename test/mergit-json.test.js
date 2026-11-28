import { test } from "node:test";
import assert from "node:assert/strict";
import { validateMergitJson } from "../src/mergit-json.js";

const ADDRESS = "0x23E8541dA96158d342477D694274E27639807686";

test("a valid file has no problems", () => {
  assert.deepEqual(validateMergitJson({ wallets: { "odiseo159-beep": ADDRESS } }), []);
});

test("an empty object is valid", () => {
  assert.deepEqual(validateMergitJson({}), []);
});

test("only wallets and funders are allowed", () => {
  const problems = validateMergitJson({ wallets: {}, escrow: "0x00" });
  assert.equal(problems.length, 1);
  assert.match(problems[0], /unknown key: escrow/);
});

test("a login that starts or ends with a hyphen is reported", () => {
  assert.match(validateMergitJson({ wallets: { "-bad": ADDRESS } })[0], /not a GitHub login/);
  assert.match(validateMergitJson({ wallets: { "bad-": ADDRESS } })[0], /not a GitHub login/);
});

test("a double hyphen is reported", () => {
  assert.match(validateMergitJson({ wallets: { "a--b": ADDRESS } })[0], /not a GitHub login/);
});

test("a login longer than 39 characters is reported", () => {
  const login = "a".repeat(40);
  assert.match(validateMergitJson({ wallets: { [login]: ADDRESS } })[0], /not a GitHub login/);
});

test("a wallet address must be 0x and 40 hex characters", () => {
  assert.match(validateMergitJson({ wallets: { ok: "0x123" } })[0], /not 0x and 40 hex/);
});

test("funders must be an array of addresses", () => {
  assert.match(validateMergitJson({ funders: ADDRESS })[0], /funders must be an array/);
  assert.match(validateMergitJson({ funders: [ADDRESS, "0x00"] })[0], /funder is not 0x and 40 hex/);
});

test("every problem is reported, not only the first", () => {
  const problems = validateMergitJson({ wallets: { "-a": "0x00", b: "0x01" }, funders: [1] });
  assert.equal(problems.length, 4);
});

test("it never throws", () => {
  for (const value of [null, undefined, [], "x", 42]) {
    assert.equal(Array.isArray(validateMergitJson(value)), true);
  }
  assert.deepEqual(validateMergitJson(null), ["config must be a plain object"]);
});
