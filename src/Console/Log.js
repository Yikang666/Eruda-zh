import stringify from './stringify'
import origGetAbstract from '../lib/getAbstract'
import beautify from 'js-beautify'
import JsonViewer from '../lib/JsonViewer'
import {
  isObj,
  isStr,
  isErr,
  isPrimitive,
  wrap,
  defaults,
  dateFormat,
  getObjType,
  isEl,
  toStr,
  toNum,
  toInt,
  escape,
  isNull,
  isUndef,
  isFn,
  toArr,
  isArr,
  unique,
  contain,
  isEmpty,
  clone,
  noop,
  highlight,
  each,
  trim,
  lowerCase,
  keys
} from '../lib/util'

export default class Log {
  constructor({
    type = 'log',
    args = [],
    id,
    group = {},
    targetGroup = {},
    displayHeader = false,
    ignoreFilter = false
  }) {
    this.type = type
    this.group = group
    this.targetGroup = targetGroup
    this.args = args
    this.count = 1
    this.id = id
    this.displayHeader = displayHeader
    this.ignoreFilter = ignoreFilter
    this.collapsed = false

    if (displayHeader) {
      this.time = getCurTime()
      this.from = getFrom()
    }

    this._formatMsg()

    if (this.group) {
      this.checkGroup()
    }
  }
  // If state changed, return true.
  checkGroup() {
    let { group } = this

    let collapsed = false
    while (group) {
      if (group.collapsed) {
        collapsed = true
        break
      }
      group = group.parent
    }
    if (collapsed !== this.collapsed) {
      this.collapsed = collapsed
      if (collapsed) {
        this.hide()
      } else {
        this.show()
      }
      return true
    } else {
      return false
    }
  }
  hide() {
    let msg = this._formattedMsg

    msg = msg.replace(
      '"eruda-log-container"',
      '"eruda-log-container eruda-hidden"'
    )

    this._formattedMsg = msg
  }
  show() {
    let msg = this._formattedMsg

    msg = msg.replace(
      '"eruda-log-container eruda-hidden"',
      '"eruda-log-container"'
    )

    this._formattedMsg = msg
  }
  updateIcon(icon) {
    let msg = this._formattedMsg

    msg = msg.replace(
      /"eruda-icon eruda-icon-[\w-]+"/,
      `"eruda-icon eruda-icon-${icon}"`
    )

    this._formattedMsg = msg

    return this
  }
  addCount() {
    this.count++
    const count = this.count
    let msg = this._formattedMsg
    if (count === 2) {
      msg = msg.replace(
        'eruda-count-container eruda-hidden',
        'eruda-count-container'
      )
    }
    msg = msg.replace(/data-mark="count">\d*/, 'data-mark="count">' + count)
    msg = msg.replace(
      'class="eruda-icon-container"',
      'class="eruda-icon-container eruda-hidden"'
    )

    this._formattedMsg = msg

    return this
  }
  groupEnd() {
    let msg = this._formattedMsg

    const mark = '"eruda-nesting-level"'
    const lastIdx = msg.lastIndexOf(mark)
    const len = lastIdx + mark.length - 1
    msg = msg.slice(0, len) + ' eruda-group-closed"' + msg.slice(len)
    this._formattedMsg = msg

    return this
  }
  updateTime(time) {
    let msg = this._formattedMsg

    if (this.time) {
      msg = msg.replace(/data-mark="time">(.*?)</, `data-mark="time">${time}<`)
      this.time = time
      this._formattedMsg = msg
    }

    return this
  }
  content() {
    return this._formattedMsg
  }
  _needSrc() {
    const { type, args } = this

    if (type === 'html') return false

    for (let i = 0, len = args.length; i < len; i++) {
      if (isObj(args[i])) return true
    }

    return false
  }
  extractObj(cb = noop) {
    const { args, type } = this

    const setSrc = result => {
      this.src = result
      cb()
    }
    if (type === 'table') {
      extractObj(args[0], {}, setSrc)
    } else {
      extractObj(
        args.length === 1 && isObj(args[0]) ? args[0] : args,
        {},
        setSrc
      )
    }
  }
  _formatMsg() {
    let { args } = this
    const { type, id, displayHeader, time, from, group } = this

    // Don't change original args for lazy evaluation.
    args = clone(args)

    if (this._needSrc() && !Log.lazyEvaluation) {
      this.extractObj()
    }

    let msg = ''
    let icon
    let err

    if (type === 'group' || type === 'groupCollapsed') {
      if (args.length === 0) {
        args = ['console.group']
      }
    }

    switch (type) {
      case 'log':
        msg = formatMsg(args)
        break
      case 'debug':
        msg = formatMsg(args)
        break
      case 'dir':
        msg = formatDir(args)
        break
      case 'info':
        msg = formatMsg(args)
        break
      case 'warn':
        icon = 'warn'
        msg = formatMsg(args)
        break
      case 'error':
        if (isStr(args[0]) && args.length !== 1) args = substituteStr(args)
        err = args[0]
        icon = 'error'
        err = isErr(err) ? err : new Error(formatMsg(args))
        this.src = err
        msg = formatErr(err)
        break
      case 'table':
        msg = formatTable(args)
        break
      case 'html':
        msg = args[0]
        break
      case 'input':
        msg = formatJs(args[0])
        icon = 'arrow-right'
        break
      case 'output':
        msg = formatMsg(args)
        icon = 'arrow-left'
        break
      case 'groupCollapsed':
        msg = formatMsg(args)
        icon = 'caret-right'
        break
      case 'group':
        msg = formatMsg(args)
        icon = 'caret-down'
        break
    }

    if (type !== 'error') msg = recognizeUrl(msg)
    this.value = msg
    msg = render({ msg, type, icon, id, displayHeader, time, from, group })

    if (!this._needSrc() || !Log.lazyEvaluation) {
      delete this.args
    }
    this._formattedMsg = msg
  }
  static click(type, log, $el, logger) {
    switch (type) {
      case 'log':
      case 'warn':
      case 'info':
      case 'debug':
      case 'output':
      case 'table':
      case 'dir':
        if (log.src) {
          if (Log.showSrcInSources) {
            return logger.emit('viewJson', log.src)
          }
          const $json = $el.find('.eruda-json')
          if ($json.hasClass('eruda-hidden')) {
            if ($json.data('init') !== 'true') {
              new JsonViewer(log.src, $json)
              $json.data('init', 'true')
            }
            $json.rmClass('eruda-hidden')
          } else {
            $json.addClass('eruda-hidden')
          }
        } else if (log.args) {
          log.extractObj(function() {
            Log.click(type, log, $el, logger)
            delete log.args
          })
        }
        break
      case 'error':
        $el.find('.eruda-stack').toggleClass('eruda-hidden')
        break
    }

    return 'handled'
  }
}

