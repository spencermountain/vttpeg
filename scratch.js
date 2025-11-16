import vttpeg from './src/_server.js'

const dir = '/Users/spencer/Desktop/subtitles/Simpsons Subtitles/S02'
const file = '/Users/spencer/Desktop/subtitles/Simpsons Subtitles/S02/2x06 - Dead Putting Society.vtt'

const vtt = vttpeg.fromFile(file)
// console.log(vtt.firstEntry())
// console.log(vtt.isValid())
// console.log(vtt.lint())
// console.log(vtt.json())
console.log(vtt.stats())
console.log(vtt.sceneSplit())

// const txt = `WEBVTT

// 1
// 00:00:01.500 --> 00:00:03.000
// This is the first subtitle.

// 2
// 00:00:04.000 --> 00:00:06.000
// This is the second subtitle, with no cue identifier.`
// const vtt = vttpeg(txt)
// // vtt.shift(10)
// vtt.shift(-10)
// console.log(vtt.json())