// remove xml attributes
const stripXml = function (cues) {
  return cues.map((entry) => {
    entry.text = entry.text.map((txt) => stripXml(txt))
    return entry
  })
}

const stripVoice = function (cues) {
  return cues.map((entry) => {
    entry.text = entry.text.map((txt) => stripVoice(txt))
    return entry
  })
}

const stripLang = function (cues) {
  return cues.map((entry) => {
    entry.text = entry.text.map((txt) => stripLang(txt))
    return entry
  })
}

const stripStyle = function (cues) {
  return cues.map((entry) => {
    delete entry.attributes
    return entry
  })
}

export { stripXml, stripVoice, stripLang, stripStyle }
