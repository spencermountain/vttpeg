import vttpeg from './src/main/index.js'
import fs from 'fs'
import path from 'path'

let txt = `WEBVTT

00:08.279 --> 00:10.903
["AULD LANG SYNE" PLAYING]

00:24.570 --> 00:28.782
NARRATOR: <i>On February 23, 1960,</i>

00:28.920 --> 00:31.854
<i>a brass band played "Auld Lang Syne,"</i>


// `

// // open all files in the directory recursively
// const directory = '/Volumes/4TB/subtitles/'
// const files = fs.readdirSync(directory, { recursive: true })
// for (const file of files) {
//   if (file.endsWith('.vtt')) {
//     const filePath = path.join(directory, file)
//     const txt = fs.readFileSync(filePath, 'utf8')
//     let vtt = vttpeg(txt)
//     vtt.normalize()
//     // let scenes = vtt.scenes()
//     // console.log(vtt.duration())
//     if (!vtt.isValid()) {
//       console.log(file)
//       vtt.lint({ verbose: true })
//     }
//     // console.log(vtt.isValid())
//     // console.log(vtt.stats())
//   }
// }

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

