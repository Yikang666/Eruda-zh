import Tool from '../DevTools/Tool'
import Highlight from './Highlight'
import Select from './Select'
import $ from 'licia/$'
import isEl from 'licia/isEl'
import nextTick from 'licia/nextTick'
import Emitter from 'licia/Emitter'
import map from 'licia/map'
import isEmpty from 'licia/isEmpty'
import toNum from 'licia/toNum'
import LunaDomViewer from 'luna-dom-viewer'
import { isErudaEl, classPrefix as c } from '../lib/util'
import evalCss from '../lib/evalCss'
import Detail from './Detail'
import { formatNodeName } from './util'

export default class Elements extends Tool {
  constructor() {
    super()

    this._style = evalCss(require('./Elements.scss'))

    this.name = 'elements'
    this._highlightElement = false
    this._selectElement = false
    this._observeElement = true
    this._history = []

    Emitter.mixin(this)
  }
  init($el, container) {
    super.init($el)

    this._container = container

    this._initTpl()
    this._htmlEl = document.documentElement
    this._detail = new Detail(this._$detail, container)
    this.config = this._detail.config
    this._domViewer = new LunaDomViewer(this._$domViewer.get(0), {
      node: this._htmlEl,
      ignore: (node) => isErudaEl(node),
    })
    this._domViewer.expand()
    this._highlight = new Highlight(this._container.$container)
    this._select = new Select()
    this._bindEvent()

    nextTick(() => this._updateHistory())
  }
  show() {
    super.show()

    if (!this._curNode) {
      this._setNode(document.body)
    }
  }
  // To be removed in 3.0.0
  set(node) {
    return this.select(node)
  }
  select(node) {
    this._setNode(node)
    this.emit('change', node)
    return this
  }
  destroy() {
    super.destroy()

    evalCss.remove(this._style)
    this._detail.destroy()
    this._select.disable()
    this._highlight.destroy()
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
      <div class="crumbs"></div>
      <div class="detail"></div>`)
    )

    this._$detail = $el.find(c('.detail'))
    this._$domViewer = $el.find(c('.dom-viewer'))
    this._$control = $el.find(c('.control'))
    this._$crumbs = $el.find(c('.crumbs'))
  }
  _renderCrumbs() {
    const crumbs = getCrumbs(this._curNode)
    let html = ''
    if (!isEmpty(crumbs)) {
      html = map(crumbs, ({ text, idx }) => {
        return `<li class="${c('crumb')}" data-idx="${idx}">${text}</div></li>`
      }).join('')
    }
    this._$crumbs.html(html)
  }
  _back() {
    if (this._curNode === this._htmlEl) return

    const parentQueue = this._curParentQueue
    let parent = parentQueue.shift()

    while (!isElExist(parent)) parent = parentQueue.shift()

    this.set(parent)
  }
  _bindEvent() {
    const self = this
    const select = this._select

    this._$el.on('click', c('.crumb'), function () {
      let idx = toNum($(this).data('idx'))
      let el = self._curNode

      while (idx-- && el.parentElement) {
        el = el.parentElement
      }

      if (isElExist(el)) {
        self.set(el)
      }
    })

    this._$control
      .on('click', c('.select'), () => this._toggleSelect())
      .on('click', c('.show'), () => this._detail.show(this._curNode))

    select.on('select', (target) => this.set(target))

    this._domViewer.on('select', this._setNode)
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
  _setNode = (node) => {
    if (node === this._curNode) return

    this._curNode = node
    this._domViewer.select(node)
    this._renderCrumbs()

    this._highlight.setEl(node)

    const parentQueue = []

    let parent = node.parentNode
    while (parent) {
      parentQueue.push(parent)
      parent = parent.parentNode
    }
    this._curParentQueue = parentQueue

    this._updateHistory()
  }
  _updateHistory() {
    const console = this._container.get('console')
    if (!console) return

    const history = this._history
    history.unshift(this._curNode)
    if (history.length > 5) history.pop()
    for (let i = 0; i < 5; i++) {
      console.setGlobal(`$${i}`, history[i])
    }
  }
}

const isElExist = (val) => isEl(val) && val.parentNode

function getCrumbs(el) {
  const ret = []
  let i = 0

  while (el) {
    ret.push({
      text: formatNodeName(el, { noAttr: true }),
      idx: i++,
    })

    el = el.parentElement
  }

  return ret.reverse()
}
