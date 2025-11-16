import test from 'node:test';
import assert from 'node:assert';
import vttpeg from '../src/index.js';

test('label', (t) => {
  let text = `WEBVTT

1
00:00:22.230 --> 00:00:24.606
This is the first subtitle.

2 Some Text
00:00:30.739 --> 00:00:34.074
This is the second.

3
00:00:34.159 --> 00:00:35.743
This is the third

00:00:36.000 --> 00:00:37.000
This is the fourth
`
  let vtt = vttpeg(text)
  assert.strictEqual(vtt.json().length, 4, '4 entries')
  assert.strictEqual(vtt.isValid(), true, 'is valid')
  assert.strictEqual(vtt.lint({ silent: true }).length, 0, 'no lint errors')
  assert.strictEqual(vtt.json()[0].label, '1', 'first entry has label 1')
  assert.strictEqual(vtt.json()[1].label, '2 Some Text', 'second entry has label 2')
  assert.strictEqual(vtt.json()[2].label, '3', 'third entry has label 3')
  assert.strictEqual(vtt.json()[3].label, undefined, 'fourth entry has no label')
})