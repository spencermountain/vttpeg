import { globSync, hasMagic } from 'glob'
import fs from 'fs'
import path from 'path'

const getFiles = (input) => {
  let files = []
  //if input is a glob, use globSync
  if (hasMagic(input)) {
    files = globSync(input)
  } else {
    // if input is a directory, get all files in the directory
    if (fs.statSync(input).isDirectory()) {
      files = fs.readdirSync(input)
      files = files.map(file => path.join(input, file))
    } else {
      files = [input]
    }
  }
  // remove empty strings
  files = files.filter(str => str)
  // remove files that are not vtt files
  files = files.filter(file => file.endsWith('.vtt'))
  // remove files that are not files
  files = files.filter(file => fs.statSync(file).isFile())
  // remove dotfiles
  files = files.filter(file => !file.startsWith('.'))
  // remove files that are not readable 
  // files = files.filter(file => fs.accessSync(file, fs.constants.R_OK))
  if (files.length === 0) {
    console.error(`No files found for input: ${input}`)
    process.exit(1)
  }
  return files
}
export default getFiles