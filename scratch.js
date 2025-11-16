import vttpeg from './src/_server.js'

const dir = '/Users/spencer/Desktop/subtitles/Simpsons Subtitles/S02'
const file = '/Users/spencer/Desktop/subtitles/Simpsons Subtitles/S02/2x06 - Dead Putting Society.vtt'

const vtt = vttpeg.fromFile(file)
// console.log(vtt.firstEntry())
// console.log(vtt.isValid())
// console.log(vtt.lint())
// console.log(vtt.json())
console.log(vtt.stats())

// const txt = `

// WEBVTT

// 00:00:00.000 --> 00:00:00.000
// Hello, world!

// 00:00:00.000 --> 00:00:00.000
// Hello, world!
// `
// const vtt = vttpeg(txt)
