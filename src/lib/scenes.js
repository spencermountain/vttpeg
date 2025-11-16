// find gaps in the entries, which are possibly scene-changes
const findGaps = (cues, minGap = 2) => {
  const scenes = [];
  let current = []

  for (let i = 0; i < cues.length - 1; i++) {
    const nextCue = cues[i + 1];
    if (!nextCue) {
      current.push(cues[i])
      continue
    }
    const gapDuration = nextCue.startTime - cues[i].endTime;

    // If gap exceeds our threshold, consider it a scene change
    if (gapDuration >= minGap && current.length > 1) {
      scenes.push(current);
      current = []
      continue
    }
    current.push(cues[i])
  }
  // dont forget the last cue
  if (current.length > 0) {
    scenes.push(current);
  }
  return scenes;
}

export default findGaps