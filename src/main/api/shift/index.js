const shift = (entries, seconds) => {
  return entries.map(entry => {
    // clamp at zero - cues cannot begin before the video does
    entry.startTime = Math.max(0, entry.startTime + seconds)
    entry.endTime = Math.max(0, entry.endTime + seconds)
    return entry
  })
}

export default shift
