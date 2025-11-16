// find gaps in the entries, which are possibly scene-changes
const findGaps = (entries, options = {}) => {
  // Default options
  const minGapSeconds = options.minGapSeconds || 5;
  const minSceneDuration = options.minSceneDuration || 30;


  if (entries.length === 0) {
    return [];
  }

  // Initialize scene changes array
  const gaps = [];

  // Find gaps between subtitle entries that exceed our threshold
  for (let i = 0; i < entries.length - 1; i++) {
    const currentEntry = entries[i];
    const nextEntry = entries[i + 1];

    // Calculate gap between end of current subtitle and start of next
    const gapDuration = nextEntry.startTime - currentEntry.endTime;

    // If gap exceeds our threshold, consider it a scene change
    if (gapDuration >= minGapSeconds) {
      // Use the midpoint of the gap as the scene change timestamp
      const midpoint = currentEntry.endTime + (gapDuration / 2);

      // Only add if it's far enough from the last scene change
      if (gaps.length === 0 ||
        (midpoint - gaps[gaps.length - 1]) >= minSceneDuration) {
        gaps.push({
          startTime: currentEntry.endTime,
          midpoint: midpoint,
          endTime: nextEntry.startTime,
          duration: gapDuration,
        });
      }
    }
  }

  return gaps;
}

export default findGaps