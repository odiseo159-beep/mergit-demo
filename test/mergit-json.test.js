import test from 'node:test';
import assert from 'node:assert';
import { validateMergitJson } from '../src/mergit-json.js';

test('validateMergitJson', () => {
  assert.deepEqual(validateMergitJson({ wallets: { "odiseo159-beep": "0x23E8541dA96158d342477D694274E27639807686" } }), []);
  assert.deepEqual(validateMergitJson({ funders: ["0x23E8541dA96158d342477D694274E27639807686"] }), []);
  assert.equal(validateMergitJson([]).length, 1);
  assert.equal(validateMergitJson(null).length, 1);
  
  const p1 = validateMergitJson({ bad: 1, wallets: { "-bad": "0x123", "good": "bad-address" } });
  assert.equal(p1.length, 4);
});
