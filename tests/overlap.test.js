// test the fixOverlaps function
import test from 'tape'
import vttpeg from '../src/index.js'

test('fixOverlaps', (t) => {
  const text = `WEBVTT

00:00:02.000 --> 00:00:05.000
This cue appears first.

overlapping_cue
00:00:04.000 --> 00:00:07.000
This cue overlaps with the first one.
(Appears from 00:04 to 00:07)

00:00:08.000 --> 00:00:10.000
This is a final cue.
  `
  const vtt = vttpeg(text)
  t.equal(vtt.json().length, 3, '3 entries')
  t.equal(vtt.lint({ silent: true }).length, 1, '1 lint error')

  vtt.normalize({ fixOverlaps: true })
  t.equal(vtt.json().length, 3, '3 entries')
  t.equal(vtt.lint({ silent: true }).length, 0, '0 lint errors')
  t.end()
})

test('normalize sorts out-of-order cues instead of dropping them', (t) => {
  const text = `WEBVTT

00:00:10.000 --> 00:00:12.000
this cue is second

00:00:01.000 --> 00:00:03.000
this cue is first

00:00:20.000 --> 00:00:22.000
this cue is third
`
  const vtt = vttpeg(text)
  vtt.normalize()
  t.equal(vtt.json().length, 3, 'all 3 cues kept')
  t.deepEqual(
    vtt.json().map((c) => c.startTime),
    [1, 10, 20],
    'sorted by start time'
  )
  t.equal(vtt.isValid(), true, 'valid after normalize')
  t.end()
})

test('simultaneous cues survive normalize', (t) => {
  const text = `WEBVTT

00:00:01.000 --> 00:00:04.000
top line

00:00:01.000 --> 00:00:04.000
bottom line
`
  const vtt = vttpeg(text)
  vtt.normalize()
  t.equal(vtt.json().length, 2, 'both cues kept')
  t.deepEqual(
    vtt.json().map((c) => c.text[0]),
    ['top line', 'bottom line'],
    'file-order preserved'
  )
  t.end()
})
