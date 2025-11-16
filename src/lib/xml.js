const stripXml = function (txt) {
  return txt.replace(/<[^>]*>/g, '')
}

const stripVoice = function (txt) {
  txt = txt.replace(/<v[^>]*>/g, '')
  txt = txt.replace(/<\/v>/g, '')
  return txt
}
const stripLang = function (txt) {
  txt = txt.replace(/<lang[^>]*>/g, '')
  txt = txt.replace(/<\/lang>/g, '')
  return txt
}


export { stripXml, stripVoice, stripLang }

// let txt = '<lang en-GB>Cyan!</lang>'
// console.log(stripXml(txt))
// txt = 'I like <v Salame>lime.</v>'
// console.log(stripVoice(txt))
// txt = '<lang en-GB>Cyan!</lang>'
// console.log(stripLang(txt))