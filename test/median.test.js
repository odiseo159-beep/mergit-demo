import { test } from "node:test";
import assert from "node:assert/strict";
import { median } from "../src/median.js";

test("takes the middle value of an odd list", () => {
  assert.equal(median([20, 19, 41]), 20);
});

test("averages the two middle values of an even list", () => {
  assert.equal(median([1, 2, 3, 4]), 2.5);
});

test("does not change the array it receives", () => {
  const values = [41, 20, 19];
  median(values);
  assert.deepEqual(values, [41, 20, 19]);
});

test("rejects an empty array", () => {
  assert.throws(() => median([]), RangeError);
});

test("rejects anything that is not an array", () => {
  for (const bad of [42, "20", null, undefined, {}]) {
    assert.throws(() => median(bad), TypeError);
  }
});

test("rejects a list holding a non-finite number", () => {
  for (const bad of [[1, Number.NaN], [1, Infinity], [1, -Infinity], [1, "2"]]) {
    assert.throws(() => median(bad), TypeError);
  }
});
