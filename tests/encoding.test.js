// test html-entity decoding of cue text
import test from 'tape'
import vttpeg from '../src/index.js'

const cueWith = (line) => `WEBVTT

00:00:01.000 --> 00:00:02.000
${line}
`

test('decodes basic entities', (t) => {
  const vtt = vttpeg(cueWith('Tom &amp; Jerry &lt;3'))
  t.equal(vtt.text(), 'Tom & Jerry <3', 'decoded')
  t.end()
})

test('does not double-decode &amp;', (t) => {
  // '&amp;lt;' is the literal text '&lt;' - not a '<'
  const vtt = vttpeg(cueWith('typed &amp;lt;html&amp;gt; today'))
  t.equal(vtt.text(), 'typed &lt;html&gt; today', 'decoded one level only')
  // and it re-encodes to the same file
  t.ok(vtt.out().includes('typed &amp;lt;html&amp;gt; today'), 'round-trips')
  t.end()
})

test('decodes numeric entities', (t) => {
  const vtt = vttpeg(cueWith('it&#39;s &#8220;fine&#8221; &#x27;ok&#x27;'))
  t.equal(vtt.text(), `it's “fine” 'ok'`, 'decimal and hex decoded')
  t.end()
})

test('leaves invalid numeric entities alone', (t) => {
  const vtt = vttpeg(cueWith('bogus &#1114112; entity'))
  t.equal(vtt.text(), 'bogus &#1114112; entity', 'out-of-range left as-is')
  t.end()
})
