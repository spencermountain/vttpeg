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

### JS API
`npm install vttpeg`

```js
import vttpeg from 'vttpeg'
import fs from 'fs'

const txt = fs.readFileSync('mySubtitle.vtt')
const vtt = vttpeg(txt)

// look for any issues in the subtitle
vtt.lint()
// fix em!
vtt.normalize()

// shift em all over by 5s
vtt.shift(5)

// write the output to a new vtt file
let output = vtt.out()
fs.writeFileSync('./newSubtitle.vtt', output)
```

### Normalize
Optionally remove XML tags, voice tags, language tags, style tags, and music tags.
```js
let input = `WEBVTT

00:10.845 --> 00:17.845
<i>-♪ The Mighty Boosh ♪
-♪ Come with us to the Mighty Boosh ♪</i>

00:23.965 --> 00:26.195
[ELECTRONIC SQUELCHES, HUMMING]

00:34.204 --> 00:39.278
-What the hell are you wearing?
-This is the mirror ball suit.

00:39.564 --> 00:40.554
[SIGHING]
`
let vtt = vttpeg(input)
vtt.normalize()
console.log(vtt.out())

//
// WEBVTT
// 
// 00:34.204 --> 00:39.278
// -What the hell are you wearing?
// -This is the mirror ball suit.
// 
```

### Plaintext Output
```js
let input = `WEBVTT
1
00:16.500 --> 00:18.500
When the moon <00:17.500>hits your eye

1
00:00:18.500 --> 00:00:20.500
Like a <00:19.000>big-a <00:19.500>pizza <00:20.000>pie

1
00:00:20.500 --> 00:00:21.500
That's <00:00:21.000>amore
`
let vtt = vttpeg(input)
vtt.normalize()
console.log(vtt.text())
// When the moon hits your eye
// Like a big-a pizza pie
// That's amore
```

### CLI usage
accepts a file, directory, or glob pattern
```bash
npm install -g vttpeg

vttpeg --shift=10 './subtitles/*.vtt'

vttpeg --lint ./mySubtitle.vtt
```

by default, the files are written with a `'_new'` suffix - you can change this behaviour with the `-append` option or the `--overwrite` option.
```bash
vttpeg --shift=-5 --append=_shift './mySubtitle.vtt' # (mySubtitle_shift.vtt)

vttpeg --lint --overwrite './mySubtitle.vtt'  #(rewrites the file in place)
```

```bash
vttpeg --normalize ./mySubtitle.vtt
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
