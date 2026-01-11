// produce a valid vtt file
import encode from './encoding.js'

const defaultOptions = {
  showZeroHours: false
}

const pad = (num) => {
  return num.toString().padStart(2, '0')
}
const padRight = (num) => {
  return num.toString().padEnd(3, '0')
}

const toTime = (int, opts) => {
  let hours = Math.floor(int / 3600)
  let minutes = Math.floor((int % 3600) / 60)
  let seconds = parseInt(int % 60, 10)
  let milliseconds = Math.floor((int % 1) * 1000)
  // omit leading zero hours
  let out = ''
  if (hours !== '00' || opts.showZeroHours) {
    out += `${pad(hours)}:`
  }
  return `${out}${pad(minutes)}:${pad(seconds)}.${padRight(milliseconds)}`
}

const toVtt = (cues, options = {}) => {
  let opts = { ...defaultOptions, ...options }
  let txt = 'WEBVTT\n\n'
  for (let i = 0; i < cues.length; i++) {
    let entry = cues[i]
    if (entry.label) {
      txt += `${entry.label}\n`
    }
    txt += `${toTime(entry.startTime, opts)} --> ${toTime(entry.endTime, opts)}\n`
    txt += `${entry.text.map(encode).join('\n')}\n\n`
  }
  return txt.trim()
}
export default toVtt
