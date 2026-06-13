const fixOverlaps = (cues) => {
  for (let i = 0; i < cues.length - 1; i++) {
    const cue = cues[i]
    const nextCue = cues[i + 1]
    if (cue.endTime > nextCue.startTime) {
      cue.endTime = nextCue.startTime - 0.001
    }
  }
  return cues
}
// cues start_time <= end_time
const stripUndisplayed = (cues) => {
  return cues.filter((entry) => {
    if (entry.startTime >= entry.endTime) {
      return false
    }
    if (entry.endTime < 0) {
      return false
    }
    return true
  })
}

export { fixOverlaps, stripUndisplayed }
