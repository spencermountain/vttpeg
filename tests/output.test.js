// test the .out() vtt serializer
import test from 'tape'
import vttpeg from '../src/index.js'

test('round-trips timestamps without drift', (t) => {
  let text = `WEBVTT

00:00:17.845 --> 00:00:19.999
Hello
`
  let out = vttpeg(text).out()
  t.ok(out.includes('00:00:17.845 --> 00:00:19.999'), out)
  t.end()
})

test('preserves compact (no-hours) timestamps on round-trip', (t) => {
  let text = `WEBVTT

00:10.845 --> 00:17.845
Hello
`
  let out = vttpeg(text).out()
  // no incidental "00:" hours field added
  t.ok(out.includes('00:10.845 --> 00:17.845'), out)
  t.ok(!out.includes('00:00:10.845'), 'did not add an hours field')
  t.end()
})

test('keeps compact style for a changed timestamp', (t) => {
  let text = `WEBVTT

00:10.000 --> 00:12.000
Hello
`
  // shifting changes the values, but the no-hours style should be kept
  let out = vttpeg(text).shift(5).out()
  t.ok(out.includes('00:15.000 --> 00:17.000'), out)
  t.end()
})

test('showZeroHours can still force a style', (t) => {
  let text = `WEBVTT

00:10.845 --> 00:17.845
Hello
`
  let forced = vttpeg(text).out({ showZeroHours: true })
  t.ok(forced.includes('00:00:10.845 --> 00:00:17.845'), forced)
  t.end()
})

test('pads sub-100ms milliseconds correctly', (t) => {
  let text = `WEBVTT

00:00:01.050 --> 00:00:02.005
Hello
`
  let out = vttpeg(text).out()
  t.ok(out.includes('00:00:01.050 --> 00:00:02.005'), out)
  t.end()
})

test('preserves cue settings on output', (t) => {
  let text = `WEBVTT

00:00:02.000 --> 00:00:04.000 align:start position:50%
Hello
`
  let out = vttpeg(text).out()
  t.ok(out.includes('--> 00:00:04.000 align:start position:50%'), out)
  t.end()
})

test('does not escape apostrophes or quotes', (t) => {
  let text = `WEBVTT

00:00:01.000 --> 00:00:02.000
It's a "test", don't you think?
`
  let out = vttpeg(text).out()
  t.ok(out.includes(`It's a "test", don't you think?`), out)
  t.end()
})

test('showZeroHours:false omits a zero hours field', (t) => {
  let text = `WEBVTT

00:00:01.000 --> 00:00:02.000
Hello
`
  let out = vttpeg(text).out({ showZeroHours: false })
  t.ok(out.includes('00:01.000 --> 00:02.000'), out)
  t.end()
})

test('parses SRT-style comma decimals', (t) => {
  let text = `WEBVTT

00:00:01,500 --> 00:00:02,500
Hello
`
  let cue = vttpeg(text).json()[0]
  t.equal(cue.startTime, 1.5, 'start parsed')
  t.equal(cue.endTime, 2.5, 'end parsed')
  t.equal(cue.attributes, undefined, 'no leaked attributes')
  t.end()
})

test('lint flags an over-long line', (t) => {
  let text = `WEBVTT

00:00:01.000 --> 00:00:02.000
${'x'.repeat(120)}
`
  let errors = vttpeg(text).lint({ silent: true })
  t.ok(errors.some((e) => e.includes('too long')), JSON.stringify(errors))
  t.end()
})
