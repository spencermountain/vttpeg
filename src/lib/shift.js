const shift = (entries, seconds) => {
  return entries.map(entry => {
    entry.startTime += seconds
    entry.endTime += seconds
    return entry
  })
}

export default shift