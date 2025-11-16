<div align="center">
  <div>
  VTTpeg
  </div>

  <a href="https://npmjs.org/package/vttpeg">
    <img src="https://img.shields.io/npm/v/vttpeg.svg?style=flat-square" />
  </a>
  <a href="https://bundlephobia.com/result?p=vttpeg@latest">
    <img src="https://badgen.net/bundlephobia/min/vttpeg" />
  </a>
</div>

<!-- spacer -->
<img height="50px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>


### Usage
`npm install vttpeg`

```js
import vttpeg from 'vttpeg'
import fs from 'fs'

const txt = fs.readFileSync('mySubtitle.vtt', 'utf8')
const vtt = vttpeg(txt)

// manipulate the timings
vtt.shift(10)
vtt.shiftLeft(10)
vtt.shiftRight(10)

// run analysis on the vtt file
vtt.stats()
// cleanup any awkward entries
vtt.lint({silent : false})
// detect silences
let gaps = vtt.gaps()

// outputs for the vtt file
vtt.printVtt()
vtt.json()
// plaintext dialogue
vtt.text()
// command-line view of the vtt file
vtt.debug()

```

### CLI
```bash
vttpeg "./subtitles/*.vtt" --shift 10

vttpeg "./subtitles/*.vtt" --lint
```

by default, the new files with a _new suffix are created. You can change this with the `-append` option or the `--rewrite` option.
```bash
vttpeg "./mySubtitle.vtt" --append "_shifted"
vttpeg "./mySubtitle.vtt" --rewrite #rewrites the files in place
```


---

convert a subtitle into VTT format with `ffmpeg`:
```bash
ffmpeg -i "mySubtitle.srt" "output.vtt"
```

MIT