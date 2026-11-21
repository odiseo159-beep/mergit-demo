import { test } from 'node:test';
import assert from 'node:assert';
import * as index from '../src/index.js';

test('index.js exports exactly split, grossFor, MAX_FEE_BPS, and BPS_DENOMINATOR', () => {
  const expectedExports = ['split', 'grossFor', 'MAX_FEE_BPS', 'BPS_DENOMINATOR'];
  const actualExports = Object.keys(index);
  
  assert.deepStrictEqual(actualExports.sort(), expectedExports.sort());
});
