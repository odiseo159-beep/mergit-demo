import { test } from "node:test";
import assert from "node:assert/strict";
import { parseIssueUrl } from "../src/issue-url.js";

test("reads owner, repository and number", () => {
  assert.deepEqual(parseIssueUrl("https://github.com/odiseo159-beep/mergit-demo/issues/6"), {
    owner: "odiseo159-beep",
    repo: "mergit-demo",
    number: 6,
  });
});

test("the number is a Number", () => {
  assert.equal(typeof parseIssueUrl("https://github.com/a/b/issues/6").number, "number");
});

test("accepts the address without https://, with www., a trailing slash", () => {
  const expected = { owner: "odiseo159-beep", repo: "mergit-demo", number: 6 };
  assert.deepEqual(parseIssueUrl("github.com/odiseo159-beep/mergit-demo/issues/6"), expected);
  assert.deepEqual(parseIssueUrl("https://www.github.com/odiseo159-beep/mergit-demo/issues/6"), expected);
  assert.deepEqual(parseIssueUrl("https://github.com/odiseo159-beep/mergit-demo/issues/6/"), expected);
});

test("accepts an issuecomment fragment", () => {
  assert.deepEqual(parseIssueUrl("https://github.com/odiseo159-beep/mergit-demo/issues/6#issuecomment-123456"), {
    owner: "odiseo159-beep",
    repo: "mergit-demo",
    number: 6,
  });
});

test("returns null for a pull request, another site, a missing number", () => {
  assert.equal(parseIssueUrl("https://github.com/odiseo159-beep/mergit-demo/pull/5"), null);
  assert.equal(parseIssueUrl("https://gitlab.com/odiseo159-beep/mergit-demo/issues/6"), null);
  assert.equal(parseIssueUrl("https://github.com/odiseo159-beep/mergit-demo/issues/"), null);
});

test("returns null for anything that is not a string", () => {
  for (const value of [null, undefined, 6, {}, []]) {
    assert.equal(parseIssueUrl(value), null);
  }
});
