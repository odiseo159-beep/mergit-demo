import { test } from "node:test";
import assert from "node:assert/strict";
import { parseClaim } from "../src/claim-line.js";

test("parses a standard Closes and Bounty line", () => {
  const body = "Closes #8\nBounty: #20";
  const result = parseClaim(body);
  assert.deepEqual(result, { closes: [8], bounty: 20 });
});

test("handles several keywords: Closes, Fixes, Resolves (case-insensitive)", () => {
  const body = "closes #10\nFIXES #11\nResolves: #12";
  const result = parseClaim(body);
  assert.deepEqual(result.closes, [10, 11, 12]);
});

test("removes duplicate issue numbers and preserves order of appearance", () => {
  const body = "Closes #5\nFixes #6\nResolves #5\nfixes #7\ncloses #6";
  const result = parseClaim(body);
  assert.deepEqual(result.closes, [5, 6, 7]);
});

test("ignores lines inside fenced code blocks", () => {
  const body = `
Closes #1
\`\`\`
Closes #999
Bounty: #888
Fixes #777
\`\`\`
Fixes #2
Bounty: #42
`;
  const result = parseClaim(body);
  assert.deepEqual(result, { closes: [1, 2], bounty: 42 });
});

test("returns null for bounty when no Bounty line is present", () => {
  const body = "Closes #15\nJust fixing a bug.";
  const result = parseClaim(body);
  assert.deepEqual(result, { closes: [15], bounty: null });
});

test("empty string returns empty closes and null bounty", () => {
  const result = parseClaim("");
  assert.deepEqual(result, { closes: [], bounty: null });
});

test("description with no claim returns empty closes and null bounty", () => {
  const body = "This is a refactoring PR with no claim keywords.";
  const result = parseClaim(body);
  assert.deepEqual(result, { closes: [], bounty: null });
});

test("picks the first Bounty line if multiple appear", () => {
  const body = "Closes #1\nBounty: #10\nBounty: #20";
  const result = parseClaim(body);
  assert.equal(result.bounty, 10);
});

test("throws TypeError when argument is not a string", () => {
  assert.throws(() => parseClaim(null), TypeError);
  assert.throws(() => parseClaim(undefined), TypeError);
  assert.throws(() => parseClaim(123), TypeError);
  assert.throws(() => parseClaim({}), TypeError);
  assert.throws(() => parseClaim([]), TypeError);
});
