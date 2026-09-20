// test linting of vtt files
import test from 'tape'
import vttpeg from '../src/index.js'

test('lint overlapping cues', (t) => {
  let input = `WEBVTT

00:00:02.000 --> 00:00:05.000
This cue appears first.

NOTE This is an inline note, also to be ignored.

overlapping_cue
00:00:04.000 --> 00:00:07.000
This cue overlaps with the first one.
(Appears from 00:04 to 00:07)

00:00:08.000 --> 00:00:10.000
This is a final cue.
  `
  let vtt = vttpeg(input)
  t.equal(vtt.json().length, 3, '3 entries')
  t.equal(vtt.lint({ silent: true }).length, 1, '1 lint error')
  t.equal(vtt.isValid(), false, 'is not valid')
  t.end()
})
