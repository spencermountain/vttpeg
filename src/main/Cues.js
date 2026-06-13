import lint from './api/lint/index.js'
import normalize from './api/normalize/index.js'
import { toText, toVtt, debug } from './api/output/index.js'
import shift from './api/shift/index.js'
import { minDuration, maxDuration } from './api/duration/index.js'
import stats from './api/output/stats.js'
import getDialogue from './api/dialogue/index.js'

class Cues {
  constructor(cues) {
    this.cues = cues
  }
  // warnings about possible vtt problems
  lint(opts = {}) {
    return lint(this.cues, opts)
  }
  dialogue() {
    let dialogue = getDialogue(this.cues)
    return new Cues(dialogue)
  }
  isValid() {
    let errors = lint(this.cues, { silent: true })
    return errors.length === 0
  }
  // changes to modify cues
  normalize(opts = {}) {
    this.cues = normalize(this.cues, opts)
    return this
  }
  stats() {
    return stats(this.cues)
  }
  duration() {
    return stats(this.cues).duration_seconds
  }
  shift(time) {
    this.cues = shift(this.cues, time)
    return this
  }
  // slow down cues that flash by too quickly
  minDuration(seconds) {
    this.cues = minDuration(this.cues, seconds)
    return this
  }
  // speed up cues that hang around too long
  maxDuration(seconds) {
    this.cues = maxDuration(this.cues, seconds)
    return this
  }
  // readable plaintext
  text() {
    return toText(this.cues)
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
