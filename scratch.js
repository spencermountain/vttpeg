import vttpeg from './src/main/index.js'
// import fs from 'fs'

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
finds you repugnant.`

// const input = '/Volumes/4TB/subtitles/tv-shows/Columbo/S03/Columbo.S03E03.Candidate.For.Crime.vtt'
// let txt = fs.readFileSync(input, 'utf8')
let vtt = vttpeg(input)
let html = vtt.diffHtml()
console.log(html)
// console.log(vtt.out())
