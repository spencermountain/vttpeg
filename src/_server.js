import vttpeg from './index.js'
import fs from 'node:fs'

vttpeg.fromFile = function (file) {
  let txt = fs.readFileSync(file, 'utf8')
  return vttpeg(txt)
}
vttpeg.toFile = function (file) {
  fs.writeFileSync(file, vttpeg.out())
}
export default vttpeg