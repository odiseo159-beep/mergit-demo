import test from 'node:test';
import assert from 'node:assert';
import { fundLink } from '../src/fund-link.js';

test('fundLink', () => {
  assert.equal(fundLink("https://github.com/odiseo159-beep/mergit-demo/issues/6", "0.0005"), "https://www.mergit.xyz/post?uri=https%3A%2F%2Fgithub.com%2Fodiseo159-beep%2Fmergit-demo%2Fissues%2F6&amount=0.0005");
  assert.throws(() => fundLink("http://github.com/a/b/issues/1", "0.0005"), RangeError);
  assert.throws(() => fundLink("https://github.com/a/b/issues/1", "0.0005a"), RangeError);
  assert.throws(() => fundLink("https://github.com/a/b/issues/1", 0.0005), RangeError);
});
