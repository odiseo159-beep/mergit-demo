import { test } from "node:test";
import assert from "node:assert/strict";
import { formatDuration } from "../src/format-duration.js";

test("shows seconds under a minute", () => {
  assert.equal(formatDuration(0), "0 s");
  assert.equal(formatDuration(20), "20 s");
});

test("shows minutes and seconds", () => {
  assert.equal(formatDuration(65), "1 min 5 s");
  assert.equal(formatDuration(120), "2 min");
});

test("shows hours and minutes, and drops the seconds", () => {
  assert.equal(formatDuration(7380), "2 h 3 min");
  assert.equal(formatDuration(3600), "1 h");
  assert.equal(formatDuration(3661), "1 h 1 min");
});

test("rejects what is not a whole, non-negative number", () => {
  assert.throws(() => formatDuration(1.5), TypeError);
  assert.throws(() => formatDuration("20"), TypeError);
  assert.throws(() => formatDuration(-1), RangeError);
});
