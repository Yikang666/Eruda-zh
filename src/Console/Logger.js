import Log from './Log'
import {
  Emitter,
  evalCss,
  isNum,
  isUndef,
  perfNow,
  isStr,
  extend,
  uniqId,
  isRegExp,
  isFn,
  $,
  Stack,
  isEmpty,
  contain,
  copy,
  each,
  toArr,
  keys,
  last,
  throttle
} from '../lib/util'

let id = 0

export default class Logger extends Emitter {
  constructor($container) {
    super()
    this._style = evalCss(require('./Logger.scss'))

    this._$container = $container
    this._container = $container.get(0)
    this._$el = $container.find('ul.eruda-logs')
    this._el = this._$el.get(0)
    this._$fakeEl = $container.find('ul.eruda-fake-logs')
    this._fakeEl = this._$fakeEl.get(0)
    this._$topSpace = $container.find('.eruda-top-space')
    this._$bottomSpace = $container.find('.eruda-bottom-space')
    this._topSpaceHeight = 0
    this._bottomSpaceHeight = 0
    this._logs = []
    this._displayLogs = []
    this._timer = {}
    this._count = {}
    this._lastLog = {}
    this._filter = 'all'
    this._maxNum = 'infinite'
    this._displayHeader = false
    this._asyncRender = false
    this._asyncList = []
    this._asyncTimer = null
    this._isAtBottom = true
    this._groupStack = new Stack()

    this.renderViewport = throttle(force => this._renderViewport(force), 16)

    // https://developers.google.cn/web/tools/chrome-devtools/console/utilities
    this._global = {
      copy(value) {
        if (!isStr(value)) value = JSON.stringify(value, null, 2)
        copy(value)
      },
      $() {
        return document.querySelector.apply(document, arguments)
      },
      $$() {
        return toArr(document.querySelectorAll.apply(document, arguments))
      },
      clear: () => {
        this.clear()
      },
      dir: value => {
        this.dir(value)
      },
      table: (data, columns) => {
        this.table(data, columns)
      },
      keys
    }

    this._bindEvent()
  }
  renderAsync(flag) {
    this._asyncRender = flag
  }
  setGlobal(name, val) {
    this._global[name] = val
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
    this._displayLogs = []
    this._lastLog = {}
    this._count = {}
    this._timer = {}
    this._groupStack = new Stack()
    this._asyncList = []
    if (this._asyncTimer) {
      clearTimeout(this._asyncTimer)
      this._asyncTimer = null
    }

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
    return this.insert({
      type: 'group',
      args,
      ignoreFilter: true
    })
  }
  groupCollapsed(...args) {
    return this.insert({
      type: 'groupCollapsed',
      args,
      ignoreFilter: true
    })
  }
  groupEnd() {
    this.insert('groupEnd')
  }
  input(jsCode) {
    this.insert({
      type: 'input',
      args: [jsCode],
      ignoreFilter: true
    })

    try {
      this.output(this._evalJs(jsCode))
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
  render() {
    const logs = this._logs

    this._$el.html('')
    this._displayLogs = []
    for (let i = 0, len = logs.length; i < len; i++) {
      this._attachLog(logs[i])
    }

    return this
  }
  insert(type, args) {
    this._asyncRender
      ? this.insertAsync(type, args)
      : this.insertSync(type, args)
  }
  insertAsync(type, args) {
    this._asyncList.push([type, args])

    this._handleAsyncList()
  }
  insertSync(type, args) {
    const logs = this._logs
    const groupStack = this._groupStack

    // Because asynchronous rendering, groupEnd must be put here.
    if (type === 'groupEnd') {
      const lastLog = this._lastLog
      lastLog.groupEnd()
      this._groupStack.pop()
      return this
    }

    const options = isStr(type) ? { type, args } : type
    if (groupStack.size > 0) {
      options.group = groupStack.peek()
    }
    extend(options, {
      id: ++id,
      displayHeader: this._displayHeader
    })

    if (options.type === 'group' || options.type === 'groupCollapsed') {
      const group = {
        id: uniqId('group'),
        collapsed: false,
        parent: groupStack.peek(),
        indentLevel: groupStack.size + 1
      }
      if (options.type === 'groupCollapsed') group.collapsed = true
      options.targetGroup = group
      groupStack.push(group)
    }

    let log = new Log(options)
    log.on('updateSize', () => this.renderViewport())

    const lastLog = this._lastLog
    if (
      !contain(['html', 'group', 'groupCollapsed'], log.type) &&
      lastLog.type === log.type &&
      !log.src &&
      !log.args &&
      lastLog.text() === log.text()
    ) {
      lastLog.addCount()
      if (log.time) lastLog.updateTime(log.time)
      log = lastLog
      this._detachLog(lastLog)
    } else {
      logs.push(log)
      this._lastLog = log
    }

    if (this._maxNum !== 'infinite' && logs.length > this._maxNum) {
      const firstLog = logs[0]
      this._detachLog(firstLog)
      logs.shift()
    }

    this._attachLog(log)
    this._updateLogSize(log)

    this.emit('insert', log)

    return this
  }
  toggleGroup(log) {
    const { targetGroup } = log
    targetGroup.collapsed ? this._openGroup(log) : this._collapseGroup(log)
  }
  _updateTopSpace(height) {
    this._topSpaceHeight = height
    this._$topSpace.css({ height })
  }
  _updateBottomSpace(height) {
    this._bottomSpaceHeight = height
    this._$bottomSpace.css({ height })
  }
  _updateLogSize(log) {
    if (this._fakeEl.offsetParent === null) return
    if (!log.isAttached()) {
      this._fakeEl.appendChild(log.el)
      log.updateSize()
      this._fakeEl.removeChild(log.el)
      return
    }
    log.updateSize()
  }
  _detachLog(log) {
    const displayLogs = this._displayLogs

    const idx = displayLogs.indexOf(log)
    if (idx > -1) {
      displayLogs.splice(idx, 1)
      this.renderViewport()
    }
  }
  // Binary search
  _attachLog(log) {
    if (!this._filterLog(log) || log.collapsed) return

    const displayLogs = this._displayLogs

    if (displayLogs.length === 0) {
      displayLogs.push(log)
      this.renderViewport()
      return
    }

    const lastDisplayLog = last(displayLogs)
    if (log.id > lastDisplayLog.id) {
      displayLogs.push(log)
      this.renderViewport()
      return
    }

    let startIdx = 0
    let endIdx = displayLogs.length - 1

    let middleLog
    let middleIdx

    while (startIdx <= endIdx) {
      middleIdx = startIdx + Math.floor((endIdx - startIdx) / 2)
      middleLog = displayLogs[middleIdx]

      if (middleLog.id === log.id) {
        return
      }

      if (middleLog.id < log.id) {
        startIdx = middleIdx + 1
      } else {
        endIdx = middleIdx - 1
      }
    }

    if (middleLog.id < log.id) {
      displayLogs.splice(middleIdx + 1, 0, log)
    } else {
      displayLogs.splice(middleIdx, 0, log)
    }

    this.renderViewport()
  }
  _handleAsyncList() {
    const asyncList = this._asyncList

    if (this._asyncTimer) return

    this._asyncTimer = setTimeout(() => {
      this._asyncTimer = null
      let done = false
      for (let i = 0; i < 20; i++) {
        const item = asyncList.shift()
        if (!item) {
          done = true
          break
        }
        this.insertSync(item[0], item[1])
      }
      if (!done) this._handleAsyncList()
    }, 15)
  }
  _injectGlobal() {
    each(this._global, (val, name) => {
      if (window[name]) return

      window[name] = val
    })
  }
  _clearGlobal() {
    each(this._global, (val, name) => {
      if (window[name] && window[name] === val) {
        delete window[name]
      }
    })
  }
  _evalJs(jsInput) {
    let ret

    this._injectGlobal()
    try {
      ret = eval.call(window, `(${jsInput})`)
    } catch (e) {
      ret = eval.call(window, jsInput)
    }
    this.setGlobal('$_', ret)
    this._clearGlobal()

    return ret
  }
  _filterLog(log) {
    const filter = this._filter

    if (filter === 'all') return true

    const isFilterRegExp = isRegExp(filter)
    const isFilterFn = isFn(filter)

    if (log.ignoreFilter) return true
    if (isFilterFn) return filter(log)
    if (isFilterRegExp) return filter.test(log.text())

    return log.type === filter
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

    this._updateGroup(log)
  }
  _openGroup(log) {
    const { targetGroup } = log
    targetGroup.collapsed = false
    log.updateIcon('caret-down')

    this._updateGroup(log)
  }
  _updateGroup(log) {
    const { targetGroup } = log
    const logs = this._logs
    const len = logs.length
    let i = logs.indexOf(log) + 1
    while (i < len) {
      const log = logs[i]
      if (!log.checkGroup() && log.group === targetGroup) {
        break
      }
      log.collapsed ? this._detachLog(log) : this._attachLog(log)
      i++
    }
  }
  _bindEvent() {
    const self = this
    const $el = this._$el

    $el
      .on('click', '.eruda-log-container', function() {
        this.log.click(self)
      })
      .on('click', '.eruda-icon-caret-down', function() {
        const $el = $(this)
          .parent()
          .parent()
          .parent()

        self._collapseGroup($el.get(0).log)
      })
      .on('click', '.eruda-icon-caret-right', function() {
        const $el = $(this)
          .parent()
          .parent()
          .parent()

        self._openGroup($el.get(0).log)
      })

    this._$container.on('scroll', () => this.renderViewport(false))
  }
  _renderViewport(force = true) {
    const container = this._container
    if (container.offsetParent === null) return
    const { scrollTop, offsetWidth, offsetHeight } = container
    let top = scrollTop
    let bottom = scrollTop + offsetHeight

    if (!force) {
      if (
        this._topSpaceHeight < top &&
        this._topSpaceHeight + this._el.offsetHeight > bottom
      ) {
        this._checkScrollBottom(false)
        return
      }
    }

    const displayLogs = this._displayLogs
    const tolerance = 1000
    top -= tolerance
    bottom += tolerance

    let topSpaceHeight = 0
    let bottomSpaceHeight = 0
    let currentHeight = 0

    this._$el.html('')
    const frag = document.createDocumentFragment()
    for (let i = 0, len = displayLogs.length; i < len; i++) {
      const log = displayLogs[i]
      const { el } = log
      let { height } = log
      const { width } = log
      if (height === 0 || width !== offsetWidth) {
        this._updateLogSize(log)
        height = log.height
      }

      if (currentHeight > bottom) {
        bottomSpaceHeight += height
      } else if (currentHeight + height > top) {
        frag.appendChild(el)
      } else if (currentHeight < top) {
        topSpaceHeight += height
      }

      currentHeight += height
    }
    this._el.appendChild(frag)

    this._updateTopSpace(topSpaceHeight)
    this._updateBottomSpace(bottomSpaceHeight)

    container.scrollTop = scrollTop

    this._checkScrollBottom(true)
  }
  _checkScrollBottom(scrollToBottom) {
    const container = this._container
    const { scrollHeight, offsetHeight } = container
    if (this._isAtBottom) {
      if (scrollToBottom) container.scrollTop = scrollHeight - offsetHeight
      this._isAtBottom = true
    }
    this._isAtBottom = false
    if (scrollHeight === offsetHeight) {
      this._isAtBottom = true
    } else if (container.scrollTop === scrollHeight - offsetHeight) {
      this._isAtBottom = true
    }
  }
}
