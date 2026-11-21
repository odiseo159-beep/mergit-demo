import { test } from 'node:test';
import assert from 'node:assert';
import { isExpired } from '../src/expiry.js';

test('returns false when now equals deadline', () => {
  assert.strictEqual(isExpired(100n, 100), false);
});

test('returns true when now is greater than deadline', () => {
  assert.strictEqual(isExpired(100n, 101), true);
});

test('throws TypeError when deadline is not a bigint', () => {
  assert.throws(() => isExpired(100, 101), TypeError);
});

test('throws RangeError when now is negative', () => {
  assert.throws(() => isExpired(100n, -1), RangeError);
});

test('throws RangeError when now is not an integer', () => {
  assert.throws(() => isExpired(100n, 1.5), RangeError);
});
