import { Emitter, evalCss, $, isNum } from '../lib/util'

export default class NavBar extends Emitter {
  constructor($el) {
    super()

    this._style = evalCss(require('./NavBar.scss'))

    this._$el = $el
    $el.html('<div class="eruda-bottom-bar"></div>')
    this._$bottomBar = $el.find('.eruda-bottom-bar')
    this._len = 0
    this._height = 55

    this._bindEvent()
  }
  add(name) {
    this._len++
    this._$el.prepend(`<div class="eruda-nav-bar-item">${name}</div>`)
    this.resetStyle()
  }
  remove(name) {
    this._len--
    this._$el.find('.eruda-nav-bar-item').each(function() {
      const $this = $(this)
      if ($this.text().toLowerCase() === name.toLowerCase()) $this.remove()
    })
    this._resetBottomBar()
  }
  setHeight(height) {
    this._height = height
    this.resetStyle()
  }
  activateTool(name) {
    const self = this

    this._$el.find('.eruda-nav-bar-item').each(function() {
      const $this = $(this)

      if ($this.text() === name) {
        $this.addClass('eruda-active')
        self._resetBottomBar()
        self._scrollItemToView()
      } else {
        $this.rmClass('eruda-active')
      }
    })
  }
  destroy() {
    evalCss.remove(this._style)
    this._$el.remove()
  }
  _scrollItemToView() {
    const $el = this._$el
    const li = $el.find('.eruda-active').get(0)
    const container = $el.get(0)

    const itemLeft = li.offsetLeft
    const itemWidth = li.offsetWidth
    const containerWidth = container.offsetWidth
    const scrollLeft = container.scrollLeft
    let targetScrollLeft

    if (itemLeft < scrollLeft) {
      targetScrollLeft = itemLeft
    } else if (itemLeft + itemWidth > containerWidth + scrollLeft) {
      targetScrollLeft = itemLeft + itemWidth - containerWidth
    }

    if (!isNum(targetScrollLeft)) return

    container.scrollLeft = targetScrollLeft
  }
  _resetBottomBar() {
    const $bottomBar = this._$bottomBar

    const li = this._$el.find('.eruda-active').get(0)

    if (!li) return

    $bottomBar.css({
      width: li.offsetWidth,
      left: li.offsetLeft
    })
  }
  resetStyle() {
    const height = this._height

    this._$el.css('height', height)

    const $el = this._$el

    $el.css({
      height: height + 2
    })
    $el.find('.eruda-nav-bar-item').css({
      height: height,
      lineHeight: height
    })

    this._resetBottomBar()
  }
  _bindEvent() {
    const self = this

    this._$el.on('click', '.eruda-nav-bar-item', function() {
      self.emit('showTool', $(this).text())
    })
  }
}
