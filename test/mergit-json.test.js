import { test } from "node:test";
import assert from "node:assert/strict";
import { validateMergitJson } from "../src/mergit-json.js";

const VALID_ADDRESS = "0x23E8541dA96158d342477D694274E27639807686";

test("accepts the documented happy-path config", () => {
  assert.deepEqual(
    validateMergitJson({ wallets: { "odiseo159-beep": VALID_ADDRESS } }),
    [],
  );
});

test("accepts an empty object", () => {
  assert.deepEqual(validateMergitJson({}), []);
});

test("accepts wallets and funders together", () => {
  assert.deepEqual(
    validateMergitJson({
      wallets: { alice: VALID_ADDRESS },
      funders: [VALID_ADDRESS, "0x0000000000000000000000000000000000000000"],
    }),
    [],
  );
});

test("accepts an empty wallets map and empty funders array", () => {
  assert.deepEqual(validateMergitJson({ wallets: {}, funders: [] }), []);
});

test("rejects a non-object config", () => {
  for (const bad of [null, undefined, 42, "x", [], true]) {
    const problems = validateMergitJson(bad);
    assert.equal(problems.length, 1, `expected one problem for ${String(bad)}`);
    assert.match(problems[0], /plain object/);
  }
});

test("rejects unknown top-level keys", () => {
  const problems = validateMergitJson({ wallets: {}, extra: true });
  assert.equal(problems.length, 1);
  assert.match(problems[0], /unknown key "extra"/);
});

test("reports every unknown key, not just the first", () => {
  const problems = validateMergitJson({ nope: 1, alsoBad: 2 });
  assert.equal(problems.length, 2);
  assert.ok(problems.some((p) => p.includes('"nope"')));
  assert.ok(problems.some((p) => p.includes('"alsoBad"')));
});

test("rejects a non-object wallets value", () => {
  for (const bad of [[], "x", 5, null]) {
    const problems = validateMergitJson({ wallets: bad });
    assert.ok(problems.some((p) => /"wallets" must be an object/.test(p)));
  }
});

test("rejects a non-array funders value", () => {
  for (const bad of [{}, "x", 5, null]) {
    const problems = validateMergitJson({ funders: bad });
    assert.ok(problems.some((p) => /"funders" must be an array/.test(p)));
  }
});

test("accepts logins of length 1 and 39", () => {
  assert.deepEqual(validateMergitJson({ wallets: { a: VALID_ADDRESS } }), []);
  const long = "a".repeat(39);
  assert.deepEqual(validateMergitJson({ wallets: { [long]: VALID_ADDRESS } }), []);
});

test("rejects logins longer than 39 characters", () => {
  const tooLong = "a".repeat(40);
  const problems = validateMergitJson({ wallets: { [tooLong]: VALID_ADDRESS } });
  assert.ok(problems.some((p) => /invalid GitHub login/.test(p)));
});

test("rejects logins that start or end with a hyphen", () => {
  for (const bad of ["-alice", "alice-", "-"]) {
    const problems = validateMergitJson({ wallets: { [bad]: VALID_ADDRESS } });
    assert.ok(
      problems.some((p) => p.includes(`invalid GitHub login "${bad}"`)),
      `expected login problem for ${bad}`,
    );
  }
});

test("rejects logins with a doubled hyphen", () => {
  const problems = validateMergitJson({ wallets: { "al--ice": VALID_ADDRESS } });
  assert.ok(problems.some((p) => /invalid GitHub login/.test(p)));
});

test("accepts logins with single internal hyphens, digits and mixed case", () => {
  assert.deepEqual(
    validateMergitJson({
      wallets: { "a-b-c-1": VALID_ADDRESS, "User123": VALID_ADDRESS },
    }),
    [],
  );
});

test("rejects a wallet address that is not 0x + 40 hex characters", () => {
  const bad = [
    "23E8541dA96158d342477D694274E27639807686", // no 0x
    "0x23E8541dA96158d342477D694274E2763980768", // 39 hex
    "0x23E8541dA96158d342477D694274E276398076866", // 41 hex
    "0xZZ8541dA96158d342477D694274E27639807686", // non-hex
    "",
  ];
  for (const address of bad) {
    const problems = validateMergitJson({ wallets: { alice: address } });
    assert.ok(
      problems.some((p) => p.includes('invalid address for "alice"')),
      `expected address problem for ${address}`,
    );
  }
});

test("rejects a funder entry that is not a valid address", () => {
  const problems = validateMergitJson({ funders: [VALID_ADDRESS, "0xnope"] });
  assert.equal(problems.length, 1);
  assert.match(problems[0], /"funders"\[1\]/);
});

test("reports every bad funder entry, not just the first", () => {
  const problems = validateMergitJson({ funders: ["bad", "worse", VALID_ADDRESS] });
  assert.equal(problems.length, 2);
  assert.match(problems[0], /"funders"\[0\]/);
  assert.match(problems[1], /"funders"\[1\]/);
});

test("reports every problem at once, not only the first", () => {
  const problems = validateMergitJson({
    extra: true,
    wallets: { "-bad-": "nope" },
    funders: ["0xnope"],
  });
  // unknown key + invalid login + invalid wallet address + invalid funder
  assert.equal(problems.length, 4);
});

test("never throws on hostile input", () => {
  const weird = [
    Symbol("x"),
    () => {},
    Object.create(null),
    new Date(),
    /re/,
    Number.NaN,
  ];
  for (const value of weird) {
    assert.doesNotThrow(() => validateMergitJson(value));
  }
});