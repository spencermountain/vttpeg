<div align="center">
  <div><b>vttpeg</b></div>
  <img src="https://user-images.githubusercontent.com/399657/68222691-6597f180-ffb9-11e9-8a32-a7f38aa8bded.png"/>
  <div>manipulate subtitles in vtt format</div>
  <div><code>npm install vttpeg</code></div>
  <div align="center">
    <sub>
      by
      <a href="https://github.com/spencermountain">Spencer Kelly</a> 
    </sub>
  </div>
  <img height="25px" src="https://user-images.githubusercontent.com/399657/68221824-09809d80-ffb8-11e9-9ef0-6ed3574b0ce8.png"/>
</div>

<div align="center">
  <div>
    <a href="https://npmjs.org/package/vttpeg">
    <img src="https://img.shields.io/npm/v/vttpeg.svg?style=flat-square" />
  </a>
  <a href="https://bundlephobia.com/result?p=vttpeg">
    <img src="https://img.shields.io/bundlephobia/min/vttpeg" />
  </a>
  </div>
</div>

<!-- spacer -->
<img height="15px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

<!-- spacer -->
<img height="50px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>


### About
Subtitles come in a variety of formats, the only format supported in web browsers is **[VTT](https://en.wikipedia.org/wiki/WebVTT)**.


The VTT format is kinda cool - the subtitles are editable in a text editor.

They look like this:
```vtt
WEBVTT

00:00:00.000 --> 00:00:00.000
It was the best of times, 

00:00:01.000 --> 00:00:02.000
it was the worst of times...
```

They can be added to a webpage like this:
```html
<video controls src="myVideo.mp4">
  <track default kind="captions" src="mySubtitles.vtt" srclang="en" />
</video>
```


There are some gotchas with the VTT format - 
* webvtt tracks aren't writable
* sometimes the timestamps are shifted by an annoying few seconds
* some 3rd party services add cruft to the vtt file
* sometimes the subtitles are not in the correct order
* variety of styles for line breaks and other formatting
* variety of styles for describing non-dialogue sounds

This library helps you easily manipulate VTT files in Node.js and the browser.

### Node Usage
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

### Browser Usage
```html
<script src="https://unpkg.com/vttpeg"></script>
<script>
  const vtt = vttpeg(txt)
</script>
```

### CLI usage
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

any subtitle format can be converted into VTT format with [ffmpeg](https://www.ffmpeg.org/):
```bash
ffmpeg -i "mySubtitle.srt" "output.vtt"
```

MIT