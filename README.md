<div align="center">
  <div><b>vttpeg</b></div>
  <!-- <img src="https://user-images.githubusercontent.com/399657/68222691-6597f180-ffb9-11e9-8a32-a7f38aa8bded.png"/> -->
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


Subtitles come in a wide variety of formats, but the only format supported by web browsers is **[VTT](https://en.wikipedia.org/wiki/WebVTT)**.


The VTT format is kinda cool - you can edit them in a text editor.

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
* variety of styles for pacing and lumping of dialogue
* variety of styles for describing non-dialogue sounds

This library helps you easily manipulate VTT files in Node.js and the browser.

The parser is okay, but not perfect. It supports attributes and labels for cues, and ignores notes and styling blocks.

### Node Usage
`npm install vttpeg`

```js
import vttpeg from 'vttpeg'
import fs from 'fs'

const txt = fs.readFileSync('mySubtitle.vtt')
const vtt = vttpeg(txt)
// in node you can also use:
const vtt = vttpeg.fromFile('mySubtitle.vtt')

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

### API

<!-- * `vtt.entries` - get the entries of the vtt file -->
* `vtt.json()` - get the cues as a json array
* `vtt.text()` - get the raw text as a string
* `vtt.plainText()` - get the cleaned-up plain text
* `vtt.out()` - get the vtt file as a string
<!-- * `vtt.debug()` - debug the vtt file -->

analyses:
* `vtt.stats()` - get the stats of the vtt file
* `vtt.lint()` - lint the vtt file
* `vtt.isValid()` - check if the vtt file is valid

text manipulations:
* `vtt.stripVoice()` - remove all voice tags from the text
* `vtt.stripLang()` - remove all language tags from the text
* `vtt.stripXml()` - remove all xml tags from the text
* `vtt.stripStyle()` - remove display attributes from cues (align, size, position, etc)

timestamp manipulations:
* `vtt.shift(seconds)` - shift the timestamps forward or backward
* `vtt.shiftLeft(seconds)` - shift the timestamps left
* `vtt.shiftRight(seconds)` - shift the timestamps right
* `vtt.sort()` - ensure all cues are sorted by start time

utils:
* `vtt.firstEntry()` - get the first entry
* `vtt.lastEntry()` - get the last entry
* `vtt.duration()` - get the duration of the vtt file

* `vtt.sceneSplit(minGap = 2)` - split cues into sections based on gaps between cues


### Browser Usage
```html
<script src="https://unpkg.com/vttpeg"></script>
<script>
  const el = document.querySelector('video') //first video
  const vtt = vttpeg.fromElement(el)
  console.log(vtt.json())
</script>
```

### CLI usage
accepts a file, directory, or glob pattern
```bash
npm install -g vttpeg

vttpeg --shift=10 './subtitles/*.vtt'

vttpeg --lint ./mySubtitle.vtt
```

by default, the files are written with a `'_new'` suffix - you can change this behaviour with the `-append` option or the `--rewrite` option.
```bash
vttpeg --shift=-5 --append=_shift './mySubtitle.vtt' # (mySubtitle_shift.vtt)

vttpeg --lint --rewrite './mySubtitle.vtt'  #(rewrites the file in place)
```


---

### Info
any subtitle format can be converted into VTT format with [ffmpeg](https://www.ffmpeg.org/):
```bash
ffmpeg -i "mySubtitle.srt" "output.vtt"
```

you can extract vtt subtitles from some video files (`mkv/mov/webm/etc`) with:
```bash
ffmpeg './myVideo.mkv' -map 0:s:0 'mySubtitle.vtt'
```



MIT