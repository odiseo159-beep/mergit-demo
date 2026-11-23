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

test("rejects logins with invalid characters", () => {
  for (const bad of ["al ice", "al_ice", "al.ice", "al/ice", "al@ice"]) {
    const problems = validateMergitJson({ wallets: { [bad]: VALID_ADDRESS } });
    assert.ok(
      problems.some((p) => /invalid GitHub login/.test(p)),
      `expected login problem for ${bad}`,
    );
  }
});

test("rejects a wallet address that is not 0x + 40 hex chars", () => {
  const bads = [
    "23E8541dA96158d342477D694274E27639807686", // no 0x
    "0x23E8541dA96158d342477D694274E2763980768", // 39 hex
    "0x23E8541dA96158d342477D694274E276398076866", // 41 hex
    "0xZZ8541dA96158d342477D694274E27639807686", // non-hex
    "",
  ];
  for (const bad of bads) {
    const problems = validateMergitJson({ wallets: { alice: bad } });
    assert.ok(
      problems.some((p) => p.includes('invalid address for "alice"')),
      `expected address problem for ${bad}`,
    );
  }
});

test("rejects a non-string wallet address", () => {
  for (const bad of [123, null, {}, []]) {
    const problems = validateMergitJson({ wallets: { alice: bad } });
    assert.ok(problems.some((p) => /invalid address for "alice"/.test(p)));
  }
});

test("reports every broken wallet, not only the first", () => {
  const problems = validateMergitJson({
    wallets: { "-bad": "nope", "good": VALID_ADDRESS, "al--ice": VALID_ADDRESS },
  });
  // -bad: login + address, al--ice: login
  assert.ok(problems.length >= 3);
  assert.ok(problems.some((p) => p.includes('invalid GitHub login "-bad"')));
  assert.ok(problems.some((p) => p.includes('invalid address for "-bad"')));
  assert.ok(problems.some((p) => p.includes('invalid GitHub login "al--ice"')));
});

test("rejects invalid funders entries and reports each one", () => {
  const problems = validateMergitJson({
    funders: [VALID_ADDRESS, "0xnope", 42],
  });
  assert.equal(problems.length, 2);
  assert.ok(problems.some((p) => p.includes('"funders"[1]')));
  assert.ok(problems.some((p) => p.includes('"funders"[2]')));
});

test("accepts upper- and lower-case hex addresses", () => {
  assert.deepEqual(
    validateMergitJson({
      funders: [
        "0x" + "AB".repeat(20), // 40 uppercase hex chars
        "0x" + "ab".repeat(20), // 40 lowercase hex chars
      ],
    }),
    [],
  );
});

test("never throws on any input", () => {
  const weird = [
    undefined,
    null,
    0,
    NaN,
    Symbol.iterator,
    () => {},
    [],
    {},
    { wallets: null },
    { funders: {} },
    Object.create(null),
  ];
  for (const value of weird) {
    assert.doesNotThrow(() => validateMergitJson(value));
  }
});

test("accepts a null-prototype object as a plain object", () => {
  const config = Object.create(null);
  config.wallets = { alice: VALID_ADDRESS };
  assert.deepEqual(validateMergitJson(config), []);
});