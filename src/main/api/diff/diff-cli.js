const green = (str) => '\x1b[32m' + str + '\x1b[0m'
const red = (str) => '\x1b[31m' + str + '\x1b[0m'
const yellow = (str) => '\x1b[33m' + str + '\x1b[0m'
const dim = (str) => '\x1b[2m' + str + '\x1b[0m'

const context_size = 40

const default_options = {
  context_size: context_size
}

const printDiffCli = function (diffs, input, options = {}) {
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

  changes.forEach((change, i) => {
    let { op, text, pos } = change
    console.log(yellow('\n\n- #' + (i + 1) + ' ------'))
    const start = Math.max(0, pos - opts.context_size)
    const before = input.slice(start, pos)
    const after = input.slice(
      change.pos + (change.op === -1 ? change.text.length : 0),
      change.pos + opts.context_size
    )
    process.stdout.write(dim(before))
    if (op === -1) {
      process.stdout.write(red('-' + text))
    } else if (op === 1) {
      process.stdout.write(green('+' + text))
    } else {
      process.stdout.write(yellow(' ' + text))
    }
    process.stdout.write(dim(after))
  })
  console.log('\n')
}
export default printDiffCli
