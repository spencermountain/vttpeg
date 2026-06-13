const getDialogue = (cues) => {
  return cues.filter((entry) => {
    return entry.text[0].match(/^[-"'] .{2}/i)
  })
}

export default getDialogue