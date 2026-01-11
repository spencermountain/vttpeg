const green = (str) => ' <span style="color:green">' + str + '</span> '
const red = (str) => ' <span style="color:red">' + str + '</span> '
const yellow = (str) => ' <span style="color:yellow">' + str + '</span> '
const dim = (str) => ' <span style="color:gray">' + str + '\n</span> '

const context_size = 40

const default_options = {
  context_size: context_size
}

const diffHtml = function (diffs, input, options = {}) {
  const opts = Object.assign({}, default_options, options)
  const changes = []
  let pos = 0

  for (const [op, text] of diffs) {
    if (op !== 0) {
      changes.push({ op, text, pos })
    }
    if (op !== 1) {
      pos += text.length
    }
  }

  let html = ''
  changes.forEach((change, i) => {
    let { op, text, pos } = change
    html += '<div> #' + (i + 1) + ' </div>\n\n'
    const start = Math.max(0, pos - opts.context_size)
    const before = input.slice(start, pos)
    const after = input.slice(
      change.pos + (change.op === -1 ? change.text.length : 0),
      change.pos + opts.context_size
    )
    html += dim(before) + '\n'
    if (op === -1) {
      html += red('-' + text) + '\n'
    } else if (op === 1) {
      html += green('+' + text) + '\n'
    } else {
      html += yellow(' ' + text) + '\n'
    }
    html += dim(after) + '\n'
  })
  return '<div>\n' + html + '\n</div>'
}
export default diffHtml
