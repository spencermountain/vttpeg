import vttpeg from './src/main/index.js'
// import fs from 'fs'

let input = `WEBVTT

00:10.845 --> 00:17.845
<i>-♪ The Mighty Boosh ♪
-♪ Come with us to the Mighty Boosh ♪</i>

00:23.965 --> 00:26.195
[ELECTRONIC SQUELCHES, HUMMING]

00:34.204 --> 00:39.278
-What the hell are you wearing?
-This is the mirror ball suit.

00:39.564 --> 00:40.554
[SIGHING]
`

// const input = '/Volumes/4TB/subtitles/tv-shows/Columbo/S03/Columbo.S03E03.Candidate.For.Crime.vtt'
// let txt = fs.readFileSync(input, 'utf8')
let vtt = vttpeg(input)
vtt.diffCli()
// console.log(vtt.out())
