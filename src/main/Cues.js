import lint from './api/lint/index.js'
import normalize from './api/normalize/index.js'
import { toText, toVtt, debug } from './api/output/index.js'
import shift from './api/shift/index.js'

class Cues {
  constructor(cues) {
    this.cues = cues
  }
  // warnings about possible vtt problems
  lint(opts = {}) {
    return lint(this.cues, opts)
  }
  isValid() {
    let errors = lint(this.cues, { silent: true })
    if (errors.length > 0) {
      console.warn('VTT is invalid: ', errors)
    }
    return errors.length === 0
  }
  // changes to modify cues
  normalize(opts = {}) {
    this.cues = normalize(this.cues, opts)
    return this
  }
  shift(time) {
    this.cues = shift(this.cues, time)
    return this
  }
  // readable plaintext
  text(opts = {}) {
    return toText(this.cues, opts)
  }
  // produce a new vtt file
  out(opts = {}) {
    return toVtt(this.cues, opts)
  }
  debug() {
    debug(this.cues)
    return this
  }
  json() {
    return this.cues
  }
}

export default Cues
