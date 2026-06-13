// test splitting cues into scenes by silent gaps
import test from 'node:test'
import assert from 'node:assert'
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
  assert.strictEqual(scenes.length, 2, 'two scenes')
  assert.strictEqual(scenes[0].json().length, 2, 'first scene has 2 cues')
  assert.strictEqual(scenes[1].json().length, 2, 'second scene has 2 cues')
})

test('scenes keeps every cue (none dropped)', (t) => {
  let scenes = vttpeg(text).scenes()
  let total = scenes.reduce((n, s) => n + s.json().length, 0)
  assert.strictEqual(total, 4, 'all 4 cues accounted for')
  assert.strictEqual(scenes[1].json()[1].text[0], 'd', 'final cue is present')
})

test('scenes returns usable Cues instances', (t) => {
  let scene = vttpeg(text).scenes()[0]
  assert.ok(scene.out().startsWith('WEBVTT'), 'out() works on a scene')
  assert.strictEqual(scene.text(), 'a\nb', 'text() works on a scene')
})

test('minGap controls the split threshold', (t) => {
  // the only gaps are 0.5s and 6.5s; a 1s threshold still finds the one big gap
  assert.strictEqual(vttpeg(text).scenes({ minGap: 1 }).length, 2, 'big gap splits')
  // a huge threshold yields a single scene
  assert.strictEqual(vttpeg(text).scenes({ minGap: 30 }).length, 1, 'no split')
})
