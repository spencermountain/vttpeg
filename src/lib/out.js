// produce a valid vtt file
import { encode } from './encoding.js'

const toHMS = (int) => {
  let hours = Math.floor(int / 3600)
  let minutes = Math.floor((int % 3600) / 60)
  let seconds = int % 60
  let milliseconds = Math.floor((int % 1) * 1000)
  return `${hours}:${minutes}:${seconds}.${milliseconds}`
}

const out = (entries) => {
  let txt = 'WEBVTT\n\n';
  for (let i = 0; i < entries.length; i++) {
    let entry = entries[i]
    txt += `${toHMS(entry.startTime)} --> ${toHMS(entry.endTime)}\n`
    txt += `${entry.text.map(encode).join('\n')}\n\n`
  }
  return txt
}
export default out;