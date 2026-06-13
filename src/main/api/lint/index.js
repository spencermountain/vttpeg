const defaultOpts = {
  silent: false,
  verbose: false,
  maxLength: 100,
  allowOverlap: false,
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
    let hasError = false
    if (typeof cue.startTime != 'number' || cue.startTime < 0) {
      errors.push(`Invalid start time for entry ${i}`)
      hasError = true
    }
    if (typeof cue.endTime != 'number' || cue.endTime < 0) {
      errors.push(`Invalid end time for entry ${i}`)
      hasError = true
    }
    if (!opts.allowOverlap && cue.startTime >= cue.endTime) {
      errors.push(`StartTime is greater than EndTime for entry ${i}`)
      hasError = true
    }
    if (cue.text.length === 0) {
      errors.push(`Text is empty for entry ${i}`)
      hasError = true
    }
    // flag any single line longer than maxLength characters
    let longestLine = cue.text.reduce((max, line) => Math.max(max, line.length), 0)
    if (longestLine > opts.maxLength) {
      errors.push(`Text is too long for entry ${i}`)
      hasError = true
    }
    // check for overlapping cues
    let nextCue = cues[i + 1]
    if (nextCue && cue.endTime > nextCue.startTime) {
      errors.push(`Overlapping cues for entry ${i}`)
      hasError = true
    }
    if (opts.verbose && hasError) {
      console.warn(`Error for entry ${i}: ${cue.text}`)
      console.warn(cue)
      console.warn('--------------------------------')
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
