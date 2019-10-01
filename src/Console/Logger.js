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
  Stack,
  isEmpty,
  contain
} from '../lib/util'

export default class Logger extends Emitter {
  constructor($el) {
    super()
    this._style = evalCss(require('./Logger.scss'))

    this._$el = $el
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
  count(label = 'default') {
    const count = this._count

    !isUndef(count[label]) ? count[label]++ : (count[label] = 1)

    return this.info(`${label}: ${count[label]}`)
  }
  countReset(label = 'default') {
    this._count[label] = 0

    return this
  }
  assert(...args) {
    if (isEmpty(args)) return

    const exp = args.shift()

    if (!exp) {
      if (args.length === 0) args.unshift('console.assert')
      args.unshift('Assertion failed: ')
      return this.insert('error', args)
    }
  }
  log(...args) {
    if (isEmpty(args)) return

    return this.insert('log', args)
  }
  debug(...args) {
    if (isEmpty(args)) return

    return this.insert('debug', args)
  }
  dir(obj) {
    if (isUndef(obj)) return

    return this.insert('dir', [obj])
  }
  table(...args) {
    if (isEmpty(args)) return

    return this.insert('table', args)
  }
  time(name = 'default') {
    if (this._timer[name]) {
      return this.insert('warn', [`Timer '${name}' already exists`])
    }
    this._timer[name] = perfNow()

    return this
  }
  timeLog(name = 'default') {
    const startTime = this._timer[name]

    if (!startTime) {
      return this.insert('warn', [`Timer '${name}' does not exist`])
    }

    return this.info(`${name}: ${perfNow() - startTime}ms`)
  }
  timeEnd(name = 'default') {
    this.timeLog(name)

    delete this._timer[name]

    return this
  }
  clear() {
    this.silentClear()

    return this.insert('log', [
      '%cConsole was cleared',
      'color:#808080;font-style:italic;'
    ])
  }
  silentClear() {
    this._logs = []
    this._lastLog = {}
    this._count = {}
    this._timer = {}
    this._groupStack = new Stack()

    return this.render()
  }
  info(...args) {
    if (isEmpty(args)) return

    return this.insert('info', args)
  }
  error(...args) {
    if (isEmpty(args)) return

    return this.insert('error', args)
  }
  warn(...args) {
    if (isEmpty(args)) return

    return this.insert('warn', args)
  }
  group(...args) {
    return this.insert('group', args)
  }
  groupCollapsed(...args) {
    return this.insert('groupCollapsed', args)
  }
  groupEnd() {
    const lastLog = this._lastLog
    lastLog.groupEnd()
    this._groupStack.pop()
    this._refreshLogUi(lastLog)
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
    let html = ''
    let logs = this._logs

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

    if (type === 'group' || type === 'groupCollapsed') {
      const group = {
        id: uniqId('group'),
        collapsed: false,
        parent: groupStack.peek(),
        indentLevel: groupStack.size + 1
      }
      if (type === 'groupCollapsed') group.collapsed = true
      options.targetGroup = group
      groupStack.push(group)
    }

    let log = new Log(options)

    const lastLog = this._lastLog
    if (
      !contain(['html', 'group', 'groupCollapsed'], log.type) &&
      lastLog.type === log.type &&
      lastLog.value === log.value &&
      !log.src &&
      !log.args
    ) {
      lastLog.addCount()
      if (log.time) lastLog.updateTime(log.time)
      log = lastLog
      this._rmLogUi(lastLog)
    } else {
      logs.push(log)
      this._lastLog = log
    }

    if (this._maxNum !== 'infinite' && logs.length > this._maxNum) {
      const firstLog = logs[0]
      this._rmLogUi(firstLog)
      logs.shift()
    }

    if (this._filterLog(log)) {
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
  _rmLogUi(log) {
    const $container = this._$el.find(`li[data-id="${log.id}"]`)
    if ($container.length > 0) {
      $container.remove()
    }
  }
  _refreshLogUi(log) {
    const $container = this._$el.find(`li[data-id="${log.id}"]`)
    if ($container.length > 0) {
      $container.after(log.content())
      $container.remove()
    }
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
  _getLog(id) {
    const logs = this._logs
    let log

    for (let i = 0, len = logs.length; i < len; i++) {
      log = logs[i]
      if (log.id === id) break
    }

    return log
  }
  _collapseGroup(log) {
    const { targetGroup } = log
    targetGroup.collapsed = true
    log.updateIcon('caret-right')
    this._refreshLogUi(log)

    this._updateGroup(log)
  }
  _openGroup(log) {
    const { targetGroup } = log
    targetGroup.collapsed = false
    log.updateIcon('caret-down')
    this._refreshLogUi(log)

    this._updateGroup(log)
  }
  _updateGroup(log) {
    const { targetGroup } = log
    const logs = this._logs
    const len = logs.length
    let i = logs.indexOf(log) + 1
    while (i < len) {
      const log = logs[i]
      if (log.checkGroup()) {
        this._refreshLogUi(log)
      } else if (log.group === targetGroup) {
        break
      }
      i++
    }
  }
  _bindEvent() {
    const self = this
    const $el = this._$el

    $el
      .on('click', '.eruda-log-container', function() {
        const $el = $(this)
        const id = $el.data('id')
        const type = $el.data('type')
        const log = self._getLog(id)
        if (!log) return

        Log.click(type, log, $el, self)
      })
      .on('click', '.eruda-icon-caret-down', function() {
        const $el = $(this)
          .parent()
          .parent()
          .parent()
        const id = $el.data('id')
        const log = self._getLog(id)
        if (!log) return

        self._collapseGroup(log)
      })
      .on('click', '.eruda-icon-caret-right', function() {
        const $el = $(this)
          .parent()
          .parent()
          .parent()
        const id = $el.data('id')
        const log = self._getLog(id)
        if (!log) return

        self._openGroup(log)
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
