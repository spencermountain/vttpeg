import parseVTT from './parse.js'
import findGaps from './lib/gaps.js'
import getStats from './lib/stats.js'
import shift from './lib/shift.js'
import lint from './lib/lint.js'

class Vtt {
  constructor(str) {
    this.entries = parseVTT(str)
  }
  json() {
    return this.entries
  }
  text() {
    return this.entries.map(entry => entry.text).join('\n')
  }
  stats() {
    return getStats(this.entries)
  }
  lint(opts = {}) {
    return lint(this.entries, opts)
  }
  printVtt() {
    return this.entries.map(entry => entry.text).join('\n')
  }
  debug() {
    console.log('--------------------------------')
    console.log(this.entries)
    console.log(this.stats())
    console.log('--------------------------------')
  }


  // move timestamps forward or backward
  shift(seconds) {
    return shift(this.entries, seconds)
  }
  shiftLeft(seconds) {
    return shift(this.entries, -seconds)
  }
  shiftRight(seconds) {
    return shift(this.entries, seconds)
  }
  sort() {
    return this.entries.sort((a, b) => a.startTime - b.startTime)
  }

  // detect silences
  gaps() {
    return findGaps(this.entries)
  }
  firstEntry() {
    return this.entries[0]
  }
  lastEntry() {
    return this.entries[this.entries.length - 1]
  }
  duration() {
    return this.lastEntry().endTime - this.firstEntry().startTime
  }

}

export default Vtt
