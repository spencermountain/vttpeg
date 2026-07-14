//https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API/Web_Video_Text_Tracks_Format#cue_payload

// decode a numeric character reference, eg &#39; or &#x27;
const fromCharCode = (match, num, radix) => {
  let code = parseInt(num, radix)
  if (isNaN(code) || code < 0 || code > 0x10ffff) {
    return match
  }
  return String.fromCodePoint(code)
}

const decode = function (txt) {
  return txt
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
    .replace(/&#x([0-9a-f]+);/gi, (m, n) => fromCharCode(m, n, 16))
    .replace(/&#(\d+);/g, (m, n) => fromCharCode(m, n, 10))
    // last, so '&amp;lt;' decodes to '&lt;' - not all the way to '<'
    .replace(/&amp;/g, '&')
}
export { decode }
