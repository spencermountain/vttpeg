import vttpeg from './src/index.js'

const txt = `

WEBVTT

00:00:00.000 --> 00:00:00.000
Hello, world!

00:00:00.000 --> 00:00:00.000
Hello, world!
`

const vtt = vttpeg(txt)

console.log(vtt.json())