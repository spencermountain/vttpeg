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


  vtt.normalize({ stripVoice: true })
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

test('strip music', (t) => {
  let text = `WEBVTT
00:16.000 --> 00:18.000
-♪ The Mighty Boosh ♪
-♪ Come with us to the Mighty Boosh ♪
`
  let vtt = vttpeg(text)
  assert.strictEqual(vtt.json().length, 1, '1 entry')
  assert.strictEqual(vtt.isValid(), true, 'is valid')
  assert.strictEqual(vtt.lint({ silent: true }).length, 0, 'no lint errors')

  let firstOut = `-♪ The Mighty Boosh ♪
-♪ Come with us to the Mighty Boosh ♪`
  assert.strictEqual(vtt.text(), firstOut, 'text is text')

  vtt.normalize({ stripMusic: true })
  // the cue was entirely music, so it is dropped
  assert.strictEqual(vtt.json().length, 0, '0 entries')
  assert.strictEqual(vtt.text(), '', 'text is empty')
})

test('strip bracketed sound cues', (t) => {
  let text = `WEBVTT
00:16.000 --> 00:18.000
[ELECTRONIC SQUELCHES, HUMMING]

00:18.000 --> 00:20.000
(CLEARING THROAT)

00:20.000 --> 00:22.000
Actual dialogue here.
`
  let vtt = vttpeg(text)
  assert.strictEqual(vtt.json().length, 3, '3 entries')

  vtt.normalize({ stripMusic: true })
  assert.strictEqual(vtt.json().length, 1, '1 entry left')
  assert.strictEqual(vtt.text(), 'Actual dialogue here.', 'only dialogue remains')
})

test('strip whitespace', (t) => {
  // extra internal spaces, a trailing space, and a blank line
  let text = `WEBVTT
00:22.908 --> 00:24.535
Linda  Johnson is
a political liability.
`
  let vtt = vttpeg(text)
  assert.strictEqual(vtt.json().length, 1, '1 entry')
  assert.strictEqual(vtt.isValid(), true, 'is valid')
  assert.strictEqual(vtt.lint({ silent: true }).length, 0, 'no lint errors')

  vtt.normalize({ stripWhitespace: true })
  assert.strictEqual(vtt.json().length, 1, '1 entry')
  assert.strictEqual(vtt.isValid(), true, 'is valid')
  assert.strictEqual(vtt.lint({ silent: true }).length, 0, 'no lint errors')

  // whitespace collapsed/trimmed, but the line-break is preserved
  let secondOut = `Linda Johnson is\na political liability.`
  assert.strictEqual(vtt.text(), secondOut, 'lines are trimmed but preserved')
})

test('strip notes', (t) => {
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
`
  let vtt = vttpeg(text)
  assert.strictEqual(vtt.json().length, 3, '3 entries')
  assert.strictEqual(vtt.isValid(), true, 'is valid')
  assert.strictEqual(vtt.lint({ silent: true }).length, 0, 'no lint errors')
  vtt.normalize({ stripNotes: true })
  assert.strictEqual(vtt.json().length, 3, '3 entries')
  assert.strictEqual(vtt.isValid(), true, 'is valid')
  assert.strictEqual(vtt.lint({ silent: true }).length, 0, 'no lint errors')

  let secondOut = `This is the first subtitle.
This is the second.
This is the third`
  assert.strictEqual(vtt.text(), secondOut, 'text is text')
})