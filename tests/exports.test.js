import test from 'tape'
import { createRequire } from 'node:module'
import vttpeg from 'vttpeg'

const require = createRequire(import.meta.url)
const input = 'WEBVTT\n\n00:01.000 --> 00:03.000\nHello world\n'

for (const [format, parse] of [['ESM', vttpeg], ['CommonJS', require('vttpeg')]]) {
  test(`${format} package export is a callable parser`, (t) => {
    t.equal(typeof parse, 'function')
    const document = parse(input)
    t.deepEqual(document.json(), [{
      startTime: 1,
      endTime: 3,
      text: ['Hello world']
    }])
    t.equal(document.shift(1), document)
    t.equal(document.json()[0].startTime, 2)
    t.end()
  })
}
