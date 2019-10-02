const handlebars = require('handlebars/runtime')
const map = require('licia/map')
const reduce = require('licia/reduce')
const isStr = require('licia/isStr')

// https://github.com/helpers/handlebars-helper-repeat
handlebars.registerHelper('repeat', function(count = 0, options) {
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

handlebars.registerHelper('class', function(value) {
  let classes = value.split(/\s+/)

  classes = map(classes, c => `eruda-${c}`)

  return `class="${classes.join(' ')}"`
})

handlebars.registerHelper('concat', function() {
  return reduce(arguments, (ret, n) => (isStr(n) ? ret + n : ret), '')
})

module.exports = handlebars
