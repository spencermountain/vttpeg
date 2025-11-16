import test from 'node:test';
import assert from 'node:assert';
import vttpeg from '../src/index.js';

test('strip voices', (t) => {
  let text = `WEBVTT
00:16.000 --> 00:18.000
<v Roger Bingham>from the American Museum of Natural History

intro:
00:18.123 --> 00:20.000
<v Roger Bingham>And with me is Neil deGrasse Tyson

00:20.000 --> 00:22.000
<v Roger Bingham>Astrophysicist, Director of the Hayden Planetarium

00:22.000 --> 00:24.234
<v Roger Bingham>at the AMNH.

NOTE he says this in the intro

00:24.235 --> 00:26.000
<v Roger Bingham>Thank you for walking down here.

`
  let vtt = vttpeg(text)
  assert.strictEqual(vtt.json().length, 5, '5 entries')
  assert.strictEqual(vtt.isValid(), true, 'is valid')
  assert.strictEqual(vtt.lint({ silent: true }).length, 0, 'no lint errors')

  let firstOut = `<v Roger Bingham>from the American Museum of Natural History
<v Roger Bingham>And with me is Neil deGrasse Tyson
<v Roger Bingham>Astrophysicist, Director of the Hayden Planetarium
<v Roger Bingham>at the AMNH.
<v Roger Bingham>Thank you for walking down here.`
  assert.strictEqual(vtt.text(), firstOut, 'text is text')


  vtt.stripVoice()
  assert.strictEqual(vtt.json().length, 5, '5 entries')
  assert.strictEqual(vtt.isValid(), true, 'is valid')
  assert.strictEqual(vtt.lint({ silent: true }).length, 0, 'no lint errors')

  let secondOut = `from the American Museum of Natural History
And with me is Neil deGrasse Tyson
Astrophysicist, Director of the Hayden Planetarium
at the AMNH.
Thank you for walking down here.`
  assert.strictEqual(vtt.text(), secondOut, 'text is text')
})