// Looks like es6 doesn't support static properties yet.
Log.showGetterVal = false
Log.showUnenumerable = true
Log.showSrcInSources = false
Log.lazyEvaluation = true

const getAbstract = wrap(origGetAbstract, function(fn, obj) {
  return fn(obj, {
    getterVal: Log.showGetterVal,
    unenumerable: false
  })
})

const Value = '__ErudaValue'

function formatTable(args) {
  const table = args[0]
  let ret = ''
  let filter = args[1]
  let columns = []

  if (isStr(filter)) filter = toArr(filter)
  if (!isArr(filter)) filter = null

  if (!isObj(table)) return formatMsg(args)

  each(table, val => {
    if (isPrimitive(val)) {
      columns.push(Value)
    } else if (isObj(val)) {
      columns = columns.concat(keys(val))
    }
  })
  columns = unique(columns)
  columns.sort()
  if (filter) columns = columns.filter(val => contain(filter, val))
  if (columns.length > 20) columns = columns.slice(0, 20)
  if (isEmpty(columns)) return formatMsg(args)

  ret += '<table><thead><tr><th>(index)</th>'
  columns.forEach(
    val => (ret += `<th>${val === Value ? 'Value' : toStr(val)}</th>`)
  )
  ret += '</tr></thead><tbody>'

  each(table, (obj, idx) => {
    ret += `<tr><td>${idx}</td>`
    columns.forEach(column => {
      if (isObj(obj)) {
        ret +=
          column === Value
            ? '<td></td>'
            : `<td>${formatTableVal(obj[column])}</td>`
      } else if (isPrimitive(obj)) {
        ret +=
          column === Value ? `<td>${formatTableVal(obj)}</td>` : '<td></td>'
      }
    })
    ret += '</tr>'
  })

  ret += '</tbody></table>'
  ret += '<div class="eruda-json eruda-hidden"></div>'

  return ret
}

function formatTableVal(val) {
  if (isObj(val)) return (val = '{…}')
  if (isPrimitive(val)) return getAbstract(val)

  return toStr(val)
}

const regJsUrl = /https?:\/\/([0-9.\-A-Za-z]+)(?::(\d+))?\/[A-Z.a-z0-9/]*\.js/g
const regErudaJs = /eruda(\.min)?\.js/

