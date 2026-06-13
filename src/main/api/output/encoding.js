//https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API/Web_Video_Text_Tracks_Format#cue_payload

// WebVTT cue text only requires escaping these three characters -
// quotes and apostrophes are intentionally left as-is
const encode = function (txt) {
  return txt
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export default encode
