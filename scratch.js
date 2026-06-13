import vttpeg from './src/main/index.js'
// import fs from 'fs'


let input = `WEBVTT
00:16.000 --> 00:18.000
<v Roger Bingham>from the American Museum of Natural History

intro:
00:18.123 --> 00:20.000
<v Roger Bingham>And with me is Neil deGrasse Tyson

00:20.000 --> 00:22.000
<v Roger Bingham>Astrophysicist, Director of the Hayden Planetarium

00:22.000 --> 00:24.234
<v Roger Bingham>at the AMNH.

NOTE he says this in the intro

00:24.235 --> 00:26.000
<v Roger Bingham>Thank you for walking down here.
`

// const input = '/Volumes/4TB/subtitles/tv-shows/Columbo/S03/Columbo.S03E03.Candidate.For.Crime.vtt'
// let txt = fs.readFileSync(input, 'utf8')
let vtt = vttpeg(input)
vtt.normalize()
// vtt.diffCli()
console.log(vtt.out())
// console.log(vtt.text())

