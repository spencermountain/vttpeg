import vttpeg = require('vttpeg')

const options: vttpeg.NormalizeOptions = { stripSpeakerLabels: true }
const document: vttpeg.Vtt = vttpeg('WEBVTT').normalize(options).shift(1)
const cues: vttpeg.Cue[] = document.json()
const scene: vttpeg.Cues | undefined = document.scenes()[0]
scene?.out({ showZeroHours: false })

// @ts-expect-error cue times must be numbers
cues.push({ startTime: '1', endTime: 2, text: [] })
// @ts-expect-error the CommonJS export is the function itself
vttpeg.default('WEBVTT')
// @ts-expect-error Vtt is an instance type, not an exported constructor
new vttpeg.Vtt()
