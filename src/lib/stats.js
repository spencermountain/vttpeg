const getStats = (entries) => {
  let duration = entries.reduce((acc, entry) => acc + entry.endTime - entry.startTime, 0)

  let shortestCue = entries.reduce((acc, entry) => acc < entry.endTime - entry.startTime ? acc : entry.endTime - entry.startTime, entries[0].endTime - entries[0].startTime)
  let longestCue = entries.reduce((acc, entry) => acc > entry.endTime - entry.startTime ? acc : entry.endTime - entry.startTime, entries[0].endTime - entries[0].startTime)
  let averageCue = duration / entries.length

  return {
    duration: duration,
    cues: entries.length,
    shortestCue: shortestCue,
    longestCue: longestCue,
    averageCue: averageCue,
  }
}

export default getStats