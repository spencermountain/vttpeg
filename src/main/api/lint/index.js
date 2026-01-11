const defaultOpts = {
  silent: false,
  maxLength: 100,
  allowOverlap: false
}

// find suspicious entries in the vtt file
const lint = (cues, opts = {}) => {
  opts = { ...defaultOpts, ...opts }

  let errors = []
  if (cues.length === 0) {
    errors.push(`No cues found`)
  }
  for (let i = 0; i < cues.length; i += 1) {
    let cue = cues[i]
    if (typeof cue.startTime != 'number' || cue.startTime < 0) {
      errors.push(`Invalid start time for entry ${i}`)
    }
    if (typeof cue.endTime != 'number' || cue.endTime < 0) {
      errors.push(`Invalid end time for entry ${i}`)
    }
    if (!opts.allowOverlap && cue.startTime >= cue.endTime) {
      errors.push(`StartTime is greater than EndTime for entry ${i}`)
    }
    if (cue.text.length === 0) {
      errors.push(`Text is empty for entry ${i}`)
    }
    if (cue.text.length > opts.maxLength) {
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
