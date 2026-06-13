// remove xml attributes
const stripXml = function (cues = []) {
  return cues.map((entry) => {
    entry.text = entry.text.map((txt) => {
      return txt.replace(/<[^>]*>/g, '')
    })
    return entry
  })
}

const stripVoice = function (cues = []) {
  return cues.map((entry) => {
    entry.text = entry.text.map((txt) => {
      return txt.replace(/<[^>]*>/g, '')
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

const stripMusic = function (cues = []) {
  return cues.map((entry) => {
    entry.text = entry.text.filter((txt) => {
      let line = txt.trim()
      // music-note lines:  ♪ ... ♪
      if (/^[-\s]*♪/.test(line)) {
        return false
      }
      // whole-line sound descriptions:  [LAUGHING]  (CLEARING THROAT)
      if (/^[-\s]*[[(].*[\])]\s*$/.test(line)) {
        return false
      }
      return true
    })
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

// remove JSON metadata blocks from text
const stripMetadata = function (cues = []) {
  return cues.map((entry) => {
    entry.text = entry.text.filter((txt) => {
      return !txt.match(/^[- ]*{/i)
    })
    return entry
  })
}

export { stripXml, stripVoice, stripLang, stripStyle, stripMusic, stripWhitespace, stripNotes, stripMetadata }
