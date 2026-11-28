import { test } from "node:test";
import assert from "node:assert/strict";
import * as pkg from "../src/index.js";

test("the entry point exports exactly the four library names", () => {
  assert.deepEqual(Object.keys(pkg).sort(), [
    "BPS_DENOMINATOR",
    "MAX_FEE_BPS",
    "grossFor",
    "split",
  ]);
});

test("the exported functions are the ones split.js defines", async () => {
  const split = await import("../src/split.js");
  assert.equal(pkg.split, split.split);
  assert.equal(pkg.grossFor, split.grossFor);
  assert.equal(pkg.MAX_FEE_BPS, split.MAX_FEE_BPS);
  assert.equal(pkg.BPS_DENOMINATOR, split.BPS_DENOMINATOR);
});
