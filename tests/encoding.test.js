// test html-entity decoding of cue text
import test from 'node:test'
import assert from 'node:assert'
import vttpeg from '../src/index.js'

const cueWith = (line) => `WEBVTT

00:00:01.000 --> 00:00:02.000
${line}
`

test('decodes basic entities', (t) => {
  let vtt = vttpeg(cueWith('Tom &amp; Jerry &lt;3'))
  assert.strictEqual(vtt.text(), 'Tom & Jerry <3', 'decoded')
})

test('does not double-decode &amp;', (t) => {
  // '&amp;lt;' is the literal text '&lt;' - not a '<'
  let vtt = vttpeg(cueWith('typed &amp;lt;html&amp;gt; today'))
  assert.strictEqual(vtt.text(), 'typed &lt;html&gt; today', 'decoded one level only')
  // and it re-encodes to the same file
  assert.ok(vtt.out().includes('typed &amp;lt;html&amp;gt; today'), 'round-trips')
})

test('decodes numeric entities', (t) => {
  let vtt = vttpeg(cueWith('it&#39;s &#8220;fine&#8221; &#x27;ok&#x27;'))
  assert.strictEqual(vtt.text(), `it's “fine” 'ok'`, 'decimal and hex decoded')
})

test('leaves invalid numeric entities alone', (t) => {
  let vtt = vttpeg(cueWith('bogus &#1114112; entity'))
  assert.strictEqual(vtt.text(), 'bogus &#1114112; entity', 'out-of-range left as-is')
})
