import lint from './api/lint/index.js'
import normalize from './api/normalize/index.js'
import { toText, toVtt, debug } from './api/output/index.js'

class Cues {
  constructor(cues) {
    this.cues = cues
  }
  // warnings about possible vtt problems
  lint(opts = {}) {
    lint(this.cues, opts)
    return this
  }
  // changes to modify cues
  normalize(opts = {}) {
    this.cues = normalize(this.cues, opts)
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
}

export default Cues
