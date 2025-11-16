import vttpeg from './src/_server.js'

const dir = '/Users/spencer/Desktop/subtitles/Simpsons Subtitles/S02'
const file = '/Users/spencer/Desktop/subtitles/Simpsons Subtitles/S02/2x06 - Dead Putting Society.vtt'

// const vtt = vttpeg.fromFile(file)
// console.log(vtt.firstEntry())
// console.log(vtt.isValid())
// console.log(vtt.lint())
// console.log(vtt.json())
// console.log(vtt.stats())

const txt = `WEBVTT
00:16.000 --> 00:18.000
<v Roger Bingham>from the American Museum of Natural History

00:18.000 --> 00:20.000
<v Roger Bingham>And with me is Neil deGrasse Tyson

00:20.000 --> 00:22.000
<v Roger Bingham>Astrophysicist, Director of the Hayden Planetarium

00:22.000 --> 00:24.000
<v Roger Bingham>at the AMNH.

00:24.000 --> 00:26.000
<v Roger Bingham>Thank you for walking down here.

`
const vtt = vttpeg(txt)
console.log(vtt.json())
console.log(vtt.isValid())