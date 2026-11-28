import test from 'node:test';
import assert from 'node:assert';
import { feeTable } from '../src/fee-table.js';

test('feeTable', () => {
  assert.equal(feeTable([], 150), "| Amount (wei) | Fee (wei) | Payout (wei) |\n|---|---|---|");
  assert.equal(feeTable([500000000000000n], 150), "| Amount (wei) | Fee (wei) | Payout (wei) |\n|---|---|---|\n| 500000000000000 | 7500000000000 | 492500000000000 |");
  assert.throws(() => feeTable("not array", 150), TypeError);
  assert.throws(() => feeTable([-1n], 150), RangeError);
});
