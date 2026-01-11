import { stripXml, stripVoice, stripLang, stripStyle } from './libs.js'

const defaultOpts = {
  stripXml: true,
  stripVoice: true,
  stripLang: true,
  stripStyle: true
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
  if (options.stripVoice) {
    cues = stripVoice(cues)
  }
}

export default normalize
