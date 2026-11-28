import { test } from "node:test";
import assert from "node:assert/strict";
import { parseIssueUrl } from "../src/issue-url.js";

test("parses a standard full GitHub issue URL", () => {
  const result = parseIssueUrl("https://github.com/odiseo159-beep/mergit-demo/issues/6");
  assert.deepEqual(result, {
    owner: "odiseo159-beep",
    repo: "mergit-demo",
    number: 6,
  });
});

test("accepts the address without https://", () => {
  const result = parseIssueUrl("github.com/odiseo159-beep/mergit-demo/issues/6");
  assert.deepEqual(result, {
    owner: "odiseo159-beep",
    repo: "mergit-demo",
    number: 6,
  });
});

test("accepts the address with www.", () => {
  const result = parseIssueUrl("https://www.github.com/odiseo159-beep/mergit-demo/issues/6");
  assert.deepEqual(result, {
    owner: "odiseo159-beep",
    repo: "mergit-demo",
    number: 6,
  });
});

test("accepts the address with a trailing slash", () => {
  const result = parseIssueUrl("https://github.com/odiseo159-beep/mergit-demo/issues/6/");
  assert.deepEqual(result, {
    owner: "odiseo159-beep",
    repo: "mergit-demo",
    number: 6,
  });
});

test("accepts the address with a #issuecomment fragment", () => {
  const result = parseIssueUrl("https://github.com/odiseo159-beep/mergit-demo/issues/6#issuecomment-123456789");
  assert.deepEqual(result, {
    owner: "odiseo159-beep",
    repo: "mergit-demo",
    number: 6,
  });
});

test("returns null for a pull request address", () => {
  assert.equal(parseIssueUrl("https://github.com/odiseo159-beep/mergit-demo/pull/5"), null);
});

test("returns null for another site", () => {
  assert.equal(parseIssueUrl("https://gitlab.com/odiseo159-beep/mergit-demo/issues/6"), null);
  assert.equal(parseIssueUrl("https://example.com/github.com/odiseo159-beep/mergit-demo/issues/6"), null);
});

test("returns null for a missing number", () => {
  assert.equal(parseIssueUrl("https://github.com/odiseo159-beep/mergit-demo/issues/"), null);
  assert.equal(parseIssueUrl("https://github.com/odiseo159-beep/mergit-demo/issues"), null);
  assert.equal(parseIssueUrl("https://github.com/odiseo159-beep/mergit-demo"), null);
});

test("returns null for non-string input", () => {
  assert.equal(parseIssueUrl(null), null);
  assert.equal(parseIssueUrl(undefined), null);
  assert.equal(parseIssueUrl(12345), null);
  assert.equal(parseIssueUrl({}), null);
  assert.equal(parseIssueUrl([]), null);
});
