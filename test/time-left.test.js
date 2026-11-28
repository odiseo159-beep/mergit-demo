import { test } from "node:test";
import assert from "node:assert/strict";
import { timeLeft } from "../src/time-left.js";

test("a day or more shows days and hours", () => {
  assert.equal(timeLeft(90_061, 0), "1d 1h");
  assert.equal(timeLeft(172_800, 0), "2d 0h");
});

test("an hour or more shows hours and minutes", () => {
  assert.equal(timeLeft(3_600, 0), "1h 0m");
  assert.equal(timeLeft(5_400, 0), "1h 30m");
});

test("less than an hour shows minutes", () => {
  assert.equal(timeLeft(150, 0), "2m");
  assert.equal(timeLeft(119, 0), "1m");
});

test("less than a minute is <1m", () => {
  assert.equal(timeLeft(59, 0), "<1m");
  assert.equal(timeLeft(5, 5), "<1m");
});

test("past the deadline is expired", () => {
  assert.equal(timeLeft(100, 101), "expired");
});

test("values are rounded down", () => {
  assert.equal(timeLeft(90_061 + 3_000, 0), "1d 1h");
  assert.equal(timeLeft(3_600 + 59, 0), "1h 0m");
});

test("refuses negative or fractional arguments", () => {
  assert.throws(() => timeLeft(-1, 0), RangeError);
  assert.throws(() => timeLeft(10, -1), RangeError);
  assert.throws(() => timeLeft(10.5, 0), RangeError);
  assert.throws(() => timeLeft(10, 0.5), RangeError);
});
