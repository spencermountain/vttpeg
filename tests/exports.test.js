import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import vttpeg from 'vttpeg'

const require = createRequire(import.meta.url)
const input = 'WEBVTT\n\n00:01.000 --> 00:03.000\nHello world\n'

for (const [format, parse] of [['ESM', vttpeg], ['CommonJS', require('vttpeg')]]) {
  test(`${format} package export is a callable parser`, () => {
    assert.equal(typeof parse, 'function')
    const document = parse(input)
    assert.deepEqual(document.json(), [{
      startTime: 1,
      endTime: 3,
      text: ['Hello world']
    }])
    assert.equal(document.shift(1), document)
    assert.equal(document.json()[0].startTime, 2)
  })
}
