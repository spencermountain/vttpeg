const getStats = (entries) => {
  let words = entries.reduce((acc, entry) => acc + entry.text.split(' ').length, 0)
  let duration = entries.reduce((acc, entry) => acc + entry.endTime - entry.startTime, 0)

  return {
    duration: duration.toFixed(2),
    entries: entries.length,
    wordCount: words,
    wordsPerMinute: (words / duration * 60).toFixed(2),
  }
}

export default getStats