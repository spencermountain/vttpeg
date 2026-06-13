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

It's small, dependency-light, ships with **TypeScript types**, and works as both an ESM/CommonJS module and a command-line tool.

The parser is okay, but not perfect. It supports attributes and labels for cues, and ignores notes and styling blocks.

### JS API
`npm install vttpeg`

```js
import vttpeg from 'vttpeg'
import fs from 'fs'

const txt = fs.readFileSync('mySubtitle.vtt', 'utf8')
const vtt = vttpeg(txt)

// look for any issues in the subtitle
vtt.lint()

// clean it up, then nudge every cue 5s later
vtt.normalize().shift(5)

// write the result to a new vtt file
fs.writeFileSync('./newSubtitle.vtt', vtt.out())
```

Most methods that change the cues (`normalize`, `shift`) mutate in place and return the document, so they chain.

### API

| method | returns | description |
|---|---|---|
| `vttpeg(text)` | `Vtt` | parse a `.vtt` string into a document |
| `.lint(opts?)` | `string[]` | list possible problems (overlaps, empty/long cues, bad times) |
| `.isValid()` | `boolean` | `true` when there are no lint errors |
| `.normalize(opts?)` | `Vtt` | strip tags/cruft and fix overlaps *(chainable)* |
| `.shift(seconds)` | `Vtt` | move every cue forwards (or backwards, if negative) *(chainable)* |
| `.scenes(opts?)` | `Cues[]` | split into groups of cues separated by silent gaps |
| `.dialogue()` | `Cues` | keep only cues that look like spoken dialogue |
| `.stats()` | `Stats` | cue count, total/shortest/longest/average durations |
| `.duration()` | `number` | total spoken duration, in seconds |
| `.text()` | `string` | render as readable plaintext |
| `.out(opts?)` | `string` | render back to a valid `.vtt` file |
| `.json()` | `Cue[]` | the raw parsed cues |
| `.diffHtml()` / `.diffCli()` | `string` | diff the original input against the current output |

A `Cue` (from `.json()`) looks like:
```js
{
  startTime: 645.68,        // seconds
  endTime: 647.39,          // seconds
  text: ["It's good..."],
  label: '1',               // optional - cue identifier
  attributes: 'line:90%'    // optional - trailing cue settings
}
```

### Normalize
`normalize()` tidies up a subtitle file. By default it removes XML/HTML tags, voice tags, language tags, style blocks, music/sound cues, notes, and inline timestamps, collapses whitespace, and fixes overlapping cues. Every step is a flag you can turn off:

```js
vtt.normalize({
  stripXml: true,        // <i>, <b>, ...
  stripVoice: true,      // <v Bob>...
  stripLang: true,       // <lang en>...
  stripStyle: true,      // STYLE blocks
  stripMusic: true,      // ♪ ... ♪ and [SOUND] cues
  stripWhitespace: true,
  stripNotes: true,      // NOTE blocks
  stripMetadata: true,   // cue attributes
  stripUndisplayed: true,
  fixOverlaps: true
})
```

Here it strips a music intro and a couple of sound-effect cues, leaving just the dialogue:
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

### Scenes & Stats
`scenes()` groups cues into scenes by looking for silent gaps (default: 2 seconds), and `stats()` gives you a quick summary of a file:
```js
let vtt = vttpeg(txt)
vtt.normalize()

let scenes = vtt.scenes({ minGap: 3 }) // => Cues[]
console.log(`${scenes.length} scenes`)

console.log(vtt.stats())
// {
//   cue_count: 412,
//   duration_seconds: 1284.5,
//   duration: '00:21:24',
//   shortest_cue_seconds: 0.4,
//   longest_cue_seconds: 6.2,
//   average_cue_seconds: 3.1,
//   ...
// }
```

### CLI usage
accepts a file, directory, or glob pattern
```bash
npm install -g vttpeg

vttpeg --shift=10 './subtitles/*.vtt'

vttpeg --lint ./mySubtitle.vtt
```

| flag | description |
|---|---|
| `--lint` | print any lint warnings for each file |
| `--validate` | report whether each file is valid |
| `--shift=<seconds>` | shift every timestamp (negative shifts earlier) |
| `--append=<suffix>` | suffix for the written file (default `.new`) |
| `--overwrite` | rewrite the file in place instead of appending a suffix |
| `--normalize` | cleanup possible issues in the file |

When a transformation is applied (e.g. `--shift`), the result is written to a new file with the `--append` suffix unless `--overwrite` is given:
```bash
vttpeg --shift=-5 --append=_shift './mySubtitle.vtt'  # writes mySubtitle_shift.vtt

vttpeg --shift=10 --overwrite './mySubtitle.vtt'      # rewrites the file in place
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
