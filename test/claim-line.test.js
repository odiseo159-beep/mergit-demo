import { test } from "node:test";
import assert from "node:assert/strict";
import { parseClaim } from "../src/claim-line.js";

test("reads Closes, Fixes and Resolves in any case", () => {
  assert.deepEqual(parseClaim("Closes #11").closes, [11]);
  assert.deepEqual(parseClaim("fixes #7").closes, [7]);
  assert.deepEqual(parseClaim("Resolves #3").closes, [3]);
  assert.deepEqual(parseClaim("CLOSES #42").closes, [42]);
});

test("keeps the order and drops duplicates", () => {
  assert.deepEqual(parseClaim("Closes #9\nFixes #4\ncloses #9").closes, [9, 4]);
});

test("read a list of issues on one line", () => {
  assert.deepEqual(parseClaim("Closes #1, #2 and #3").closes, [1, 2, 3]);
});

test("reads the first Bounty line", () => {
  const { bounty } = parseClaim("Closes #22\n\nBounty: #29");
  assert.equal(bounty, 29);
});

test("no Bounty line means null", () => {
  assert.equal(parseClaim("Closes #22").bounty, null);
});

test("ignores lines inside a code block", () => {
  const body = ["Closes #5", "```", "Closes #999", "Bounty: #99", "```", "Bounty: #6"].join("\n");
  assert.deepEqual(parseClaim(body), { closes: [5], bounty: 6 });
});

test("an empty description claims nothing", () => {
  assert.deepEqual(parseClaim(""), { closes: [], bounty: null });
});

test("a description with no claim returns the empty shape", () => {
  assert.deepEqual(parseClaim("Just some work, no issue."), { closes: [], bounty: null });
});

test("rejects a body that is not a string", () => {
  assert.throws(() => parseClaim(null), TypeError);
  assert.throws(() => parseClaim(undefined), TypeError);
});
