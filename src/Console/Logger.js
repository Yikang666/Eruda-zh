import Log from './Log'
import {
  Emitter,
  evalCss,
  isNum,
  isUndef,
  perfNow,
  startWith,
  escapeRegExp,
  isStr,
  extend,
  uniqId,
  isRegExp,
  isFn,
  stripHtmlTag,
  loadJs,
  $,
  Stack
} from '../lib/util'

export default class Logger extends Emitter {
  constructor($el, container) {
    super()
    this._style = evalCss(require('./Logger.scss'))

    this._$el = $el
    this._container = container
    this._logs = []
    this._timer = {}
    this._count = {}
    this._lastLog = {}
    this._filter = 'all'
    this._maxNum = 'infinite'
    this._displayHeader = false
    this._groupStack = new Stack()

    this._bindEvent()
  }
  displayHeader(flag) {
    this._displayHeader = flag
  }
  maxNum(val) {
    const logs = this._logs

    this._maxNum = val
    if (isNum(val) && logs.length > val) {
      this._logs = logs.slice(logs.length - val)
      this.render()
    }
  }
  displayUnenumerable(flag) {
    Log.showUnenumerable = flag
  }
  displayGetterVal(flag) {
    Log.showGetterVal = flag
  }
  lazyEvaluation(flag) {
    Log.lazyEvaluation = flag
  }
  viewLogInSources(flag) {
    Log.showSrcInSources = flag
  }
  destroy() {
    evalCss.remove(this._style)
  }
  filter(val) {
    this._filter = val
    this.emit('filter', val)

    return this.render()
  }
  count(label) {
    const count = this._count

    !isUndef(count[label]) ? count[label]++ : (count[label] = 1)

    return this.html(`<div class="eruda-blue">${label}: ${count[label]}</div>`)
  }
  assert(...args) {
    if (args.length === 0) return

    const exp = args.shift()

    if (!exp) {
      args.unshift('Assertion failed: ')
      return this.insert('error', args)
    }
  }
  log(...args) {
    this.insert('log', args)

    return this
  }
  debug(...args) {
    this.insert('debug', args)

    return this
  }
  dir(...args) {
    this.insert('dir', args)

    return this
  }
  table(...args) {
    this.insert('table', args)

    return this
  }
  time(name) {
    this._timer[name] = perfNow()

    return this
  }
  timeEnd(name) {
    const startTime = this._timer[name]

    if (!startTime) return
    delete this._timer[name]

    return this.html(
      `<div class="eruda-blue">${name}: ${perfNow() - startTime}ms</div>`
    )
  }
  clear() {
    this._logs = []
    this._lastLog = {}

    return this.render()
  }
  info(...args) {
    return this.insert('info', args)
  }
  error(...args) {
    return this.insert('error', args)
  }
  warn(...args) {
    return this.insert('warn', args)
  }
  group(...args) {
    return this.insert('group', args)
  }
  groupCollapsed() {}
  groupEnd() {
    const lastLog = this._lastLog
    const $el = this._$el
    lastLog.groupEnd()
    this._groupStack.pop()

    const $container = $el.find(`div[data-id="${lastLog.id}"]`)
    if ($container.length > 0) {
      $container.parent().remove()
      $el.append(lastLog.content())
    }
  }
  input(jsCode) {
    if (startWith(jsCode, ':')) {
      this._runCmd(jsCode.slice(1))

      return this
    } else if (startWith(jsCode, '/')) {
      return this.filter(new RegExp(escapeRegExp(jsCode.slice(1))))
    }

    this.insert({
      type: 'input',
      args: [jsCode],
      ignoreFilter: true
    })

    try {
      this.output(evalJs(jsCode))
    } catch (e) {
      this.insert({
        type: 'error',
        ignoreFilter: true,
        args: [e]
      })
    }

    return this
  }
  output(val) {
    return this.insert({
      type: 'output',
      args: [val],
      ignoreFilter: true
    })
  }
  html(...args) {
    return this.insert('html', args)
  }
  help() {
    return this.insert({
      type: 'html',
      args: [helpMsg],
      ignoreFilter: true
    })
  }
  render() {
    let html = '',
      logs = this._logs

    logs = this._filterLogs(logs)

    for (let i = 0, len = logs.length; i < len; i++) {
      html += logs[i].content()
    }

    this._$el.html(html)
    this.scrollToBottom()

    return this
  }
  insert(type, args) {
    const logs = this._logs
    const $el = this._$el
    const groupStack = this._groupStack
    const el = $el.get(0)

    const isAtBottom = el.scrollTop === el.scrollHeight - el.offsetHeight

    const options = isStr(type) ? { type, args } : type
    if (groupStack.size > 0) {
      options.group = groupStack.peek()
    }
    extend(options, {
      id: uniqId('log'),
      displayHeader: this._displayHeader
    })

    if (type === 'group') {
      const group = {
        id: uniqId('group'),
        collapsed: false,
        parent: groupStack.peek(),
        indentLevel: groupStack.size + 1
      }
      options.targetGroup = group
      groupStack.push(group)
    }

    let log = new Log(options)

    const lastLog = this._lastLog
    if (
      log.type !== 'html' &&
      lastLog.type === log.type &&
      lastLog.value === log.value &&
      !log.src &&
      !log.args
    ) {
      lastLog.addCount()
      if (log.time) lastLog.updateTime(log.time)
      log = lastLog
      const $container = $el.find(`div[data-id="${lastLog.id}"]`)
      if ($container.length > 0) {
        $container.parent().remove()
      }
    } else {
      logs.push(log)
      this._lastLog = log
    }

    if (this._maxNum !== 'infinite' && logs.length > this._maxNum) {
      const firstLog = logs[0]
      const $container = $el.find(`div[data-id="${firstLog.id}"]`)
      if ($container.length > 0) {
        $container.parent().remove()
      }
      logs.shift()
    }

    if (this._filterLog(log) && this._container.active) {
      $el.append(log.content())
    }

    this.emit('insert', log)

    if (isAtBottom) this.scrollToBottom()

    return this
  }
  scrollToBottom() {
    const el = this._$el.get(0)

    el.scrollTop = el.scrollHeight - el.offsetHeight
  }
  _filterLogs(logs) {
    const filter = this._filter

    if (filter === 'all') return logs

    const isFilterRegExp = isRegExp(filter)
    const isFilterFn = isFn(filter)

    return logs.filter(log => {
      if (log.ignoreFilter) return true
      if (isFilterFn) return filter(log)
      if (isFilterRegExp) return filter.test(stripHtmlTag(log.content()))
      return log.type === filter
    })
  }
  _filterLog(log) {
    const filter = this._filter

    if (filter === 'all') return true

    const isFilterRegExp = isRegExp(filter),
      isFilterFn = isFn(filter)

    if (log.ignoreFilter) return true
    if (isFilterFn) return filter(log)
    if (isFilterRegExp) return filter.test(stripHtmlTag(log.content()))

    return log.type === filter
  }
  _loadJs(name) {
    loadJs(libraries[name], result => {
      if (result) return this.log(`${name} is loaded`)

      this.warn(`Failed to load ${name}`)
    })
  }
  _runCmd(cmd) {
    switch (cmd.trim()) {
      case '$':
        return this._loadJs('jQuery')
      case '_':
        return this._loadJs('underscore')
      default:
        this.warn('Unknown command').help()
    }
  }
  _bindEvent() {
    const self = this

    this._$el.on('click', '.eruda-log-item', function() {
      const $el = $(this)
      const id = $el.data('id')
      const type = $el.data('type')
      const logs = self._logs
      let log

      for (let i = 0, len = logs.length; i < len; i++) {
        log = logs[i]
        if (log.id === id) break
      }
      if (!log) return

      Log.click(type, log, $el, self)
    })
  }
}

const cmdList = require('./cmdList.json'),
  helpMsg = require('./help.hbs')({ commands: cmdList }),
  libraries = require('./libraries.json')

const evalJs = jsInput => {
  let ret

  try {
    ret = eval.call(window, `(${jsInput})`)
  } catch (e) {
    ret = eval.call(window, jsInput)
  }

  return ret
}
