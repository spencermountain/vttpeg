const isValid = (entries, opts = {}) => {
  opts.silent = opts.silent || false
  let errors = []
  if (!entries || entries.length === 0) {
    errors.push('No entries found')
  }
  for (let i = 0; i < entries.length; i += 1) {
    let entry = entries[i]
    if (!entry.startTime || !entry.endTime) {
      errors.push(`Invalid start or end time for entry ${i}`)
    }
    if (entry.startTime >= entry.endTime) {
      errors.push(`Start time is greater than end time for entry ${i}`)
    }
  }
  if (errors.length > 0) {
    if (!opts.silent) {
      console.log(`Validation errors: `)
      console.log(errors)
    }
    return false
  }
  return true
}

export default isValid