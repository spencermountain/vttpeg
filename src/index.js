import Vtt from './Vtt.js'

// factory
const vttpeg = function (txt = '') {
  return new Vtt(txt)
}

export default vttpeg