function formatErr(err) {
  let lines = err.stack ? err.stack.split('\n') : []
  const msg = `${err.message || lines[0]}<br/>`

  lines = lines.filter(val => !regErudaJs.test(val)).map(val => escape(val))

  const stack = `<div class="eruda-stack eruda-hidden">${lines
    .slice(1)
    .join('<br/>')}</div>`

  return (
    msg +
    stack.replace(
      regJsUrl,
      match => `<a href="${match}" target="_blank">${match}</a>`
    )
  )
}

function formatJs(code) {
  return highlight(beautify(code), 'js')
}

function formatMsg(args, { htmlForEl = true } = {}) {
  const needStrSubstitution = isStr(args[0]) && args.length !== 1
  if (needStrSubstitution) args = substituteStr(args)

  for (let i = 0, len = args.length; i < len; i++) {
    let val = args[i]

    if (isEl(val) && htmlForEl) {
      args[i] = formatEl(val)
    } else if (isFn(val)) {
      args[i] = formatFn(val)
    } else if (isObj(val)) {
      args[i] = formatObj(val)
    } else if (isUndef(val)) {
      args[i] = 'undefined'
    } else if (isNull(val)) {
      args[i] = 'null'
    } else {
      val = toStr(val)
      if (i !== 0 || !needStrSubstitution) val = escape(val)
      args[i] = val
    }
  }

  return args.join(' ') + '<div class="eruda-json eruda-hidden"></div>'
}

const formatDir = args => formatMsg(args, { htmlForEl: false })

function substituteStr(args) {
  const str = escape(args[0])
  let isInCss = false
  let newStr = ''

  args.shift()

  for (let i = 0, len = str.length; i < len; i++) {
    const c = str[i]

    if (c === '%' && args.length !== 0) {
      i++
      const arg = args.shift()
      switch (str[i]) {
        case 'i':
        case 'd':
          newStr += toInt(arg)
          break
        case 'f':
          newStr += toNum(arg)
          break
        case 's':
          newStr += toStr(arg)
          break
        case 'O':
          if (isObj(arg)) {
            newStr += getAbstract(arg)
          }
          break
        case 'o':
          if (isEl(arg)) {
            newStr += formatEl(arg)
          } else if (isObj(arg)) {
            newStr += getAbstract(arg)
          }
          break
        case 'c':
          if (str.length <= i + 1) {
            break
          }
          if (isInCss) newStr += '</span>'
          isInCss = true
          newStr += `<span style="${correctStyle(arg)}">`
          break
        default:
          i--
          args.unshift(arg)
          newStr += c
      }
    } else {
      newStr += c
    }
  }

  args.unshift(newStr)

  return args
}

function correctStyle(val) {
  val = lowerCase(val)
  const rules = val.split(';')
  const style = {}
  each(rules, rule => {
    if (!contain(rule, ':')) return
    const [name, val] = rule.split(':')
    style[trim(name)] = trim(val)
  })
  style['display'] = 'inline-block'
  style['max-width'] = '100%'
  style['contain'] = 'paint'
  delete style.width
  delete style.height

  let ret = ''
  each(style, (val, key) => {
    ret += `${key}:${val};`
  })
  return ret
}

function formatObj(val) {
  let type = getObjType(val)
  if (type === 'Array' && val.length > 1) type = `(${val.length})`

  return `${type} ${getAbstract(val)}`
}

function formatFn(val) {
  return `<pre style="display:inline">${highlight(
    beautify.js(val.toString()),
    'js'
  )}</pre>`
}

function formatEl(val) {
  return `<pre style="display:inline">${highlight(
    beautify.html(val.outerHTML, { unformatted: [] }),
    'html'
  )}</pre>`
}

const regUrl = /(^|[\s\n]|<[A-Za-z]*\/?>)((?:https?|ftp):\/\/[-A-Z0-9+\u0026\u2019@#/%?=()~_|!:,.;]*[-A-Z0-9+\u0026@#/%=~()_|])/gi

const recognizeUrl = str =>
  str.replace(regUrl, '<a href="$2" target="_blank">$2</a>')

function getFrom() {
  const e = new Error()
  let ret = ''
  const lines = e.stack ? e.stack.split('\n') : ''

  for (let i = 0, len = lines.length; i < len; i++) {
    ret = lines[i]
    if (ret.indexOf('winConsole') > -1 && i < len - 1) {
      ret = lines[i + 1]
      break
    }
  }

  return ret
}

const getCurTime = () => dateFormat('HH:MM:ss')

const tpl = require('./Log.hbs')
const render = data => tpl(data)

function extractObj(obj, options = {}, cb) {
  defaults(options, {
    accessGetter: Log.showGetterVal,
    unenumerable: Log.showUnenumerable,
    symbol: Log.showUnenumerable,
    timeout: 1000
  })

  stringify(obj, options, result => cb(JSON.parse(result)))
}
