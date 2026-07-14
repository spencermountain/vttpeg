import { decode } from './encoding.js'
import parseCue from './parseCue.js'
const isCueLine = /-->/
// NOTE / STYLE / REGION blocks are not cues - ignore them through to the next blank line
const isBlockStart = /^(NOTE\b|STYLE\s*$|REGION\s*$)/

// Parse VTT content into a structured array of subtitle entries
const parseVTT = function (vttContent) {
  // Split content into lines
  const lines = vttContent.trim().split('\n')

  // allow constructing an empty document
  if (lines.length === 1 && lines[0] === '') {
    return { cues: [], hasHours: false }
  }

  // Check if it's a valid WebVTT file
  if (!lines[0].includes('WEBVTT')) {
    // the most-common mistake - feeding-in an SRT file directly
    if (lines.some((line) => isCueLine.test(line))) {
      throw new Error(
        'Invalid WebVTT format - missing WEBVTT header. If this is an SRT file, convert it first:  ffmpeg -i file.srt file.vtt'
      )
    }
    throw new Error('Invalid WebVTT format')
  }

  const cues = []
  let current = null
  let label = null
  // does the file write timestamps in canonical (hh:mm:ss) or compact (mm:ss) form?
  let hasHours = false
  // the header block (Kind: captions, X-TIMESTAMP-MAP=.. etc) runs until the first blank line
  let skipping = true

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    // empty line means cue is done - and ends any header/NOTE/STYLE block
    if (!line) {
      if (current) {
        cues.push(current)
      }
      current = null
      label = null
      skipping = false
      continue
    }

    // a cue line has a --> separator
    if (isCueLine.test(line)) {
      // some files skip the blank line between cues
      if (current) {
        cues.push(current)
      }
      skipping = false
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
      continue
    }
    if (isBlockStart.test(line)) {
      skipping = true
      label = null
      continue
    }
    if (skipping) {
      continue
    }
    // a cue identifier is a single line, directly before the timestamp line
    if (label !== null) {
      // two loose lines in a row - not an identifier, so ignore the whole block
      skipping = true
      label = null
      continue
    }
    label = line
  }

  // Don't forget the last entry
  if (current) {
    cues.push(current)
  }

  return { cues, hasHours }
}
export default parseVTT
