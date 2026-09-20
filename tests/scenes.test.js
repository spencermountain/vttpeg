// test splitting cues into scenes by silent gaps
import test from 'tape'
import vttpeg from '../src/index.js'

const text = `WEBVTT

00:00:01.000 --> 00:00:02.000
a

00:00:02.500 --> 00:00:03.500
b

00:00:10.000 --> 00:00:11.000
c

00:00:11.200 --> 00:00:12.000
d
`

test('scenes splits on a silent gap', (t) => {
  let scenes = vttpeg(text).scenes()
  t.equal(scenes.length, 2, 'two scenes')
  t.equal(scenes[0].json().length, 2, 'first scene has 2 cues')
  t.equal(scenes[1].json().length, 2, 'second scene has 2 cues')
  t.end()
})

test('scenes keeps every cue (none dropped)', (t) => {
  let scenes = vttpeg(text).scenes()
  let total = scenes.reduce((n, s) => n + s.json().length, 0)
  t.equal(total, 4, 'all 4 cues accounted for')
  t.equal(scenes[1].json()[1].text[0], 'd', 'final cue is present')
  t.end()
})

test('scenes returns usable Cues instances', (t) => {
  let scene = vttpeg(text).scenes()[0]
  t.ok(scene.out().startsWith('WEBVTT'), 'out() works on a scene')
  t.equal(scene.text(), 'a\nb', 'text() works on a scene')
  t.end()
})

test('minGap controls the split threshold', (t) => {
  // the only gaps are 0.5s and 6.5s; a 1s threshold still finds the one big gap
  t.equal(vttpeg(text).scenes({ minGap: 1 }).length, 2, 'big gap splits')
  // a huge threshold yields a single scene
  t.equal(vttpeg(text).scenes({ minGap: 30 }).length, 1, 'no split')
  t.end()
})
