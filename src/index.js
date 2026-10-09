import Vtt from './main/Vtt.js'
import version from './_version.js'

// factory
const vttpeg = function (txt = '') {
  return new Vtt(txt)
}

vttpeg.version = version

export default vttpeg
