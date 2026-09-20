// test the --interactive cli flow
import test from 'tape'
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
  t.ok(!after.includes('[BANG]'), 'sfx cue removed')
  t.ok(after.includes('Duck!'), 'dialogue kept')
  t.end()
})

test('--interactive leaves the file untouched on "n"', (t) => {
  let file = tmpVtt(dirty)
  run(['--interactive', '--normalize', file], 'n\n')
  t.equal(fs.readFileSync(file, 'utf8'), dirty, 'file unchanged')
  t.end()
})

test('--interactive skips a file with no changes', (t) => {
  let clean = `WEBVTT

00:00:01.000 --> 00:00:02.000
Clean already
`
  let file = tmpVtt(clean)
  // no input needed - it should not prompt
  let out = run(['--interactive', '--normalize', file], '')
  t.match(out, /no changes/, 'reported no changes')
  t.equal(fs.readFileSync(file, 'utf8'), clean, 'file unchanged')
  t.end()
})

test('keeps dots in episode-style filenames', (t) => {
  let dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vttpeg-'))
  let file = path.join(dir, 'My.Show.S01E01.vtt')
  fs.writeFileSync(file, dirty)
  run(['--normalize', file], '')
  let written = fs.readdirSync(dir).sort()
  t.deepEqual(written, ['My.Show.S01E01.new.vtt', 'My.Show.S01E01.vtt'], 'suffix before .vtt only')
  t.end()
})

test('accepts a ./ path prefix', (t) => {
  let dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vttpeg-'))
  fs.writeFileSync(path.join(dir, 'sub.vtt'), dirty)
  // run from inside the temp dir, README-style
  let out = execFileSync('node', [bin, '--lint', './sub.vtt'], { cwd: dir, encoding: 'utf8' })
  t.match(out, /Processing 1 vtt files/, 'found the ./ file')
  t.end()
})

test('prints usage when no input is given', (t) => {
  t.throws(
    () => run(['--lint'], ''),
    (err) => /Usage: vttpeg/.test(err.stderr) && err.status === 1,
    'usage message on stderr, exit 1'
  )
  t.end()
})

test('reports a missing path cleanly', (t) => {
  t.throws(
    () => run(['--lint', '/no/such/dir/file.vtt'], ''),
    (err) => /No such file or directory/.test(err.stderr) && err.status === 1,
    'friendly error, exit 1'
  )
  t.end()
})
