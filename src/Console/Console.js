import Tool from '../DevTools/Tool'
import noop from 'licia/noop'
import $ from 'licia/$'
import Emitter from 'licia/Emitter'
import uncaught from 'licia/uncaught'
import escapeRegExp from 'licia/escapeRegExp'
import trim from 'licia/trim'
import upperFirst from 'licia/upperFirst'
import isHidden from 'licia/isHidden'
import lowerCase from 'licia/lowerCase'
import isNull from 'licia/isNull'
import extend from 'licia/extend'
import evalCss from '../lib/evalCss'
import emitter from '../lib/emitter'
import Settings from '../Settings/Settings'
import LunaConsole from 'luna-console'
import LunaModal from 'luna-modal'
import { classPrefix as c } from '../lib/util'

uncaught.start()

export default class Console extends Tool {
  constructor({ name = 'console' } = {}) {
    super()

    Emitter.mixin(this)

    this.name = name
    this._scale = 1
    this._selectedLog = null

    this._registerListener()
  }
  init($el, container) {
    super.init($el)
    this._container = container

    this._appendTpl()

    this._initCfg()

    this._initLogger()
    this._exposeLogger()
    this._bindEvent()
  }
  show() {
    super.show()
    this._handleShow()
  }
  overrideConsole() {
    const origConsole = (this._origConsole = {})
    const winConsole = window.console

    CONSOLE_METHOD.forEach((name) => {
      let origin = (origConsole[name] = noop)
      if (winConsole[name]) {
        origin = origConsole[name] = winConsole[name].bind(winConsole)
      }

      winConsole[name] = (...args) => {
        this[name](...args)
        origin(...args)
      }
    })

    return this
  }
  setGlobal(name, val) {
    this._logger.setGlobal(name, val)
  }
  restoreConsole() {
    if (!this._origConsole) return this

    CONSOLE_METHOD.forEach(
      (name) => (window.console[name] = this._origConsole[name])
    )
    delete this._origConsole

    return this
  }
  catchGlobalErr() {
    uncaught.addListener(this._handleErr)

    return this
  }
  ignoreGlobalErr() {
    uncaught.rmListener(this._handleErr)

    return this
  }
  destroy() {
    this._logger.destroy()
    super.destroy()

    this._container.off('show', this._handleShow)

    if (this._style) {
      evalCss.remove(this._style)
    }
    this.ignoreGlobalErr()
    this.restoreConsole()
    this._unregisterListener()
    this._rmCfg()
  }
  _handleShow = () => {
    if (isHidden(this._$el.get(0))) return
    this._logger.renderViewport()
  }
  _handleErr = (err) => {
    this._logger.error(err)
  }
  _enableJsExecution(enabled) {
    const $el = this._$el
    const $container = $el.find(c('.console-container'))
    const $jsInput = $el.find(c('.js-input'))

    if (enabled) {
      $jsInput.show()
      $container.rmClass(c('js-input-hidden'))
    } else {
      $jsInput.hide()
      $container.addClass(c('js-input-hidden'))
    }
  }
  _registerListener() {
    this._scaleListener = (scale) => (this._scale = scale)

    emitter.on(emitter.SCALE, this._scaleListener)
  }
  _unregisterListener() {
    emitter.off(emitter.SCALE, this._scaleListener)
  }
  _appendTpl() {
    const $el = this._$el

    this._style = evalCss(require('./Console.scss'))
    $el.append(
      c(`
      <div class="console-container">
        <div class="control">
          <span class="icon-clear clear-console"></span>
          <span class="filter active" data-filter="all">All</span>
          <span class="filter" data-filter="error">Error</span>
          <span class="filter" data-filter="warn">Warning</span>
          <span class="filter" data-filter="info">Info</span>
          <span class="search-keyword"></span>
          <span class="icon-filter search"></span>
          <span class="icon-copy icon-disabled copy"></span>
        </div>
        <div class="logs-container"></div>
        <div class="js-input">
          <div class="buttons">
            <div class="button cancel">Cancel</div>
            <div class="button execute">Execute</div>
          </div>
          <span class="icon-arrow-right"></span>
          <textarea></textarea>
        </div>
      </div>
    `)
    )

    const _$inputContainer = $el.find(c('.js-input'))
    const _$input = _$inputContainer.find('textarea')
    const _$inputBtns = _$inputContainer.find(c('.buttons'))

    extend(this, {
      _$control: $el.find(c('.control')),
      _$logs: $el.find(c('.logs-container')),
      _$inputContainer,
      _$input,
      _$inputBtns,
      _$searchKeyword: $el.find(c('.search-keyword')),
    })
  }
  _initLogger() {
    const cfg = this.config
    let maxLogNum = cfg.get('maxLogNum')
    maxLogNum = maxLogNum === 'infinite' ? 0 : +maxLogNum

    const $filter = this._$control.find(c('.filter'))
    const logger = new LunaConsole(this._$logs.get(0), {
      asyncRender: cfg.get('asyncRender'),
      maxNum: maxLogNum,
      showHeader: cfg.get('displayExtraInfo'),
      unenumerable: cfg.get('displayUnenumerable'),
      accessGetter: cfg.get('displayGetterVal'),
      lazyEvaluation: cfg.get('lazyEvaluation'),
    })

    logger.on('optionChange', (name, filter) => {
      if (name !== 'filter') {
        return
      }
      $filter.each(function () {
        const $this = $(this)
        const isMatch = $this.data('filter') === filter

        $this[isMatch ? 'addClass' : 'rmClass'](c('active'))
      })
    })

    if (cfg.get('overrideConsole')) this.overrideConsole()

    this._logger = logger
  }
  _exposeLogger() {
    const logger = this._logger
    const methods = ['filter', 'html'].concat(CONSOLE_METHOD)

    methods.forEach(
      (name) =>
        (this[name] = (...args) => {
          logger[name](...args)
          this.emit(name, ...args)

          return this
        })
    )
  }
  _bindEvent() {
    const container = this._container
    const $input = this._$input
    const $inputBtns = this._$inputBtns
    const $control = this._$control
    const $searchKeyword = this._$searchKeyword

    const logger = this._logger
    const config = this.config

    $control
      .on('click', c('.clear-console'), () => logger.clear(true))
      .on('click', c('.filter'), function () {
        $searchKeyword.text('')
        logger.setOption('filter', $(this).data('filter'))
      })
      .on('click', c('.search'), () => {
        LunaModal.prompt('Filter').then((filter) => {
          if (isNull(filter)) return
          $searchKeyword.text(filter)
          if (trim(filter) === '') {
            logger.setOption('filter', 'all')
            return
          }
          logger.setOption(
            'filter',
            new RegExp(escapeRegExp(lowerCase(filter)))
          )
        })
      })
      .on('click', c('.copy'), () => {
        this._selectedLog.copy()
        container.notify('Copied')
      })

    $inputBtns
      .on('click', c('.cancel'), () => this._hideInput())
      .on('click', c('.execute'), () => {
        const jsInput = $input.val().trim()
        if (jsInput === '') return

        logger.evaluate(jsInput)
        $input.val('').get(0).blur()
        this._hideInput()
      })

    $input.on('focusin', () => this._showInput())

    logger.on('insert', (log) => {
      const autoShow = log.type === 'error' && config.get('displayIfErr')

      if (autoShow) container.showTool('console').show()
    })

    logger.on('select', (log) => {
      this._selectedLog = log
      $control.find(c('.icon-copy')).rmClass(c('icon-disabled'))
    })

    logger.on('deselect', () => {
      this._selectedLog = null
      $control.find(c('.icon-copy')).addClass(c('icon-disabled'))
    })

    container.on('show', this._handleShow)
  }
  _hideInput() {
    this._$inputContainer.rmClass(c('active'))
    this._$inputBtns.css('display', 'none')
  }
  _showInput() {
    this._$inputContainer.addClass(c('active'))
    this._$inputBtns.css('display', 'flex')
  }
  _rmCfg() {
    const cfg = this.config

    const settings = this._container.get('settings')
    if (!settings) return

    settings
      .remove(cfg, 'asyncRender')
      .remove(cfg, 'jsExecution')
      .remove(cfg, 'catchGlobalErr')
      .remove(cfg, 'overrideConsole')
      .remove(cfg, 'displayExtraInfo')
      .remove(cfg, 'displayUnenumerable')
      .remove(cfg, 'displayGetterVal')
      .remove(cfg, 'lazyEvaluation')
      .remove(cfg, 'displayIfErr')
      .remove(cfg, 'maxLogNum')
      .remove(upperFirst(this.name))
  }
  _initCfg() {
    const container = this._container

    const cfg = (this.config = Settings.createCfg(this.name, {
      asyncRender: true,
      catchGlobalErr: true,
      jsExecution: true,
      overrideConsole: true,
      displayExtraInfo: false,
      displayUnenumerable: true,
      displayGetterVal: true,
      lazyEvaluation: true,
      displayIfErr: false,
      maxLogNum: 'infinite',
    }))

    this._enableJsExecution(cfg.get('jsExecution'))
    if (cfg.get('catchGlobalErr')) this.catchGlobalErr()

    cfg.on('change', (key, val) => {
      const logger = this._logger
      switch (key) {
        case 'asyncRender':
          return logger.setOption('asyncRender', val)
        case 'jsExecution':
          return this._enableJsExecution(val)
        case 'catchGlobalErr':
          return val ? this.catchGlobalErr() : this.ignoreGlobalErr()
        case 'overrideConsole':
          return val ? this.overrideConsole() : this.restoreConsole()
        case 'maxLogNum':
          return logger.setOption('maxNum', val === 'infinite' ? 0 : +val)
        case 'displayExtraInfo':
          return logger.setOption('showHeader', val)
        case 'displayUnenumerable':
          return logger.setOption('unenumerable', val)
        case 'displayGetterVal':
          return logger.setOption('accessGetter', val)
        case 'lazyEvaluation':
          return logger.setOption('lazyEvaluation', val)
      }
    })

    const settings = container.get('settings')
    if (!settings) return

    settings
      .text(upperFirst(this.name))
      .switch(cfg, 'asyncRender', 'Asynchronous Rendering')
      .switch(cfg, 'jsExecution', 'Enable JavaScript Execution')
      .switch(cfg, 'catchGlobalErr', 'Catch Global Errors')
      .switch(cfg, 'overrideConsole', 'Override Console')
      .switch(cfg, 'displayIfErr', 'Auto Display If Error Occurs')
      .switch(cfg, 'displayExtraInfo', 'Display Extra Information')
      .switch(cfg, 'displayUnenumerable', 'Display Unenumerable Properties')
      .switch(cfg, 'displayGetterVal', 'Access Getter Value')
      .switch(cfg, 'lazyEvaluation', 'Lazy Evaluation')
      .select(cfg, 'maxLogNum', 'Max Log Number', [
        'infinite',
        '250',
        '125',
        '100',
        '50',
        '10',
      ])
      .separator()
  }
}

const CONSOLE_METHOD = [
  'log',
  'error',
  'info',
  'warn',
  'dir',
  'time',
  'timeLog',
  'timeEnd',
  'clear',
  'table',
  'assert',
  'count',
  'countReset',
  'debug',
  'group',
  'groupCollapsed',
  'groupEnd',
]
