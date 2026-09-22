import test from 'tape'
import vttpeg from '../src/index.js'

test('basic', (t) => {
  const text = `WEBVTT

1
00:00:01.500 --> 00:00:03.000
This is the first subtitle.

2
00:00:04.000 --> 00:00:06.000
This is the second subtitle, with no cue identifier.
`
  const vtt = vttpeg(text)
  t.equal(vtt.json().length, 2, '2 entries')
  t.equal(vtt.isValid(), true, 'is valid')
  t.equal(vtt.lint({ silent: true }).length, 0, 'no lint errors')
  t.end()
})
