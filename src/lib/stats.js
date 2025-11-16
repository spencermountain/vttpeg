const getStats = (entries) => {
  let text = entries.map(entry => entry.text.join('\n')).join('\n')
  let words = text.split(' ').length
  let duration = entries.reduce((acc, entry) => acc + entry.endTime - entry.startTime, 0)

  return {
    duration: duration,
    entries: entries.length,
    wordCount: words,
    wordsPerMinute: (words / duration * 60),
  }
}

export default getStats