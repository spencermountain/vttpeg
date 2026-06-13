import vttpeg from './src/main/index.js'
// import fs from 'fs'


let input = `WEBVTT
00:16.000 --> 00:18.000
-♪ The Mighty Boosh ♪
-♪ Come with us to the Mighty Boosh ♪
`

// const input = '/Volumes/4TB/subtitles/tv-shows/Columbo/S03/Columbo.S03E03.Candidate.For.Crime.vtt'
// let txt = fs.readFileSync(input, 'utf8')
let vtt = vttpeg(input)
vtt.normalize()
vtt.shift(10)
// vtt.diffCli()
console.log(vtt.json())
console.log(vtt.text())

