import vttpeg from './src/main/index.js'
import fs from 'fs'
import path from 'path'

// let txt = `WEBVTT

// 00:00:02.000 --> 00:00:05.000
// This cue appears first.

// overlapping_cue
// 00:00:04.000 --> 00:00:07.000
// This cue overlaps with the first one.
// (Appears from 00:04 to 00:07)

// 00:00:08.000 --> 00:00:10.000
// This is a final cue.

//  `

// open all files in the directory recursively
const directory = '/Volumes/4TB/subtitles/tv-shows/'
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
// let vtt = vttpeg(txt)
// vtt.normalize()
// vtt.lint()
// let scenes = vtt.scenes()
// console.log(vtt.json())
// console.log(vtt.out())
// console.log(vtt.stats())
// console.log(vtt.text())

