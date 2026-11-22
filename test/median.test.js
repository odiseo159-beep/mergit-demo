import { test } from "node:test";
import assert from "node:assert/strict";
import { median } from "../src/median.js";

test("the middle value of an odd-length list", () => {
  assert.equal(median([20, 19, 41]), 20);
});

test("the mean of the two middle values of an even-length list", () => {
  assert.equal(median([1, 2, 3, 4]), 2.5);
});

test("a single value is its own median", () => {
  assert.equal(median([7]), 7);
});

test("unsorted input is ordered before taking the median", () => {
  assert.equal(median([41, 20, 19]), 20);
  assert.equal(median([4, 1, 3, 2]), 2.5);
});

test("negative and fractional values work", () => {
  assert.equal(median([-3, -1, -2]), -2);
  assert.equal(median([0.5, 1.5]), 1);
});

test("does not change the array it receives", () => {
  const values = [41, 20, 19];
  median(values);
  assert.deepEqual(values, [41, 20, 19]);
});

test("throws RangeError for an empty array", () => {
  assert.throws(() => median([]), RangeError);
});

test("throws TypeError when values is not an array", () => {
  for (const bad of [null, undefined, 42, "1,2,3", {}, new Set([1, 2])]) {
    assert.throws(() => median(bad), TypeError);
  }
});

test("throws TypeError when the array holds a non-finite number", () => {
  for (const bad of [[1, NaN], [1, Infinity], [1, -Infinity], [1, "2"], [1, null], [1, undefined], [1, 2n]]) {
    assert.throws(() => median(bad), TypeError);
  }
});