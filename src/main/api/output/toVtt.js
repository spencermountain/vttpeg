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
  const totalMs = Math.round(int * 1000)
  const hours = Math.floor(totalMs / 3600000)
  const minutes = Math.floor((totalMs % 3600000) / 60000)
  const seconds = Math.floor((totalMs % 60000) / 1000)
  const milliseconds = totalMs % 1000
  // hours are mandatory once non-zero, otherwise follow the file's style
  let out = ''
  if (hours !== 0 || opts.showZeroHours) {
    out += `${pad(hours)}:`
  }
  return `${out}${pad(minutes)}:${pad(seconds)}.${pad3(milliseconds)}`
}

const toVtt = (cues, options = {}) => {
  const opts = { ...defaultOptions, ...options }
  let txt = 'WEBVTT\n\n'
  for (let i = 0; i < cues.length; i++) {
    const entry = cues[i]
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
