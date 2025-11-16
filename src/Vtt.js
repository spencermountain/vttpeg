import parse from './parse/index.js'
import findGaps from './lib/scenes.js'
import getStats from './lib/stats.js'
import shift from './lib/shift.js'
import lint from './lib/lint.js'
import isValid from './lib/isValid.js'
import out from './lib/out.js'
import { stripXml, stripVoice, stripLang } from './lib/xml.js'

class Vtt {
  constructor(txt = '') {
    this.entries = parse(txt)
  }
  json() {
    return this.entries
  }
  text() {
    return this.entries.map(entry => entry.text.join('\n')).join('\n')
  }
  plainText() {
    return this.entries.map(entry => {
      return entry.text.map(txt => stripXml(txt)).join('\n')
    }).join('\n')
  }
  out() {
    return out(this.entries)
  }
  debug() {
    console.log('--------------------------------')
    console.log(this.entries)
    console.log(this.stats())
    console.log('--------------------------------')
  }

  // run analyses on the vtt file
  stats() {
    let stats = getStats(this.entries)
    let words = this.text().split(' ').length
    stats.wordCount = words
    stats.wordsPerMinute = parseInt(words / stats.duration * 60, 10)
    return stats
  }
  lint(opts = {}) {
    return lint(this.entries, opts)
  }
  isValid(opts = {}) {
    return isValid(this.entries, opts)
  }

  // remove xml attributes
  stripXml() {
    this.entries = this.entries.map(entry => {
      entry.text = entry.text.map(txt => stripXml(txt))
      return entry
    })
    return this
  }
  stripVoice() {
    this.entries = this.entries.map(entry => {
      entry.text = entry.text.map(txt => stripVoice(txt))
      return entry
    })
    return this
  }
  stripLang() {
    this.entries = this.entries.map(entry => {
      entry.text = entry.text.map(txt => stripLang(txt))
      return entry
    })
    return this
  }
  stripStyle() {
    return this.entries.map(entry => {
      delete entry.attributes
      return entry
    })
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
  sceneSplit(minGap = 2) {
    return findGaps(this.entries, minGap)
  }
  firstCue() {
    return this.entries[0]
  }
  lastCue() {
    return this.entries[this.entries.length - 1]
  }
  duration() {
    return this.lastCue().endTime - this.firstCue().startTime
  }

}

export default Vtt
