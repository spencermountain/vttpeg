import vttpeg from '../src/index.js'
import yargs from 'yargs'
import fs from 'fs'
import path from 'path'
import pkg from '../package.json'

import { hideBin } from 'yargs/helpers'
import getFiles from './getFiles.js'
let options = {
  lint: false,
  rewrite: false,
  shift: 0,
  append: '_new'
}

let cli = yargs(hideBin(process.argv.slice(2)))
  .option('lint', {
    type: 'boolean',
    description: 'lint the file',
    default: options.lint
  })
  .option('shift', {
    type: 'number',
    description: 'shift the timestamps forward or backward',
    default: options.shift
  })
  .option('rewrite', {
    type: 'boolean',
    description: 'rewrite the file',
    default: options.rewrite
  })
  .option('append', {
    type: 'string',
    description: 'append to the file',
    default: options.append
  })
  .option('version', {
    type: 'boolean',
    description: 'print the version',
    default: false
  })
  .option('help', {
    type: 'boolean',
    description: 'print the help',
    default: false
  })
  .parse(process.argv.slice(2))

if (cli.version) {
  console.log(pkg.version)
  process.exit(0)
}

if (cli.help) {
  console.log(`
  Usage: vttpeg <file> [options]
  
  Options:
    --lint      lint the file
    --shift     shift the timestamps forward or backward
    --rewrite   rewrite the file
    --append    append to the file
  `)
  process.exit(0)
}

let input = cli._[0]
let files = getFiles(input)
console.log(files)


for (let i = 0; i < files.length; i += 1) {
  let txt = fs.readFileSync(files[i], 'utf8')
  let vtt = vttpeg(txt)
  if (options.lint) {
    vtt.lint()
  }
  if (options.shift) {
    vtt.shift(options.shift)
  }
  let output = vtt.toVtt()

}