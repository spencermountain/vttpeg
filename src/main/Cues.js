import lint from './api/lint/index.js'
import normalize from './api/normalize/index.js'
import { toText, toVtt, debug } from './api/output/index.js'

class Cues {
  constructor(cues) {
    this.cues = cues
  }
  // warnings about possible vtt problems
  lint(opts = {}) {
    return lint(this.cues, opts)
  }
  // changes to modify cues
  normalize(opts = {}) {
    return normalize(this.cues, opts)
  }

  // readable plaintext
  text() {
    return toText(this.cues)
  }
  // produce a new vtt file
  out(opts = {}) {
    return toVtt(this.cues)
  }
  debug() {
    debug(this.cues)
  }
}

export default Cues
