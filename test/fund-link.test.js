import { test } from "node:test";
import assert from "node:assert/strict";
import { fundLink } from "../src/fund-link.js";

const URL = "https://github.com/odiseo159-beep/mergit-demo/issues/6";

test("builds the Fund this issue link", () => {
  assert.equal(
    fundLink(URL, "0.0005"),
    "https://www.mergit.xyz/post?uri=https%3A%2F%2Fgithub.com%2Fodiseo159-beep%2Fmergit-demo%2Fissues%2F6&amount=0.0005",
  );
});

test("encodes the issue URL with encodeURIComponent", () => {
  assert.ok(fundLink(URL, "0.0005").includes(encodeURIComponent(URL)));
});

test("rejects anything that is not a GitHub issue address", () => {
  for (const bad of [
    "https://github.com/odiseo159-beep/mergit-demo/pull/5",
    "https://gitlab.com/odiseo159-beep/mergit-demo/issues/6",
    "http://github.com/odiseo159-beep/mergit-demo/issues/6",
    "https://github.com/odiseo159-beep/mergit-demo/issues/",
    "",
  ]) {
    assert.throws(() => fundLink(bad, "0.0005"), RangeError);
  }
});

test("rejects an amount that is not a plain decimal string", () => {
  for (const bad of ["", "0.0005 ETH", "-1", "1e-4", 0.0005, null]) {
    assert.throws(() => fundLink(URL, bad), RangeError);
  }
});
