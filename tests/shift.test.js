import test from 'tape';
import vttpeg from '../src/index.js';

test('shift', (t) => {
  t.equal(true, true, 'true is true')
  let text = `WEBVTT

00:00:00.000 --> 00:00:02.000
Hello, world!

00:00:02.000 --> 00:00:04.000
Hello, world 2!

00:00:05.000 --> 00:00:07.000
Hello, world 3!`
  let vtt = vttpeg(text)

  t.equal(vtt.json()[0].startTime, 0, 'first entry starts at 0')
  t.equal(vtt.json()[0].endTime, 2, 'first entry ends at 2')
  t.equal(vtt.json()[1].startTime, 2, 'second entry starts at 2')
  t.equal(vtt.json()[1].endTime, 4, 'second entry ends at 4')
  t.equal(vtt.json()[2].startTime, 5, 'third entry starts at 5')
  t.equal(vtt.json()[2].endTime, 7, 'third entry ends at 7')

  vtt.shift(10)
  t.equal(vtt.json()[0].startTime, 10, 'first entry starts at 10')
  t.equal(vtt.json()[0].endTime, 12, 'first entry ends at 12')
  t.equal(vtt.json()[1].startTime, 12, 'second entry starts at 12')
  t.equal(vtt.json()[1].endTime, 14, 'second entry ends at 14')
  t.equal(vtt.json()[2].startTime, 15, 'third entry starts at 15')
  t.equal(vtt.json()[2].endTime, 17, 'third entry ends at 17')
  // shift it back
  vtt.shift(-10)
  t.equal(vtt.json()[0].startTime, 0, 'first entry starts at 0')
  t.equal(vtt.json()[0].endTime, 2, 'first entry ends at 2')
  t.equal(vtt.json()[1].startTime, 2, 'second entry starts at 2')
  t.equal(vtt.json()[1].endTime, 4, 'second entry ends at 4')
  t.equal(vtt.json()[2].startTime, 5, 'third entry starts at 5')
  t.equal(vtt.json()[2].endTime, 7, 'third entry ends at 7')
  t.end()
})

test('shift clamps at zero', (t) => {
  let text = `WEBVTT

00:00:05.000 --> 00:00:07.000
early cue

00:01:00.000 --> 00:01:02.000
later cue
`
  let vtt = vttpeg(text)
  vtt.shift(-10)
  t.equal(vtt.json()[0].startTime, 0, 'clamped to 0')
  t.equal(vtt.json()[0].endTime, 0, 'clamped to 0')
  t.equal(vtt.json()[1].startTime, 50, 'later cue shifted normally')
  // and the output has no negative timestamps
  t.ok(!vtt.out().includes('-1'), 'no garbage timestamps')
  t.end()
})
