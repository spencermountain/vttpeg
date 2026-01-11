//https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API/Web_Video_Text_Tracks_Format#cue_payload

const decode = function (txt) {
  return txt
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lrm;/g, '')
    .replace(/&rlm;/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&copy;/g, '©')
    .replace(/&reg;/g, '®')
    .replace(/&trade;/g, '™')
    .replace(/&asymp;/g, '≈')
    .replace(/&ne;/g, '≠')
    .replace(/&pound;/g, '£')
    .replace(/&euro;/g, '€')
    .replace(/&deg;/g, '°')
}
export { decode }
