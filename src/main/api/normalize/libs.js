// remove xml attributes
const stripXml = function (cues = []) {
  return cues.map((entry) => {
    entry.text = entry.text.map((txt) => {
      return txt.replace(/<[^>]*>/g, '')
    })
    return entry
  })
}

// remove voice tags only, eg <v Bob>hi there</v>
const stripVoice = function (cues = []) {
  return cues.map((entry) => {
    entry.text = entry.text.map((txt) => {
      return txt.replace(/<\/?v(?=[\s.>])[^>]*>/gi, '')
    })
    return entry
  })
}

// remove language spans, eg <lang en>...</lang>
const stripLang = function (cues = []) {
  return cues.map((entry) => {
    entry.text = entry.text.map((txt) => {
      return txt.replace(/<\/?lang[^>]*>/gi, '')
    })
    return entry
  })
}

const stripStyle = function (cues = []) {
  return cues.map((entry) => {
    delete entry.attributes
    return entry
  })
}

// drop music-note lines, eg  ♪ Don't stop believin' ♪
const stripMusic = function (cues = []) {
  return cues.map((entry) => {
    entry.text = entry.text.filter((txt) => {
      return !/^[-\s]*[♪♫♬]/.test(txt.trim())
    })
    return entry
  })
}

// drop whole-line sound-effect cues, eg  [LAUGHING]  (CLEARING THROAT)
// (only whole-line, so inline speaker labels like "[JOHN] Hi" survive)
const stripSfx = function (cues = []) {
  return cues.map((entry) => {
    entry.text = entry.text.filter((txt) => {
      return !/^[-\s]*[[(].*[\])]\s*$/.test(txt.trim())
    })
    return entry
  })
}

// strip a leading speaker label, keeping the dialogue, eg
//   "[JOHN] I'm leaving." -> "I'm leaving."   "(NARRATOR): Once" -> "Once"
// only fires when dialogue follows, so whole-line cues are left for stripSfx
const stripSpeakerLabels = function (cues = []) {
  return cues.map((entry) => {
    entry.text = entry.text.map((txt) => {
      return txt.replace(/^(\s*-?\s*)[[(][^\])]*[\])]\s*:?\s*(?=\S)/, '$1')
    })
    return entry
  })
}

// strip [..] / (..) sound cues from anywhere within a line, eg
//   "I'm fine. [SNIFFLES]" -> "I'm fine."   "Hey [BANG] watch out" -> "Hey watch out"
// aggressive - also catches legitimate parenthetical asides, so it's opt-in
const stripInlineSfx = function (cues = []) {
  return cues.map((entry) => {
    entry.text = entry.text
      .map((txt) => {
        return txt
          .replace(/[[(][^\])]*[\])]/g, ' ')
          .replace(/\s{2,}/g, ' ')
          .trim()
      })
      .filter((txt) => txt.length > 0)
    return entry
  })
}

// trim each line and drop blank ones, but keep meaningful line-breaks
// (e.g. two-speaker dialogue) intact
const stripWhitespace = function (cues = []) {
  return cues.map((entry) => {
    entry.text = entry.text
      .map((txt) => txt.replace(/[ \t\n\r]+/g, ' ').trim())
      .filter((txt) => txt.length > 0)
    return entry
  })
}

const stripNotes = function (cues = []) {
  return cues.map((entry) => {
    delete entry.label
    return entry
  })
}

// remove JSON metadata payloads from text
const stripMetadata = function (cues = []) {
  return cues.map((entry) => {
    // a metadata payload opens with '{' - drop the whole cue text
    if (/^[-\s]*{/.test(entry.text[0] || '')) {
      entry.text = []
    } else {
      // also drop any standalone one-line json
      entry.text = entry.text.filter((txt) => !/^[-\s]*{.*}\s*$/.test(txt))
    }
    return entry
  })
}

export { stripXml, stripVoice, stripLang, stripStyle, stripMusic, stripSfx, stripSpeakerLabels, stripInlineSfx, stripWhitespace, stripNotes, stripMetadata }
