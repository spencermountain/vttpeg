import { stripXml, stripVoice, stripLang, stripStyle, stripMusic, stripWhitespace, stripNotes, stripMetadata } from './libs.js'
import { fixOverlaps, stripUndisplayed } from './overlaps.js'

const defaultOpts = {
  stripXml: true,
  stripVoice: true,
  stripLang: true,
  stripStyle: true,
  stripMusic: true,
  stripWhitespace: true,
  stripNotes: true,
  stripMetadata: true,
  stripUndisplayed: true,
  fixOverlaps: true,
}

const normalize = (cues, opts = {}) => {
  const options = { ...defaultOpts, ...opts }
  if (options.stripXml) {
    cues = stripXml(cues)
  }
  if (options.stripLang) {
    cues = stripLang(cues)
  }
  if (options.stripStyle) {
    cues = stripStyle(cues)
  }
  if (options.stripMusic) {
    cues = stripMusic(cues)
  }
  if (options.stripVoice) {
    cues = stripVoice(cues)
  }
  if (options.stripWhitespace) {
    cues = stripWhitespace(cues)
  }
  if (options.stripNotes) {
    cues = stripNotes(cues)
  }
  if (options.stripMetadata) {
    cues = stripMetadata(cues)
  }
  if (options.fixOverlaps) {
    cues = fixOverlaps(cues)
  }
  if (options.stripUndisplayed) {
    cues = stripUndisplayed(cues)
  }
  // remove empty entries
  cues = cues.filter((entry) => {
    return entry.text.length > 0
  })
  return cues
}

export default normalize
