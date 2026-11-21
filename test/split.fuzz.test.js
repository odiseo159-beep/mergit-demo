import assert from 'assert';
import { describe, it } from 'node:test';
import { split } from '../src/split.js';

/**
 * Simple seeded linear congruential generator (LCG).
 * Deterministic and does not require any external dependency.
 */
class SeededRNG {
  constructor(seed = 123456789) {
    this.seed = seed >>> 0; // ensure 32-bit unsigned
  }
  /** @returns {number} Float in [0, 1) */
  next() {
    // Constants from Numerical Recipes
    this.seed = (this.seed * 1664525 + 1013904223) >>> 0;
    return this.seed / 0x100000000;
  }
  /** @returns {bigint} Random bigint in [0, max] */
  nextBigInt(max) {
    // max is a bigint
    // Generate a decimal string representation using the RNG to stay within JS number limits.
    const maxStr = max.toString();
    const digits = maxStr.length;
    let result = '';
    for (let i = 0; i < digits; i++) {
      const digit = Math.floor(this.next() * 10);
      result += digit.toString();
    }
    // Trim leading zeros and ensure the value does not exceed max
    let value = BigInt(result.replace(/^0+/, '') || '0');
    if (value > max) value = max;
    return value;
  }
}

/**
 * Generate a random amount between 0 and 10^24 wei (inclusive).
 * @param {SeededRNG} rng
 * @returns {bigint}
 */
function randomAmount(rng) {
  const MAX = 10n ** 24n;
  return rng.nextBigInt(MAX);
}

/**
 * Generate a random fee basis-points value between 0 and 500 (inclusive).
 * @param {SeededRNG} rng
 * @returns {number}
 */
function randomFeeBps(rng) {
  return Math.floor(rng.next() * 501); // 0-500 inclusive
}

describe('split.fuzz', function () {
  const rng = new SeededRNG(123456789);
  const ITERATIONS = 100;

  for (let i = 0; i < ITERATIONS; i++) {
    const amount = randomAmount(rng);
    const feeBps = randomFeeBps(rng);
    it(`iteration ${i + 1}: amount=${amount} feeBps=${feeBps}`, function () {
      const { payout, fee } = split(amount, feeBps);

      // 1. payout + fee must equal the original amount
      assert.strictEqual(payout + fee, amount, 'payout + fee should equal amount');

      // 2. payout must be non-negative
      assert(payout >= 0n, 'payout should be >= 0');

      // 3. fee must respect the basis-points limit
      //    fee * 10000 <= amount * feeBps
      const lhs = fee * 10000n;
      const rhs = amount * BigInt(feeBps);
      assert(lhs <= rhs, 'fee must not exceed amount * feeBps / 10000');
    });
  }
});
