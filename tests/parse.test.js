// test parsing of headers, comment-blocks, and sloppy files
import test from 'tape'
import vttpeg from '../src/index.js'

test('youtube-style header lines are ignored', (t) => {
  const text = `WEBVTT
Kind: captions
Language: en

00:00:00.500 --> 00:00:03.000
hey everyone welcome back

00:00:03.000 --> 00:00:06.000
today we talk about subtitles
`
  const vtt = vttpeg(text)
  t.equal(vtt.json().length, 2, '2 entries')
  t.equal(vtt.json()[0].label, undefined, 'header did not become a label')
  t.ok(!vtt.out().includes('Language'), 'header not in output')
  t.end()
})

test('hls X-TIMESTAMP-MAP header is ignored', (t) => {
  const text = `WEBVTT
X-TIMESTAMP-MAP=MPEGTS:181083,LOCAL:00:00:00.000

00:00:01.000 --> 00:00:02.000
hello from a live stream
`
  const vtt = vttpeg(text)
  t.equal(vtt.json().length, 1, '1 entry')
  t.equal(vtt.json()[0].label, undefined, 'no leaked label')
  t.end()
})

test('multi-line NOTE blocks are ignored', (t) => {
  const text = `WEBVTT

NOTE This is a multi-line note block.
These are used for comments by the author
Two cue blocks are defined below.

00:01.000 --> 00:04.000
Never drink liquid nitrogen.
`
  const vtt = vttpeg(text)
  t.equal(vtt.json().length, 1, '1 entry')
  t.equal(vtt.json()[0].label, undefined, 'note text did not become a label')
  t.end()
})

test('STYLE blocks are ignored', (t) => {
  const text = `WEBVTT

STYLE
::cue {
  color: papayawhip;
}

00:00:00.000 --> 00:00:10.000
- Hello <b>world</b>.
`
  const vtt = vttpeg(text)
  t.equal(vtt.json().length, 1, '1 entry')
  t.equal(vtt.json()[0].label, undefined, 'css did not become a label')
  t.end()
})

test('REGION blocks are ignored', (t) => {
  const text = `WEBVTT

REGION
id:bill
width:40%

00:00:01.000 --> 00:00:02.000
region cue
`
  const vtt = vttpeg(text)
  t.equal(vtt.json().length, 1, '1 entry')
  t.equal(vtt.json()[0].label, undefined, 'region settings did not become a label')
  t.end()
})

test('identifiers still parse after a header', (t) => {
  const text = `WEBVTT
Kind: captions

my-cue
00:00:01.000 --> 00:00:02.000
hello
`
  const vtt = vttpeg(text)
  t.equal(vtt.json()[0].label, 'my-cue', 'identifier kept')
  t.end()
})

test('missing blank line between cues keeps both cues', (t) => {
  const text = `WEBVTT

00:00:01.000 --> 00:00:02.000
first cue
00:00:03.000 --> 00:00:04.000
second cue
`
  const vtt = vttpeg(text)
  t.equal(vtt.json().length, 2, 'both cues kept')
  t.equal(vtt.json()[0].text[0], 'first cue', 'first cue text')
  t.end()
})

test('empty input produces an empty document', (t) => {
  const vtt = vttpeg()
  t.equal(vtt.json().length, 0, 'no cues')
  t.equal(vtt.isValid(), false, 'an empty doc is not valid')
  t.end()
})

test('bare WEBVTT header produces an empty document', (t) => {
  const vtt = vttpeg('WEBVTT')
  t.equal(vtt.json().length, 0, 'no cues')
  t.deepEqual(vtt.lint(), ['No cues found'], 'linted, not crashed')
  t.end()
})

test('srt input throws a helpful error', (t) => {
  const srt = `1
00:00:01,000 --> 00:00:02,000
an srt file
`
  t.throws(() => vttpeg(srt), /SRT/, 'mentions srt conversion')
  t.end()
})

test('stats and duration work on an empty document', (t) => {
  const vtt = vttpeg('WEBVTT')
  t.equal(vtt.stats().cue_count, 0, 'zero cues')
  t.equal(vtt.stats().duration_seconds, 0, 'zero duration')
  t.equal(vtt.duration(), 0, 'duration() is 0')
  t.end()
})
