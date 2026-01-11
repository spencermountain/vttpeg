const getStats = (cues) => {
  let duration = cues.reduce((acc, entry) => acc + entry.endTime - entry.startTime, 0)

  let shortestCue = cues.reduce(
    (acc, entry) => (acc < entry.endTime - entry.startTime ? acc : entry.endTime - entry.startTime),
    cues[0].endTime - cues[0].startTime
  )
  let longestCue = cues.reduce(
    (acc, entry) => (acc > entry.endTime - entry.startTime ? acc : entry.endTime - entry.startTime),
    cues[0].endTime - cues[0].startTime
  )
  let averageCue = duration / cues.length

  return {
    duration: duration,
    cues: cues.length,
    shortestCue: shortestCue,
    longestCue: longestCue,
    averageCue: averageCue
  }
}

export default getStats
