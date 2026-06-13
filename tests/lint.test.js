// test linting of vtt files
import test from 'node:test'
import assert from 'node:assert'
import vttpeg from '../src/index.js'
import fs from 'fs'
import path from 'path'


test('lint overlapping cues', (t) => {
  let input = `WEBVTT

00:00:02.000 --> 00:00:05.000
This cue appears first.

NOTE This is an inline note, also to be ignored.

overlapping_cue
00:00:04.000 --> 00:00:07.000
This cue overlaps with the first one.
(Appears from 00:04 to 00:07)

00:00:08.000 --> 00:00:10.000
This is a final cue.
  `
  let vtt = vttpeg(input)
  assert.strictEqual(vtt.json().length, 3, '3 entries')
  assert.strictEqual(vtt.lint({ silent: true }).length, 1, '1 lint error')
  assert.strictEqual(vtt.isValid(), false, 'is not valid')
})