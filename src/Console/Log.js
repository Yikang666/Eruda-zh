import origGetAbstract from '../lib/getAbstract'
import beautify from 'js-beautify'
import LunaObjectViewer from 'luna-object-viewer'
import {
  isObj,
  isStr,
  isErr,
  isPrimitive,
  wrap,
  defaults,
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
  keys,
  $,
  Emitter,
  stringifyAll,
  nextTick,
  linkify
} from '../lib/util'
import evalCss from '../lib/evalCss'

export default class Log extends Emitter {
  static showGetterVal = false
  static showUnenumerable = true
  static lazyEvaluation = true
  constructor({
    type = 'log',
    args = [],
    id,
    group = {},
    targetGroup = {},
    headers,
    ignoreFilter = false
  }) {
    super()

    this.type = type
    this.group = group
    this.targetGroup = targetGroup
    this.args = args
    this.count = 1
    this.id = id
    this.headers = headers
    this.ignoreFilter = ignoreFilter
    this.collapsed = false
    this.el = document.createElement('div')
    this.el.log = this
    this.height = 0
    this.width = 0
    this._$el = $(this.el)

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
      return true
    }

    return false
  }
  updateIcon(icon) {
    const $icon = this._$el.find('.eruda-icon')

    $icon.rmAttr('class').addClass(['eruda-icon', `eruda-icon-${icon}`])

    return this
  }
  addCount() {
    this.count++
    const count = this.count
    const $el = this._$el
    const $container = $el.find('.eruda-count-container')
    const $icon = $el.find('.eruda-icon-container')
    const $count = $container.find('.eruda-count')
    if (count === 2) {
      $container.rmClass('eruda-hidden')
    }
    $count.text(count)
    $icon.addClass('eruda-hidden')

    return this
  }
  groupEnd() {
    const $el = this._$el
    const $lastNesting = $el
      .find('.eruda-nesting-level:not(.eruda-group-closed)')
      .last()

    $lastNesting.addClass('eruda-group-closed')

    return this
  }
  updateTime(time) {
    const $el = this._$el
    const $container = $el.find('.eruda-time-container')

    if (this.time) {
      $container
        .find('span')
        .eq(0)
        .text(time)
      this.time = time
    }

    return this
  }
  isAttached() {
    return !!this.el.parentNode
  }
  updateSize(silent = true) {
    const height = this.el.offsetHeight
    const width = this.el.offsetWidth
    if (this.height !== height || this.width !== width) {
      this.height = height
      this.width = width
      if (!silent) this.emit('updateSize')
    }
  }
  html() {
    return this.el.outerHTML
  }
  text() {
    return this._content.textContent
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
  click(logger) {
    const { type, src } = this
    let { args } = this
    const $el = this._$el

    switch (type) {
      case 'log':
      case 'warn':
      case 'info':
      case 'debug':
      case 'output':
      case 'table':
      case 'dir':
      case 'group':
      case 'groupCollapsed':
        if (src || args) {
          const $json = $el.find('.eruda-json')
          if ($json.hasClass('eruda-hidden')) {
            if ($json.data('init') !== 'true') {
              if (src) {
                const staticViewer = new LunaObjectViewer.Static($json.get(0))
                staticViewer.set(src)
                staticViewer.on('change', () => this.updateSize(false))
              } else {
                if (type === 'table' || args.length === 1) {
                  if (isObj(args[0])) args = args[0]
                }
                const objViewer = new LunaObjectViewer($json.get(0), {
                  unenumerable: Log.showUnenumerable,
                  accessGetter: Log.showGetterVal
                })
                objViewer.set(args)
                objViewer.on('change', () => this.updateSize(false))
              }
              $json.data('init', 'true')
            }
            $json.rmClass('eruda-hidden')
          } else {
            $json.addClass('eruda-hidden')
          }
        } else if (type === 'group' || type === 'groupCollapsed') {
          logger.toggleGroup(this)
        }
        break
      case 'error':
        $el.find('.eruda-stack').toggleClass('eruda-hidden')
        break
    }

    this.updateSize(false)
  }
  _formatMsg() {
    let { args } = this
    const { type, id, headers, group } = this

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

    if (!this._needSrc() || !Log.lazyEvaluation) {
      delete this.args
    }

    // Only linkify for simple types
    if (type !== 'error' && !this.args) {
      msg = linkify(msg, url => {
        return `<a href="${url}" target="_blank">${url}</a>`
      })
    }
    msg = render({ msg, type, icon, id, headers, group })

    this._$el.addClass('eruda-log-container').html(msg)
    this._$content = this._$el.find('.eruda-log-content')
    this._content = this._$content.get(0)
  }
}

const getAbstract = wrap(origGetAbstract, function(fn, obj) {
  return (
    '<span class="eruda-abstract">' +
    fn(obj, {
      getterVal: Log.showGetterVal,
      unenumerable: false
    }) +
    '</span>'
  )
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
  const curTheme = evalCss.getCurTheme()
  return highlight(beautify(code, { indent_size: 2 }), 'js', {
    keyword: `color:${curTheme.keywordColor}`,
    number: `color:${curTheme.numberColor}`,
    operator: `color:${curTheme.operatorColor}`,
    comment: `color:${curTheme.commentColor}`,
    string: `color:${curTheme.stringColor}`
  })
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
  if (isInCss) newStr += '</span>'

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
  return `<pre style="display:inline">${formatJs(val.toString())}</pre>`
}

function formatEl(val) {
  return `<pre style="display:inline">${highlight(
    beautify.html(val.outerHTML, { unformatted: [], indent_size: 2 }),
    'html'
  )}</pre>`
}

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

function stringify(obj, options, cb) {
  const result = stringifyAll(obj, options)
  nextTick(() => cb(result))
}
