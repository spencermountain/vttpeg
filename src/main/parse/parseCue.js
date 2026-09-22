import parseTimestamp from './timestamp.js'

const parseCue = function (line) {
  const [before, after] = line.split('-->');
  const startTime = parseTimestamp(before.trim());

  // capture the timestamp (allowing SRT-style commas) and any trailing cue settings
  const endParts = after.trim().split(/^([0-9:.,]+)(.*)/);
  const endTime = parseTimestamp(endParts[1]);
  const out = {
    startTime,
    endTime,
    text: []
  }
  if (endParts[2]) {
    out.attributes = endParts[2].trim()
  }
  return out;
}
export default parseCue