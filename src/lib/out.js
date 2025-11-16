// produce a valid vtt file
const out = (entries) => {
  let txt = 'WEBVTT\n\n';
  for (let i = 0; i < entries.length; i++) {
    let entry = entries[i]
    txt += `${entry.startTime} --> ${entry.endTime}\n`
    txt += `${entry.text.join('\n')}\n\n`
  }
  return txt
}
export default out;