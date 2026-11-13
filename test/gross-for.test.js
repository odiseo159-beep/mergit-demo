import { test } from "node:test";
import assert from "node:assert/strict";
import { split, grossFor, MAX_FEE_BPS } from "../src/split.js";

test("a funder locking grossFor() leaves the developer whole", () => {
  for (const net of [1n, 7n, 1_000n, 492_500_000_000_000n, 10n ** 18n]) {
    const gross = grossFor(net, 150);
    assert.ok(split(gross, 150).payout >= net, `developer short for net=${net}`);
  }
});

test("with no fee the funder locks exactly the target", () => {
  assert.equal(grossFor(1_000n, 0), 1_000n);
});

test("never leaves the developer a wei short, and never asks for a wei more", () => {
  // split rounds the fee down, so 1 wei locked at 1.5% already pays 1 wei.
  assert.equal(grossFor(1n, 150), 1n);
  assert.equal(split(1n, 150).payout, 1n);
});

test("is the smallest amount that works: one wei less leaves the developer short", () => {
  for (const feeBps of [0, 1, 150, 499, MAX_FEE_BPS]) {
    for (let net = 1n; net <= 2_000n; net++) {
      const gross = grossFor(net, feeBps);
      assert.ok(split(gross, feeBps).payout >= net, `${net} at ${feeBps} bps: developer short`);
      assert.ok(split(gross - 1n, feeBps).payout < net, `${net} at ${feeBps} bps: funder asked for too much`);
    }
  }
  for (const net of [492_500_000_000_000n, 10n ** 18n]) {
    const gross = grossFor(net, 150);
    assert.ok(split(gross, 150).payout >= net);
    assert.ok(split(gross - 1n, 150).payout < net);
  }
});

test("a zero target asks for nothing", () => {
  assert.equal(grossFor(0n, 150), 0n);
});

test("rejects a fee above the hard cap", () => {
  assert.throws(() => grossFor(1_000n, MAX_FEE_BPS + 1), RangeError);
});

test("round trip: what a funder locks always leaves the developer whole", () => {
  for (const net of [1n, 7n, 1_000n, 492_500_000_000_000n, 10n ** 18n]) {
    for (const feeBps of [0, 1, 150, 499, MAX_FEE_BPS]) {
      const { payout } = split(grossFor(net, feeBps), feeBps);
      assert.ok(payout >= net, `${net} wei at ${feeBps} bps paid only ${payout}`);
    }
  }
});
