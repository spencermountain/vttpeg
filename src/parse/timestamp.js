// Check for timestamp line (00:00:00.000 --> 00:00:00.000) or 21:12.013

// Parse a timestamp string (HH:MM:SS.mmm) into seconds
function parseTimestamp(timestamp) {
  let hours = 0
  let minutes = 0
  let seconds = 0
  let milliseconds = 0

  let [before, after] = timestamp.split('.')

  let parts = before.split(':')
  seconds = parseInt(parts.pop() || '0', 10)
  minutes = parseInt(parts.pop() || '0', 10)
  hours = parseInt(parts.pop() || '0', 10)
  milliseconds = parseInt(after || '0', 10)

  return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000
}

// console.log(parseTimestamp('00:01:01.123'))
// console.log(parseTimestamp('01:01.123'))
// console.log(parseTimestamp('01.123'))
export default parseTimestamp