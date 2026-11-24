import test from 'node:test';
import assert from 'node:assert';
import { timeLeft } from '../src/time-left.js';

test('timeLeft', () => {
  assert.equal(timeLeft(90061, 0), "1d 1h");
  assert.equal(timeLeft(3600, 0), "1h 0m");
  assert.equal(timeLeft(150, 0), "2m");
  assert.equal(timeLeft(5, 5), "<1m");
  assert.equal(timeLeft(59, 0), "<1m");
  assert.equal(timeLeft(0, 1), "expired");
  assert.throws(() => timeLeft(-1, 0), RangeError);
  assert.throws(() => timeLeft(1.5, 0), RangeError);
});
