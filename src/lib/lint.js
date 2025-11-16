// find suspicious entries in the vtt file
const lint = (entries, opts = {}) => {
  opts.silent = opts.silent || false
  let errors = []
  for (let i = 0; i < entries.length; i += 1) {
    let entry = entries[i]
    if (entry.startTime >= entry.endTime) {
      errors.push(`StartTime is greater than EndTime for entry ${i}`)
    }
    if (entry.text.length === 0) {
      errors.push(`Text is empty for entry ${i}`)
    }
    if (entry.text.length > 100) {
      errors.push(`Text is too long for entry ${i}`)
    }

  }
  if (errors.length > 0) {
    if (!opts.silent) {
      console.log(`Lint errors: `)
      console.log(errors)
    }
  } else {
    if (!opts.silent) {
      console.log('No lint errors found')
    }
  }
  return errors
}
export default lint