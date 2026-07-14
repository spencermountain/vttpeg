const pad = (num) => {
  return num.toString().padStart(2, '0')
}
const toTime = (time) => {
  let hours = Math.floor(time / 3600)
  let minutes = Math.floor((time % 3600) / 60)
  let seconds = Math.floor(time % 60)
  // let milliseconds = Math.floor((time % 1) * 1000)
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`//.${pad(milliseconds)}`
}
// round decimal seconds to 2 decimal places
const roundMilliseconds = (time) => {
  return Math.round(time * 100) / 100
}

const getStats = (cues) => {
  // an empty file still has stats
  if (cues.length === 0) {
    return {
      cue_count: 0,
      duration_seconds: 0,
      duration: toTime(0),
      shortest_cue_seconds: 0,
      shortestCue: toTime(0),
      longest_cue_seconds: 0,
      longestCue: toTime(0),
      average_cue_seconds: 0,
      averageCue: toTime(0),
    }
  }
  let duration = cues.reduce((acc, entry) => acc + entry.endTime - entry.startTime, 0)
  duration = roundMilliseconds(duration)

  let shortestCue = cues.reduce(
    (acc, entry) => (acc < entry.endTime - entry.startTime ? acc : entry.endTime - entry.startTime),
    cues[0].endTime - cues[0].startTime
  )
  shortestCue = roundMilliseconds(shortestCue)

  let longestCue = cues.reduce(
    (acc, entry) => (acc > entry.endTime - entry.startTime ? acc : entry.endTime - entry.startTime),
    cues[0].endTime - cues[0].startTime
  )
  longestCue = roundMilliseconds(longestCue)

  let averageCue = duration / cues.length
  averageCue = roundMilliseconds(averageCue)

  return {
    cue_count: cues.length,
    duration_seconds: duration,
    duration: toTime(duration),
    shortest_cue_seconds: shortestCue,
    shortestCue: toTime(shortestCue),
    longest_cue_seconds: longestCue,
    longestCue: toTime(longestCue),
    average_cue_seconds: averageCue,
    averageCue: toTime(averageCue),
  }
}

export default getStats
