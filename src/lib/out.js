// produce a valid vtt file
import { encode } from './encoding.js'

const pad = (num) => {
  return num.toString().padStart(2, '0')
}
const padRight = (num) => {
  return num.toString().padEnd(3, '0')
}

const toHMS = (int) => {
  let hours = Math.floor(int / 3600)
  let minutes = Math.floor((int % 3600) / 60)
  let seconds = parseInt(int % 60, 10)
  let milliseconds = Math.floor((int % 1) * 1000)
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${padRight(milliseconds)}`
}

const out = (entries) => {
  let txt = 'WEBVTT\n\n';
  for (let i = 0; i < entries.length; i++) {
    let entry = entries[i]
    if (entry.label) {
      txt += `${entry.label}\n`
    }
    txt += `${toHMS(entry.startTime)} --> ${toHMS(entry.endTime)}\n`
    txt += `${entry.text.map(encode).join('\n')}\n\n`
  }
  return txt.trim()
}
export default out;