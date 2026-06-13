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