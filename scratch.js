import vttpeg from './src/main/index.js'
import fs from 'fs'
import path from 'path'

let txt = `WEBVTT
05:43.680 --> 05:45.398
It's good... (MUTTERING)

05:45.480 --> 05:46.879
Why did I add in that line?

05:47.040 --> 05:48.075
Ahem.

05:48.240 --> 05:49.275
(CLEARING THROAT)

05:49.360 --> 05:52.113
Tory Bronwyn... Tory Matthews...

`

// open all files in the directory recursively
const directory = '/Volumes/4TB/subtitles/'
const files = fs.readdirSync(directory, { recursive: true })
for (const file of files) {
  if (file.endsWith('.vtt')) {
    const filePath = path.join(directory, file)
    const txt = fs.readFileSync(filePath, 'utf8')
    let vtt = vttpeg(txt)
    vtt.normalize()
    // let scenes = vtt.scenes()
    // console.log(vtt.duration())
    if (!vtt.isValid()) {
      console.log(file)
      vtt.lint({ verbose: true })
    }
    // console.log(vtt.isValid())
    // console.log(vtt.stats())
  }
}

// const inputFile = '/Volumes/4TB/subtitles/tv-shows/Simpsons/S01/1x12 - Krusty Gets Busted.vtt'
// let txt = fs.readFileSync(inputFile, 'utf8')
let vtt = vttpeg(txt)
vtt.normalize()
vtt.lint({ verbose: true })
// let scenes = vtt.scenes()
// console.log(vtt.json())
// console.log(vtt.out())
console.log(vtt.stats())
console.log(vtt.text())

