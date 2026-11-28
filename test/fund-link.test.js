import { test } from "node:test";
import assert from "node:assert/strict";
import { fundLink } from "../src/fund-link.js";

test("builds the exact Mergit funding link with encoded URI", () => {
  const url = fundLink("https://github.com/odiseo159-beep/mergit-demo/issues/6", "0.0005");
  assert.equal(
    url,
    "https://www.mergit.xyz/post?uri=https%3A%2F%2Fgithub.com%2Fodiseo159-beep%2Fmergit-demo%2Fissues%2F6&amount=0.0005"
  );
});

test("throws RangeError when issueUrl is not a valid https://github.com/<owner>/<repo>/issues/<number> address", () => {
  assert.throws(() => fundLink("http://github.com/owner/repo/issues/1", "0.0005"), RangeError);
  assert.throws(() => fundLink("https://github.com/owner/repo/pull/1", "0.0005"), RangeError);
  assert.throws(() => fundLink("https://github.com/owner/repo/issues", "0.0005"), RangeError);
  assert.throws(() => fundLink("https://gitlab.com/owner/repo/issues/1", "0.0005"), RangeError);
  assert.throws(() => fundLink(null, "0.0005"), RangeError);
  assert.throws(() => fundLink(12345, "0.0005"), RangeError);
});

test("throws RangeError when amount is not a plain decimal string", () => {
  assert.throws(() => fundLink("https://github.com/owner/repo/issues/1", "-0.0005"), RangeError);
  assert.throws(() => fundLink("https://github.com/owner/repo/issues/1", "1e-4"), RangeError);
  assert.throws(() => fundLink("https://github.com/owner/repo/issues/1", "abc"), RangeError);
  assert.throws(() => fundLink("https://github.com/owner/repo/issues/1", null), RangeError);
  assert.throws(() => fundLink("https://github.com/owner/repo/issues/1", 0.0005), RangeError);
  assert.throws(() => fundLink("https://github.com/owner/repo/issues/1", ""), RangeError);
});

test("accepts whole numbers and various decimal amounts", () => {
  const url1 = fundLink("https://github.com/owner/repo/issues/1", "1");
  assert.equal(url1, "https://www.mergit.xyz/post?uri=https%3A%2F%2Fgithub.com%2Fowner%2Frepo%2Fissues%2F1&amount=1");

  const url2 = fundLink("https://github.com/owner/repo/issues/100", "0.123456789");
  assert.equal(url2, "https://www.mergit.xyz/post?uri=https%3A%2F%2Fgithub.com%2Fowner%2Frepo%2Fissues%2F100&amount=0.123456789");
});
