import test from 'node:test';
import assert from 'node:assert';
import vttpeg from '../src/index.js';

test('smoke-test', (t) => {
  assert.strictEqual(true, true, 'true is true')
  let text = `
WEBVTT
00:00:00.000 --> 00:00:00.000
Hello, world!

00:00:02.000 --> 00:00:04.000
Hello, world 2!

00:00:05.000 --> 00:00:07.000
Hello, world 3!
  `
  let vtt = vttpeg(text)
  assert.strictEqual(vtt.json().length, 3, '3 entries')

  let output = `Hello, world!
Hello, world 2!
Hello, world 3!`
  assert.strictEqual(vtt.text(), output, 'text is text')
})