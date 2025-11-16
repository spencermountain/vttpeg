import vttpeg from './index.js'

vttpeg.fromElement = function (el) {
  let vttFile = el.querySelector('track')
  if (!vttFile) {
    throw new Error('No vtt file found')
  }
  console.log(vttFile)
  return vttpeg(vttFile.textContent)
}

export default vttpeg