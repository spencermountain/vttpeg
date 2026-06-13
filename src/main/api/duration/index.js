// extend short cues up to a minimum duration, growing into the gap
// before the next cue - but never overlapping it, and never shrinking
const minDuration = (cues, seconds) => {
  for (let i = 0; i < cues.length; i++) {
    let cue = cues[i]
    let target = cue.startTime + seconds
    // already long enough
    if (cue.endTime >= target) {
      continue
    }
    let nextCue = cues[i + 1]
    // how far we can grow - capped at the next cue's start
    let limit = nextCue ? Math.min(target, nextCue.startTime) : target
    // only extend if there's actually room
    if (limit > cue.endTime) {
      cue.endTime = limit
    }
  }
  return cues
}

// trim long cues down to a maximum duration (always safe - only shrinks)
const maxDuration = (cues, seconds) => {
  for (let i = 0; i < cues.length; i++) {
    let cue = cues[i]
    if (cue.endTime - cue.startTime > seconds) {
      cue.endTime = cue.startTime + seconds
    }
  }
  return cues
}

export { minDuration, maxDuration }
