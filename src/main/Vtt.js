import parse from './parse/index.js'
import Cues from './Cues.js'
import { diffHtml, diffCli } from 'same-diff'
import splitScenes from './api/scenes/index.js'

class Vtt {
  constructor(txt = '') {
    this.input = txt
    let json = parse(txt)
    this.cues = new Cues(json)
  }
  // warnings about possible vtt problems
  lint(opts = {}) {
    return this.cues.lint(opts)
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
    return splitScenes(this.cues, opts).map((cues) => new Cues(cues))
  }
  shift(time) {
    this.cues = this.cues.shift(time)
    return this
  }
  // compare former and current vtt content
  diffHtml(opts = {}) {
    let output = this.out()
    return diffHtml(this.input, output)
  }
  diffCli(opts = {}) {
    let output = this.out()
    return diffCli(this.input, output)
  }
}

export default Vtt
