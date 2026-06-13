import vttpeg from './src/main/index.js'
import fs from 'fs'


let input = `WEBVTT

00:22.908 --> 00:24.535
Linda Johnson is
a political liability.

00:24.618 --> 00:25.786
Harry, I need her.

00:25.828 --> 00:26.953
I can understand now

00:27.036 --> 00:28.287
why Nelson
finds you repugnant.

00:28.329 --> 00:30.248
Oh, you're wonderful,
wonderful, all of you!

 `

const inputFile = '/Volumes/4TB/subtitles/tv-shows/Columbo/S03/Columbo.S03E03.Candidate.For.Crime.vtt'
let txt = fs.readFileSync(inputFile, 'utf8')
let vtt = vttpeg(txt)
vtt.normalize()
vtt.lint()
let scenes = vtt.scenes()
console.log(scenes)
// vtt.shift(10)
// vtt.diffCli()
// console.log(vtt.json())
// console.log(vtt.out())
// console.log(vtt.stats())
// console.log(vtt.text())

