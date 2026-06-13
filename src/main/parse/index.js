import { decode } from './encoding.js'
import parseCue from './parseCue.js'
const isCueLine = /-->/

// Parse VTT content into a structured array of subtitle entries
const parseVTT = function (vttContent) {
  // Split content into lines
  const lines = vttContent.trim().split('\n')

  // Check if it's a valid WebVTT file
  if (!lines[0].includes('WEBVTT')) {
    throw new Error('Invalid WebVTT format')
  }

  const cues = []
  let current = null
  let label = null
  // does the file write timestamps in canonical (hh:mm:ss) or compact (mm:ss) form?
  let hasHours = false

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    // empty line means cue is done
    if (!line) {
      if (current) {
        cues.push(current)
      }
      current = null
      continue
    }

    // a cue line has a --> separator
    if (isCueLine.test(line)) {
      current = parseCue(line)
      // remember the file's timestamp style from the start time
      if (/^\d{1,2}:\d{2}:\d{2}/.test(line.split('-->')[0].trim())) {
        hasHours = true
      }
      if (label) {
        current.label = label
        label = null
      }
      continue
    }
    // this looks like a normal text line
    if (current) {
      current.text.push(decode(line))
    } else {
      // this may be a label for the next cue
      label = line.trim()
    }
  }

  // Don't forget the last entry
  if (current) {
    cues.push(current)
  }

  return { cues, hasHours }
}
export default parseVTT
