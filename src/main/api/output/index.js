import toVtt from './toVtt.js'
import stats from './stats.js'

const toText = function (cues) {
  return cues.map((entry) => entry.text.join('\n')).join('\n')
}

const debug = function (cues) {
  console.log('--------------------------------')
  console.log(stats(cues))
  console.log('--------------------------------')
}

export { toText, toVtt, debug }
