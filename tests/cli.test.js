// test the --interactive cli flow
import test from 'node:test'
import assert from 'node:assert'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const bin = fileURLToPath(new URL('../cli/bin.js', import.meta.url))

// write a vtt file into a fresh temp dir and return its path
const tmpVtt = (contents) => {
  let dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vttpeg-'))
  let file = path.join(dir, 'sub.vtt')
  fs.writeFileSync(file, contents)
  return file
}

const run = (args, input) => {
  return execFileSync('node', [bin, ...args], { input, encoding: 'utf8' })
}

const dirty = `WEBVTT

00:00:03.000 --> 00:00:04.000
[BANG]
Duck!
`

test('--interactive writes the file on "y"', (t) => {
  let file = tmpVtt(dirty)
  run(['--interactive', '--normalize', file], 'y\n')
  let after = fs.readFileSync(file, 'utf8')
  assert.ok(!after.includes('[BANG]'), 'sfx cue removed')
  assert.ok(after.includes('Duck!'), 'dialogue kept')
})

test('--interactive leaves the file untouched on "n"', (t) => {
  let file = tmpVtt(dirty)
  run(['--interactive', '--normalize', file], 'n\n')
  assert.strictEqual(fs.readFileSync(file, 'utf8'), dirty, 'file unchanged')
})

test('--interactive skips a file with no changes', (t) => {
  let clean = `WEBVTT

00:00:01.000 --> 00:00:02.000
Clean already
`
  let file = tmpVtt(clean)
  // no input needed - it should not prompt
  let out = run(['--interactive', '--normalize', file], '')
  assert.match(out, /no changes/, 'reported no changes')
  assert.strictEqual(fs.readFileSync(file, 'utf8'), clean, 'file unchanged')
})
