import vttpeg from './index.js'
import fs from 'node:fs'

vttpeg.fromFile = function (file) {
  return vttpeg(fs.readFileSync(file, 'utf8'))
}
vttpeg.toFile = function (file) {
  fs.writeFileSync(file, vttpeg.out())
}
export default vttpeg