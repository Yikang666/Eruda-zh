const handlebars = require('handlebars/runtime')

// https://github.com/helpers/handlebars-helper-repeat
handlebars.registerHelper('repeat', (count = 0, options) => {
  if (count < 1) return options.inverse(this)

  const step = 1
  const start = 0
  const max = count * step + start
  let index = start
  let str = ''

  do {
    const data = {
      index,
      count,
      start,
      step,
      first: index === start,
      last: index >= max - step
    }
    const blockParams = [index, data]
    str += options.fn(this, { data, blockParams })
    index += data.step
  } while (index < max)

  return str
})

module.exports = handlebars
