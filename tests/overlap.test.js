// test the fixOverlaps function
import test from 'node:test'
import assert from 'node:assert'
import vttpeg from '../src/index.js'

test('fixOverlaps', (t) => {
  let text = `WEBVTT

00:00:02.000 --> 00:00:05.000
This cue appears first.

overlapping_cue
00:00:04.000 --> 00:00:07.000
This cue overlaps with the first one.
(Appears from 00:04 to 00:07)

00:00:08.000 --> 00:00:10.000
This is a final cue.
  `
  let vtt = vttpeg(text)
  assert.strictEqual(vtt.json().length, 3, '3 entries')
  assert.strictEqual(vtt.lint({ silent: true }).length, 1, '1 lint error')

  vtt.normalize({ fixOverlaps: true })
  assert.strictEqual(vtt.json().length, 3, '3 entries')
  assert.strictEqual(vtt.lint({ silent: true }).length, 0, '0 lint errors')
})

test('normalize sorts out-of-order cues instead of dropping them', (t) => {
  let text = `WEBVTT

00:00:10.000 --> 00:00:12.000
this cue is second

00:00:01.000 --> 00:00:03.000
this cue is first

00:00:20.000 --> 00:00:22.000
this cue is third
`
  let vtt = vttpeg(text)
  vtt.normalize()
  assert.strictEqual(vtt.json().length, 3, 'all 3 cues kept')
  assert.deepStrictEqual(
    vtt.json().map((c) => c.startTime),
    [1, 10, 20],
    'sorted by start time'
  )
  assert.strictEqual(vtt.isValid(), true, 'valid after normalize')
})

test('simultaneous cues survive normalize', (t) => {
  let text = `WEBVTT

00:00:01.000 --> 00:00:04.000
top line

00:00:01.000 --> 00:00:04.000
bottom line
`
  let vtt = vttpeg(text)
  vtt.normalize()
  assert.strictEqual(vtt.json().length, 2, 'both cues kept')
  assert.deepStrictEqual(
    vtt.json().map((c) => c.text[0]),
    ['top line', 'bottom line'],
    'file-order preserved'
  )
})