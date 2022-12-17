import Tool from '../DevTools/Tool'
import Highlight from './Highlight'
import Select from './Select'
import Settings from '../Settings/Settings'
import $ from 'licia/$'
import keys from 'licia/keys'
import MutationObserver from 'licia/MutationObserver'
import each from 'licia/each'
import isEl from 'licia/isEl'
import isFn from 'licia/isFn'
import isBool from 'licia/isBool'
import safeGet from 'licia/safeGet'
import nextTick from 'licia/nextTick'
import Emitter from 'licia/Emitter'
import isNull from 'licia/isNull'
import trim from 'licia/trim'
import LunaModal from 'luna-modal'
import LunaDomViewer from 'luna-dom-viewer'
import { isErudaEl, classPrefix as c } from '../lib/util'
import evalCss from '../lib/evalCss'
import Detail from './Detail'

export default class Elements extends Tool {
  constructor() {
    super()

    this._style = evalCss(require('./Elements.scss'))

    this.name = 'elements'
    this._rmDefComputedStyle = true
    this._highlightElement = false
    this._selectElement = false
    this._observeElement = true
    this._computedStyleSearchKeyword = ''
    this._history = []

    Emitter.mixin(this)
  }
  init($el, container) {
    super.init($el)

    this._container = container

    this._initTpl()
    this._htmlEl = document.documentElement
    this._detail = new Detail(this._$detail)
    this._domViewer = new LunaDomViewer(this._$domViewer.get(0), {
      node: this._htmlEl,
      ignore: (node) => isErudaEl(node),
    })
    this._domViewer.expand()
    this._highlight = new Highlight(this._container.$container)
    this._select = new Select()
    this._bindEvent()
    this._initObserver()
    this._initCfg()

    nextTick(() => this._updateHistory())
  }
  show() {
    super.show()

    if (this._observeElement) this._enableObserver()
    if (!this._curEl) this._setEl(this._htmlEl)
    this._render()
  }
  hide() {
    this._disableObserver()

    return super.hide()
  }
  set(e) {
    if (e === this._curEl) return

    this._setEl(e)
    this._render()
    this._updateHistory()

    this.emit('change', e)

    return this
  }
  overrideEventTarget() {
    const winEventProto = getWinEventProto()

    const origAddEvent = (this._origAddEvent = winEventProto.addEventListener)
    const origRmEvent = (this._origRmEvent = winEventProto.removeEventListener)

    winEventProto.addEventListener = function (type, listener, useCapture) {
      addEvent(this, type, listener, useCapture)
      origAddEvent.apply(this, arguments)
    }

    winEventProto.removeEventListener = function (type, listener, useCapture) {
      rmEvent(this, type, listener, useCapture)
      origRmEvent.apply(this, arguments)
    }
  }
  restoreEventTarget() {
    const winEventProto = getWinEventProto()

    if (this._origAddEvent) winEventProto.addEventListener = this._origAddEvent
    if (this._origRmEvent) winEventProto.removeEventListener = this._origRmEvent
  }
  destroy() {
    super.destroy()

    evalCss.remove(this._style)
    this._select.disable()
    this._highlight.destroy()
    this._disableObserver()
    this.restoreEventTarget()
    this._rmCfg()
  }
  _initTpl() {
    const $el = this._$el

    $el.html(
      c(`<div class="control">
      <span class="icon icon-select select"></span>
      <span class="icon icon-eye show"></span>
    </div>
    <div class="dom-viewer-container">
      <div class="dom-viewer"></div>
    </div>
    <div class="detail"></div>`)
    )

    this._$detail = $el.find(c('.detail'))
    this._$domViewer = $el.find(c('.dom-viewer'))
    this._$control = $el.find(c('.control'))
  }
  _back() {
    if (this._curEl === this._htmlEl) return

    const parentQueue = this._curParentQueue
    let parent = parentQueue.shift()

    while (!isElExist(parent)) parent = parentQueue.shift()

    this.set(parent)
  }
  _bindEvent() {
    const self = this
    const container = this._container
    const select = this._select

    this._$el
      .on('click', '.eruda-child', function () {
        const idx = $(this).data('idx')
        const curEl = self._curEl
        const el = curEl.childNodes[idx]

        if (el && el.nodeType === 3) {
          const curTagName = curEl.tagName
          let type

          switch (curTagName) {
            case 'SCRIPT':
              type = 'js'
              break
            case 'STYLE':
              type = 'css'
              break
            default:
              return
          }

          const sources = container.get('sources')

          if (sources) {
            sources.set(type, el.nodeValue)
            container.showTool('sources')
          }

          return
        }

        !isElExist(el) ? self._render() : self.set(el)
      })
      .on('click', '.eruda-listener-content', function () {
        const text = $(this).text()
        const sources = container.get('sources')

        if (sources) {
          sources.set('js', text)
          container.showTool('sources')
        }
      })
      .on('click', '.eruda-breadcrumb', () => {
        const sources = container.get('sources')

        if (sources) {
          sources.set('object', this._curEl)
          container.showTool('sources')
        }
      })
      .on('click', '.eruda-parent', function () {
        let idx = $(this).data('idx')
        const curEl = self._curEl
        let el = curEl.parentNode

        while (idx-- && el.parentNode) el = el.parentNode

        !isElExist(el) ? self._render() : self.set(el)
      })
      .on('click', '.eruda-toggle-all-computed-style', () =>
        this._toggleAllComputedStyle()
      )
      .on('click', '.eruda-computed-style-search', () => {
        LunaModal.prompt('Filter').then((filter) => {
          if (isNull(filter)) return
          filter = trim(filter)
          this._computedStyleSearchKeyword = filter
          this._render()
        })
      })

    this._$control
      .on('click', c('.select'), () => this._toggleSelect())
      .on('click', c('.show'), () => this._detail.show(this._curEl))

    select.on('select', (target) => this.set(target))
  }
  _toggleAllComputedStyle() {
    this._rmDefComputedStyle = !this._rmDefComputedStyle

    this._render()
  }
  _enableObserver() {
    this._observer.observe(this._htmlEl, {
      attributes: true,
      childList: true,
      subtree: true,
    })
  }
  _disableObserver() {
    this._observer.disconnect()
  }
  _toggleHighlight() {
    if (this._selectElement) return

    this._$el.find('.eruda-highlight').toggleClass('eruda-active')
    this._highlightElement = !this._highlightElement

    this._render()
  }
  _toggleSelect() {
    const select = this._select

    this._$el.find(c('.select')).toggleClass(c('active'))
    if (!this._selectElement && !this._highlightElement) {
      this._toggleHighlight()
    }
    this._selectElement = !this._selectElement

    if (this._selectElement) {
      select.enable()
    } else {
      select.disable()
    }
  }
  _setEl(el) {
    this._curEl = el
    this._domViewer.select(el)
    this._highlight.setEl(el)
    this._rmDefComputedStyle = true

    const parentQueue = []

    let parent = el.parentNode
    while (parent) {
      parentQueue.push(parent)
      parent = parent.parentNode
    }
    this._curParentQueue = parentQueue
  }
  _render() {
    if (!isElExist(this._curEl)) return this._back()

    this._highlight[this._highlightElement ? 'show' : 'hide']()
  }
  _renderHtml(html) {
    if (html === this._lastHtml) return
    this._lastHtml = html
    this._$showArea.html(html)
  }
  _updateHistory() {
    const console = this._container.get('console')
    if (!console) return

    const history = this._history
    history.unshift(this._curEl)
    if (history.length > 5) history.pop()
    for (let i = 0; i < 5; i++) {
      console.setGlobal(`$${i}`, history[i])
    }
  }
  _initObserver() {
    this._observer = new MutationObserver((mutations) => {
      each(mutations, (mutation) => this._handleMutation(mutation))
    })
  }
  _handleMutation(mutation) {
    let i, len, node

    if (isErudaEl(mutation.target)) return

    if (mutation.type === 'attributes') {
      if (mutation.target !== this._curEl) return
      this._render()
    } else if (mutation.type === 'childList') {
      if (mutation.target === this._curEl) return this._render()

      const addedNodes = mutation.addedNodes

      for (i = 0, len = addedNodes.length; i < len; i++) {
        node = addedNodes[i]

        if (node.parentNode === this._curEl) return this._render()
      }

      const removedNodes = mutation.removedNodes

      for (i = 0, len = removedNodes.length; i < len; i++) {
        if (removedNodes[i] === this._curEl) return this.set(this._htmlEl)
      }
    }
  }
  _rmCfg() {
    const cfg = this.config

    const settings = this._container.get('settings')

    if (!settings) return

    settings
      .remove(cfg, 'overrideEventTarget')
      .remove(cfg, 'observeElement')
      .remove('Elements')
  }
  _initCfg() {
    const cfg = (this.config = Settings.createCfg('elements', {
      overrideEventTarget: true,
      observeElement: true,
    }))

    if (cfg.get('overrideEventTarget')) this.overrideEventTarget()
    if (cfg.get('observeElement')) this._observeElement = false

    cfg.on('change', (key, val) => {
      switch (key) {
        case 'overrideEventTarget':
          return val ? this.overrideEventTarget() : this.restoreEventTarget()
        case 'observeElement':
          this._observeElement = val
          return val ? this._enableObserver() : this._disableObserver()
      }
    })

    const settings = this._container.get('settings')
    if (!settings) return

    settings
      .text('Elements')
      .switch(cfg, 'overrideEventTarget', 'Catch Event Listeners')

    if (this._observer) settings.switch(cfg, 'observeElement', 'Auto Refresh')

    settings.separator()
  }
}

function addEvent(el, type, listener, useCapture = false) {
  if (!isEl(el) || !isFn(listener) || !isBool(useCapture)) return

  const events = (el.erudaEvents = el.erudaEvents || {})

  events[type] = events[type] || []
  events[type].push({
    listener: listener,
    listenerStr: listener.toString(),
    useCapture: useCapture,
  })
}

function rmEvent(el, type, listener, useCapture = false) {
  if (!isEl(el) || !isFn(listener) || !isBool(useCapture)) return

  const events = el.erudaEvents

  if (!(events && events[type])) return

  const listeners = events[type]

  for (let i = 0, len = listeners.length; i < len; i++) {
    if (listeners[i].listener === listener) {
      listeners.splice(i, 1)
      break
    }
  }

  if (listeners.length === 0) delete events[type]
  if (keys(events).length === 0) delete el.erudaEvents
}

const getWinEventProto = () => {
  return safeGet(window, 'EventTarget.prototype') || window.Node.prototype
}

const isElExist = (val) => isEl(val) && val.parentNode
