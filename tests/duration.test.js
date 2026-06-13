// test minDuration / maxDuration
import test from 'node:test'
import assert from 'node:assert'
import vttpeg from '../src/index.js'

const dur = (cue) => Math.round((cue.endTime - cue.startTime) * 1000) / 1000

test('minDuration extends a short final cue', (t) => {
  let text = `WEBVTT

00:00:01.000 --> 00:00:01.500
Quick!
`
  let vtt = vttpeg(text).minDuration(3)
  let cue = vtt.json()[0]
  assert.strictEqual(cue.startTime, 1, 'start unchanged')
  assert.strictEqual(dur(cue), 3, 'extended to 3s (no next cue to block it)')
})

test('minDuration grows only into the available gap', (t) => {
  let text = `WEBVTT

00:00:01.000 --> 00:00:02.000
First

00:00:03.500 --> 00:00:07.000
Second
`
  // first cue wants 3s (-> 4.0) but the next starts at 3.5, so it caps there
  let vtt = vttpeg(text).minDuration(3)
  assert.strictEqual(vtt.json()[0].endTime, 3.5, 'capped at next cue start')
  assert.strictEqual(vtt.json()[1].endTime, 7, 'second cue already long enough, untouched')
})

test('minDuration makes no change when there is no room', (t) => {
  let text = `WEBVTT

00:00:01.000 --> 00:00:02.000
First

00:00:02.000 --> 00:00:04.000
Second
`
  // first cue touches the second - no gap to grow into
  let vtt = vttpeg(text).minDuration(3)
  assert.strictEqual(vtt.json()[0].endTime, 2, 'left unchanged - no room')
})

test('minDuration leaves already-long cues alone', (t) => {
  let text = `WEBVTT

00:00:01.000 --> 00:00:06.000
Plenty long
`
  let vtt = vttpeg(text).minDuration(3)
  assert.strictEqual(vtt.json()[0].endTime, 6, 'unchanged')
})

test('maxDuration trims a long cue', (t) => {
  let text = `WEBVTT

00:00:01.000 --> 00:00:09.000
Lingering...
`
  let vtt = vttpeg(text).maxDuration(4)
  let cue = vtt.json()[0]
  assert.strictEqual(cue.startTime, 1, 'start unchanged')
  assert.strictEqual(cue.endTime, 5, 'trimmed to 4s')
})

test('maxDuration leaves short cues alone', (t) => {
  let text = `WEBVTT

00:00:01.000 --> 00:00:02.000
Brief
`
  let vtt = vttpeg(text).maxDuration(4)
  assert.strictEqual(vtt.json()[0].endTime, 2, 'unchanged')
})

test('min/maxDuration are chainable', (t) => {
  let text = `WEBVTT

00:00:01.000 --> 00:00:01.200
Hi
`
  let out = vttpeg(text).minDuration(2).maxDuration(5).shift(1)
  let cue = out.json()[0]
  assert.strictEqual(cue.startTime, 2, 'shifted')
  assert.strictEqual(cue.endTime, 4, 'min applied then shifted')
})
