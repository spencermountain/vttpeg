import vttpeg from '../src/index.js'
import yargs from 'yargs'
import fs from 'fs'
import path from 'path'
import pkg from '../package.json' with { type: 'json' }

import { hideBin } from 'yargs/helpers'
import getFiles from './getFiles.js'
let options = {
  lint: false,
  overwrite: false,
  shift: 0,
  append: '.new',
  validate: false,
  strip: false,
}

let cli = yargs(hideBin(process.argv.slice(2)))
  .option('lint', {
    type: 'boolean',
    description: 'lint the file',
    default: options.lint
  })
  .option('validate', {
    type: 'boolean',
    description: 'validate the file',
    default: options.validate
  })
  .option('shift', {
    type: 'number',
    description: 'shift the timestamps forward or backward',
    default: options.shift
  })
  .option('overwrite', {
    type: 'boolean',
    description: 'overwrite the file',
    default: options.overwrite
  })
  .option('append', {
    type: 'string',
    description: 'append to the file',
    default: options.append
  })
  .option('strip', {
    type: 'string',
    description: 'cleanup xml tags from the file',
    default: options.strip
  }).version(pkg.version)
  .option('help', {
    type: 'boolean',
    description: 'print the help',
    default: false
  })
  .parse(process.argv.slice(2))
console.log(cli)

if (cli.version) {
  console.log(pkg.version)
  process.exit(0)
}

if (cli.help) {
  console.log(`
  Usage: vttpeg <file> [options]
  
  Options:
    --lint      lint the file
    --validate  validate the file
    --shift     shift the timestamps forward or backward
    --overwrite   overwrite the file
    --append    append to the file
    --strip     cleanup xml tags from the file
  `)
  process.exit(0)
}

let input = cli._[0]
let files = getFiles(input)
console.log(`\n\nProcessing ${files.length} vtt files...\n\n`)

for (let i = 0; i < files.length; i += 1) {
  let txt = fs.readFileSync(files[i], 'utf8')
  let vtt = vttpeg(txt)
  if (cli.lint) {
    let lint = vtt.lint()
    if (lint.length > 0) {
      console.log(`Lint errors: ${files[i]}`)
      console.log(lint)
    }
  }
  if (cli.shift) {
    vtt.shift(cli.shift)
  }
  if (cli.strip) {
    vtt.stripXml()
  }
  if (cli.validate) {
    if (!vtt.isValid()) {
      console.log(`Invalid file: ${files[i]}`)
      // process.exit(1)
    } else {
      console.log(`Valid file: ${files[i]}`)
    }
  }

  // should we write a new file?
  if (cli.overwrite || cli.shift || cli.strip) {
    let filename = path.basename(files[i])
    let newFilename = `${filename.split('.')[0]}${cli.append || ''}.vtt`
    if (cli.overwrite) {
      newFilename = filename
    }
    // set it in the same directory as the original file
    newFilename = path.join(path.dirname(files[i]), newFilename)
    let output = vtt.out()
    fs.writeFileSync(newFilename, output)
    console.log(`Written to: ${newFilename}`)
  }
}