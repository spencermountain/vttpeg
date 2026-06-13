const defaultOpts = {
  minGap: 2
}

// split cues into scenes wherever a silent gap exceeds the threshold
const findGaps = (cues, options = {}) => {
  let opts = { ...defaultOpts, ...options }
  const scenes = []
  let current = []

  for (let i = 0; i < cues.length; i++) {
    current.push(cues[i])
    const nextCue = cues[i + 1]
    if (nextCue) {
      const gapDuration = nextCue.startTime - cues[i].endTime
      // a big enough gap ends the current scene
      if (gapDuration >= opts.minGap) {
        scenes.push(current)
        current = []
      }
    }
  }
  // don't forget the final scene
  if (current.length > 0) {
    scenes.push(current)
  }
  return scenes
}

export default findGaps
