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
      let $this = $(this)
      if ($this.text().toLowerCase() === name.toLowerCase()) $this.remove()
    })
    this._resetBottomBar()
  }
  setHeight(height) {
    this._height = height
    this.resetStyle()
  }
  setBgColor(color) {
    this._$el.css('background-color', color)
  }
  activateTool(name) {
    let self = this

    this._$el.find('.eruda-nav-bar-item').each(function() {
      let $this = $(this)

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
    let $el = this._$el,
      li = $el.find('.eruda-active').get(0),
      container = $el.get(0)

    let itemLeft = li.offsetLeft,
      itemWidth = li.offsetWidth,
      containerWidth = container.offsetWidth,
      scrollLeft = container.scrollLeft,
      targetScrollLeft

    if (itemLeft < scrollLeft) {
      targetScrollLeft = itemLeft
    } else if (itemLeft + itemWidth > containerWidth + scrollLeft) {
      targetScrollLeft = itemLeft + itemWidth - containerWidth
    }

    if (!isNum(targetScrollLeft)) return

    container.scrollLeft = targetScrollLeft
  }
  _resetBottomBar() {
    let $bottomBar = this._$bottomBar

    let li = this._$el.find('.eruda-active').get(0)

    if (!li) return

    $bottomBar.css({
      width: li.offsetWidth,
      left: li.offsetLeft
    })
  }
  resetStyle() {
    let height = this._height

    this._$el.css('height', height)

    let $el = this._$el

    $el.css({
      height: height
    })
    $el.find('.eruda-nav-bar-item').css({
      height: height,
      lineHeight: height
    })

    this._resetBottomBar()
  }
  _bindEvent() {
    let self = this

    this._$el.on('click', '.eruda-nav-bar-item', function() {
      self.emit('showTool', $(this).text())
    })
  }
}
