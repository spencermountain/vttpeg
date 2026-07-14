// test parsing of headers, comment-blocks, and sloppy files
import test from 'node:test'
import assert from 'node:assert'
import vttpeg from '../src/index.js'

test('youtube-style header lines are ignored', (t) => {
  let text = `WEBVTT
Kind: captions
Language: en

00:00:00.500 --> 00:00:03.000
hey everyone welcome back

00:00:03.000 --> 00:00:06.000
today we talk about subtitles
`
  let vtt = vttpeg(text)
  assert.strictEqual(vtt.json().length, 2, '2 entries')
  assert.strictEqual(vtt.json()[0].label, undefined, 'header did not become a label')
  assert.ok(!vtt.out().includes('Language'), 'header not in output')
})

test('hls X-TIMESTAMP-MAP header is ignored', (t) => {
  let text = `WEBVTT
X-TIMESTAMP-MAP=MPEGTS:181083,LOCAL:00:00:00.000

00:00:01.000 --> 00:00:02.000
hello from a live stream
`
  let vtt = vttpeg(text)
  assert.strictEqual(vtt.json().length, 1, '1 entry')
  assert.strictEqual(vtt.json()[0].label, undefined, 'no leaked label')
})

test('multi-line NOTE blocks are ignored', (t) => {
  let text = `WEBVTT

NOTE This is a multi-line note block.
These are used for comments by the author
Two cue blocks are defined below.

00:01.000 --> 00:04.000
Never drink liquid nitrogen.
`
  let vtt = vttpeg(text)
  assert.strictEqual(vtt.json().length, 1, '1 entry')
  assert.strictEqual(vtt.json()[0].label, undefined, 'note text did not become a label')
})

test('STYLE blocks are ignored', (t) => {
  let text = `WEBVTT

STYLE
::cue {
  color: papayawhip;
}

00:00:00.000 --> 00:00:10.000
- Hello <b>world</b>.
`
  let vtt = vttpeg(text)
  assert.strictEqual(vtt.json().length, 1, '1 entry')
  assert.strictEqual(vtt.json()[0].label, undefined, 'css did not become a label')
})

test('REGION blocks are ignored', (t) => {
  let text = `WEBVTT

REGION
id:bill
width:40%

00:00:01.000 --> 00:00:02.000
region cue
`
  let vtt = vttpeg(text)
  assert.strictEqual(vtt.json().length, 1, '1 entry')
  assert.strictEqual(vtt.json()[0].label, undefined, 'region settings did not become a label')
})

test('identifiers still parse after a header', (t) => {
  let text = `WEBVTT
Kind: captions

my-cue
00:00:01.000 --> 00:00:02.000
hello
`
  let vtt = vttpeg(text)
  assert.strictEqual(vtt.json()[0].label, 'my-cue', 'identifier kept')
})

test('missing blank line between cues keeps both cues', (t) => {
  let text = `WEBVTT

00:00:01.000 --> 00:00:02.000
first cue
00:00:03.000 --> 00:00:04.000
second cue
`
  let vtt = vttpeg(text)
  assert.strictEqual(vtt.json().length, 2, 'both cues kept')
  assert.strictEqual(vtt.json()[0].text[0], 'first cue', 'first cue text')
})

test('empty input produces an empty document', (t) => {
  let vtt = vttpeg()
  assert.strictEqual(vtt.json().length, 0, 'no cues')
  assert.strictEqual(vtt.isValid(), false, 'an empty doc is not valid')
})

test('bare WEBVTT header produces an empty document', (t) => {
  let vtt = vttpeg('WEBVTT')
  assert.strictEqual(vtt.json().length, 0, 'no cues')
  assert.deepStrictEqual(vtt.lint(), ['No cues found'], 'linted, not crashed')
})

test('srt input throws a helpful error', (t) => {
  let srt = `1
00:00:01,000 --> 00:00:02,000
an srt file
`
  assert.throws(() => vttpeg(srt), /SRT/, 'mentions srt conversion')
})

test('stats and duration work on an empty document', (t) => {
  let vtt = vttpeg('WEBVTT')
  assert.strictEqual(vtt.stats().cue_count, 0, 'zero cues')
  assert.strictEqual(vtt.stats().duration_seconds, 0, 'zero duration')
  assert.strictEqual(vtt.duration(), 0, 'duration() is 0')
})
