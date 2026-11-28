import test from 'node:test';
import assert from 'node:assert';
import { parseIssueUrl } from '../src/issue-url.js';

test('parseIssueUrl', () => {
  assert.deepEqual(parseIssueUrl("https://github.com/odiseo159-beep/mergit-demo/issues/6"), { owner: "odiseo159-beep", repo: "mergit-demo", number: 6 });
  assert.deepEqual(parseIssueUrl("github.com/a/b/issues/123/"), { owner: "a", repo: "b", number: 123 });
  assert.deepEqual(parseIssueUrl("www.github.com/a/b/issues/123#issuecomment-1"), { owner: "a", repo: "b", number: 123 });
  assert.equal(parseIssueUrl("https://github.com/a/b/pull/5"), null);
  assert.equal(parseIssueUrl("https://gitlab.com/a/b/issues/5"), null);
  assert.equal(parseIssueUrl("https://github.com/a/b/issues/"), null);
  assert.equal(parseIssueUrl(null), null);
});
