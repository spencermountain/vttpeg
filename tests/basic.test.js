import test from 'node:test';
import assert from 'node:assert';
import vttpeg from '../src/index.js';

test('basic', (t) => {
  let text = `WEBVTT

1
00:00:01.500 --> 00:00:03.000
This is the first subtitle.

2
00:00:04.000 --> 00:00:06.000
This is the second subtitle, with no cue identifier.
`
  let vtt = vttpeg(text)
  assert.strictEqual(vtt.json().length, 2, '2 entries')
  assert.strictEqual(vtt.isValid(), true, 'is valid')
  assert.strictEqual(vtt.lint({ silent: true }).length, 0, 'no lint errors')
})