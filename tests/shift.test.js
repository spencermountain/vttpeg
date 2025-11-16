import test from 'node:test';
import assert from 'node:assert';
import vttpeg from '../src/index.js';

test('shift', (t) => {
  assert.strictEqual(true, true, 'true is true')
  let text = `WEBVTT

00:00:00.000 --> 00:00:02.000
Hello, world!

00:00:02.000 --> 00:00:04.000
Hello, world 2!

00:00:05.000 --> 00:00:07.000
Hello, world 3!`
  let vtt = vttpeg(text)

  assert.strictEqual(vtt.entries[0].startTime, 0, 'first entry starts at 0')
  assert.strictEqual(vtt.entries[0].endTime, 2, 'first entry ends at 2')
  assert.strictEqual(vtt.entries[1].startTime, 2, 'second entry starts at 2')
  assert.strictEqual(vtt.entries[1].endTime, 4, 'second entry ends at 4')
  assert.strictEqual(vtt.entries[2].startTime, 5, 'third entry starts at 5')
  assert.strictEqual(vtt.entries[2].endTime, 7, 'third entry ends at 7')

  vtt.shift(10)
  assert.strictEqual(vtt.entries[0].startTime, 10, 'first entry starts at 10')
  assert.strictEqual(vtt.entries[0].endTime, 12, 'first entry ends at 12')
  assert.strictEqual(vtt.entries[1].startTime, 12, 'second entry starts at 12')
  assert.strictEqual(vtt.entries[1].endTime, 14, 'second entry ends at 14')
  assert.strictEqual(vtt.entries[2].startTime, 15, 'third entry starts at 15')
  assert.strictEqual(vtt.entries[2].endTime, 17, 'third entry ends at 17')
  // shift it back
  vtt.shift(-10)
  assert.strictEqual(vtt.entries[0].startTime, 0, 'first entry starts at 0')
  assert.strictEqual(vtt.entries[0].endTime, 2, 'first entry ends at 2')
  assert.strictEqual(vtt.entries[1].startTime, 2, 'second entry starts at 2')
  assert.strictEqual(vtt.entries[1].endTime, 4, 'second entry ends at 4')
  assert.strictEqual(vtt.entries[2].startTime, 5, 'third entry starts at 5')
  assert.strictEqual(vtt.entries[2].endTime, 7, 'third entry ends at 7')
})