import vttpeg, { type Cue, type Cues, type Vtt, type NormalizeOptions } from 'vttpeg'

const options: NormalizeOptions = { stripSpeakerLabels: true }
const document: Vtt = vttpeg('WEBVTT').normalize(options).shift(1)
const cues: Cue[] = document.json()
const scene: Cues | undefined = document.scenes()[0]
scene?.out({ showZeroHours: false })

// @ts-expect-error cue times must be numbers
cues.push({ startTime: '1', endTime: 2, text: [] })
// @ts-expect-error Vtt is an instance type, not an exported constructor
new Vtt()
// @ts-expect-error Cues is an instance type, not an exported constructor
new Cues([])
