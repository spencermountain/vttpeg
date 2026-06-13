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

const stripLang = function (cues = []) {
  return cues.map((entry) => {
    // entry.text = entry.text.map((txt) => stripLang(txt))
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
    // delete entry.attributes
    entry.text = entry.text.filter((txt) => {
      return !txt.match(/^[- ]*♪/i)
    })
    return entry
  })
}

const stripWhitespace = function (cues = []) {
  return cues.map((entry) => {
    entry.text = [entry.text.join(' ')]
    entry.text = entry.text.map((txt) => {
      return txt.replace(/^[ \t\n\r]+$/, '').trim()
    })
    return entry
  })
}

export { stripXml, stripVoice, stripLang, stripStyle, stripMusic, stripWhitespace }
