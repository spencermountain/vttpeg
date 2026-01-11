import Vtt from '../main/Vtt.js'
import printDiff from '../main/api/diff/diff-html.js'

Vtt.prototype.diff = function () {
  let diffs = this._diff()
  return printDiff(diffs, this.input)
}

// factory
const vttpeg = function (txt = '') {
  return new Vtt(txt)
}

export default vttpeg
