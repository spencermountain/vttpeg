import test from 'tape';
import vttpeg from '../src/index.js';

test('smoke-test', (t) => {
  t.equal(true, true, 'true is true')
  const text = `WEBVTT

00:00:00.000 --> 00:00:00.000
Hello, world!

00:00:02.000 --> 00:00:04.000
Hello, world 2!

00:00:05.000 --> 00:00:07.000
Hello, world 3!`
  const vtt = vttpeg(text)
  t.equal(vtt.json().length, 3, '3 entries')

  // input==output
  t.equal(vtt.out(), text, 'out is text')

  const output = `Hello, world!
Hello, world 2!
Hello, world 3!`
  t.equal(vtt.text(), output, 'text is text')
  t.end()
})
