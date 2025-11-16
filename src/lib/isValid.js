
const isValid = (entries, opts = {}) => {
  opts.silent = opts.silent || false
  let errors = []
  if (!entries || entries.length === 0) {
    errors.push('No entries found')
  }
  for (let i = 0; i < entries.length; i += 1) {
    let entry = entries[i]
    if (typeof entry.startTime != 'number' || entry.startTime < 0) {
      errors.push(`Invalid start time for entry ${i}`)
    }
    if (typeof entry.endTime != 'number' || entry.endTime < 0) {
      errors.push(`Invalid end time for entry ${i}`)
    }
    if (entry.startTime >= entry.endTime) {
      errors.push(`Start time is greater than end time for entry ${i}`)
    }
  }
  if (errors.length > 0) {
    if (!opts.silent) {
      console.log('\n\n--------------------------------')
      console.log(`Validation errors: `)
      console.log(errors)
      console.log('--------------------------------\n\n')
    }
    return false
  }
  return true
}

export default isValid