import test from 'node:test';
import assert from 'node:assert';
import vttpeg from '../src/index.js';

test('style', (t) => {
  let text = `WEBVTT

00:00:01.000 --> 00:00:05.000
This text should be <b>bold</b>.

00:00:06.000 --> 00:00:10.000
This text should be <i>italic</i>, and this <u>underlined</u>.

00:00:11.000 --> 00:00:15.000
<v John>Hello, I'm John.</v> <v Mary>Hi John, I'm Mary.</v>

00:00:16.000 --> 00:00:20.000
This is <c.highlight>a highlighted class</c> and this is <lang en-us>English</lang>.

00:00:21.000 --> 00:00:25.000
This is karaoke style: <00:00:22.500>Syllable 1, <00:00:23.500>Syllable 2.
`
  let vtt = vttpeg(text)
  assert.strictEqual(vtt.json().length, 5, '5 entries')
  assert.strictEqual(vtt.isValid(), true, 'is valid')
  assert.strictEqual(vtt.lint({ silent: true }).length, 0, 'no lint errors')

})


test('cue-settings', (t) => {
  let text = `WEBVTT

00:00:02.000 --> 00:00:04.000 align:start
This cue should be aligned to the start (left).

00:00:05.000 --> 00:00:07.000 align:end
This cue should be aligned to the end (right).

00:00:08.000 --> 00:00:10.000 line:10% position:50% align:middle
This cue is at 10% from top, 50% from left.

00:00:11.000 --> 00:00:13.000 size:50%
This cue should take up 50% of the video width.

00:00:14.000 --> 00:00:17.000 vertical:rl
This
text
should
be
vertical.
`
  let vtt = vttpeg(text)
  assert.strictEqual(vtt.json().length, 5, '5 entries')
  assert.strictEqual(vtt.isValid(), true, 'is valid')
  assert.strictEqual(vtt.lint({ silent: true }).length, 0, 'no lint errors')
})