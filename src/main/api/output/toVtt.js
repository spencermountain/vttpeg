// produce a valid vtt file
import encode from './encoding.js'

const defaultOptions = {
  // include the leading `00:` hours field even when hours is zero
  showZeroHours: true
}

const pad = (num) => {
  return num.toString().padStart(2, '0')
}
const pad3 = (num) => {
  return num.toString().padStart(3, '0')
}

const toTime = (int, opts) => {
  // work in whole milliseconds to avoid floating-point drift
  let totalMs = Math.round(int * 1000)
  let hours = Math.floor(totalMs / 3600000)
  let minutes = Math.floor((totalMs % 3600000) / 60000)
  let seconds = Math.floor((totalMs % 60000) / 1000)
  let milliseconds = totalMs % 1000
  // optionally omit leading zero hours
  let out = ''
  if (hours !== 0 || opts.showZeroHours) {
    out += `${pad(hours)}:`
  }
  return `${out}${pad(minutes)}:${pad(seconds)}.${pad3(milliseconds)}`
}

const toVtt = (cues, options = {}) => {
  let opts = { ...defaultOptions, ...options }
  let txt = 'WEBVTT\n\n'
  for (let i = 0; i < cues.length; i++) {
    let entry = cues[i]
    if (entry.label) {
      txt += `${entry.label}\n`
    }
    txt += `${toTime(entry.startTime, opts)} --> ${toTime(entry.endTime, opts)}`
    // preserve any cue settings (align/position/line/etc)
    if (entry.attributes) {
      txt += ` ${entry.attributes}`
    }
    txt += `\n${entry.text.map(encode).join('\n')}\n\n`
  }
  return txt.trim()
}
export default toVtt
