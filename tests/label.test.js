import test from 'tape';
import vttpeg from '../src/index.js';

test('label', (t) => {
  const text = `WEBVTT

1
00:00:22.230 --> 00:00:24.606
This is the first subtitle.

2 Some Text
00:00:30.739 --> 00:00:34.074
This is the second.

3
00:00:34.159 --> 00:00:35.743
This is the third

00:00:36.000 --> 00:00:37.000
This is the fourth
`
  const vtt = vttpeg(text)
  t.equal(vtt.json().length, 4, '4 entries')
  t.equal(vtt.isValid(), true, 'is valid')
  t.equal(vtt.lint({ silent: true }).length, 0, 'no lint errors')
  t.equal(vtt.json()[0].label, '1', 'first entry has label 1')
  t.equal(vtt.json()[1].label, '2 Some Text', 'second entry has label 2')
  t.equal(vtt.json()[2].label, '3', 'third entry has label 3')
  t.equal(vtt.json()[3].label, undefined, 'fourth entry has no label')
  t.end()
})
