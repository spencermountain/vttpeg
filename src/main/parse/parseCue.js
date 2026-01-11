import parseTimestamp from './timestamp.js'

const parseCue = function (line) {
  let [before, after] = line.split('-->');
  let startTime = parseTimestamp(before.trim());

  let endParts = after.trim().split(/^([0-9:.]+)(.*)/);
  let endTime = parseTimestamp(endParts[1]);
  let out = {
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