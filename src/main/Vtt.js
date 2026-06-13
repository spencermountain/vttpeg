import parse from './parse/index.js'
import Cues from './Cues.js'
import { diffHtml, diffCli } from 'same-diff'
import splitScenes from './api/scenes/index.js'

class Vtt {
  constructor(txt = '') {
    this.input = txt
    let { cues, hasHours } = parse(txt)
    this.cues = new Cues(cues, hasHours)
  }
  // warnings about possible vtt problems
  lint(opts = {}) {
    return this.cues.lint(opts)
  }
  dialogue() {
    return this.cues.dialogue()
  }
  // changes to modify cues
  normalize(opts = {}) {
    this.cues = this.cues.normalize(opts)
    return this
  }
  stats() {
    return this.cues.stats()
  }
  duration() {
    return this.cues.duration()
  }
  // readable plaintext
  text() {
    return this.cues.text()
  }
  // produce a new vtt file
  out(opts = {}) {
    return this.cues.out(opts)
  }
  json() {
    return this.cues.json()
  }
  isValid() {
    return this.cues.isValid()
  }
  // split into groups of cues
  scenes(opts = {}) {
    return splitScenes(this.cues.cues, opts).map((cues) => new Cues(cues, this.cues.showHours))
  }
  shift(time) {
    this.cues = this.cues.shift(time)
    return this
  }
  // ensure cues stay on screen long enough to read
  minDuration(seconds) {
    this.cues = this.cues.minDuration(seconds)
    return this
  }
  // ensure cues don't linger too long
  maxDuration(seconds) {
    this.cues = this.cues.maxDuration(seconds)
    return this
  }
  // compare former and current vtt content
  diffHtml() {
    let output = this.out()
    return diffHtml(this.input, output)
  }
  diffCli() {
    let output = this.out()
    return diffCli(this.input, output)
  }
}

export default Vtt
