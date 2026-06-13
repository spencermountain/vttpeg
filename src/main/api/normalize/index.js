import { stripXml, stripVoice, stripLang, stripStyle, stripMusic } from './libs.js'

const defaultOpts = {
  stripXml: true,
  stripVoice: true,
  stripLang: true,
  stripStyle: true,
  stripMusic: true
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
  return cues
}

export default normalize
