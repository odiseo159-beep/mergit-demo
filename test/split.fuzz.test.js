import { test } from "node:test";
import assert from "node:assert/strict";
import { split } from "../src/split.js";

// A 32-bit linear congruential generator. Written here on purpose: no new
// dependency, and the same numbers on every run, so a failure is reproducible
// from the seed alone.
function seeded(seed) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(1_664_525, state) + 1_013_904_223) >>> 0;
    return state / 2 ** 32;
  };
}

const SEED = 0x5eed1234;
const TRILLION = 10n ** 12n;
const LIMIT_WEI = 10n ** 24n;
const MAX_FEE = 500;

/** A random amount from 0 to 10^24 wei, built from two safe integers. */
function amountFrom(random) {
  const high = BigInt(Math.floor(random() * 1_000_000_000_000));
  const low = BigInt(Math.floor(random() * 1_000_000_000_000));
  const amount = high * TRILLION + low;
  return amount >= LIMIT_WEI ? LIMIT_WEI - 1n : amount;
}

test("the generator is seeded: the same seed gives the same numbers", () => {
  const a = seeded(SEED);
  const b = seeded(SEED);
  for (let i = 0; i < 5; i++) assert.equal(a(), b());
});

test("ten thousand seeded pairs keep every invariant of split", () => {
  const random = seeded(SEED);
  let biggest = 0n;

  for (let i = 0; i < 10_000; i++) {
    const amount = amountFrom(random);
    const feeBps = Math.floor(random() * (MAX_FEE + 1));
    const { payout, fee } = split(amount, feeBps);

    assert.equal(payout + fee, amount, `amount ${amount} at ${feeBps} bps does not add up`);
    assert.ok(payout >= 0n, `amount ${amount} at ${feeBps} bps paid a negative payout`);
    assert.ok(
      fee * 10_000n <= amount * BigInt(feeBps),
      `amount ${amount} at ${feeBps} bps charged more than the fee`,
    );
    if (amount > biggest) biggest = amount;
  }

  assert.ok(biggest > 10n ** 20n, "the generator never reached a realistic amount");
});
