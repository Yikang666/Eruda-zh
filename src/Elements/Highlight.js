import { evalCss, $, pxToNum, isStr, each, trim } from '../lib/util'

export default class Highlight {
  constructor($container) {
    this._style = evalCss(require('./Highlight.scss'))

    this._isShow = false

    this._appendTpl($container)
    this._bindEvent()
  }
  setEl(el) {
    this._$target = $(el)
    this._target = el
  }
  show() {
    this._isShow = true
    this.render()
    this._$el.show()
  }
  destroy() {
    evalCss.remove(this._style)
  }
  hide() {
    this._isShow = false
    this._$el.hide()
  }
  render() {
    const { left, width, top, height } = this._$target.offset()

    this._$el.css({ left, top: top - window.scrollY, width, height })

    const computedStyle = getComputedStyle(this._target, '')

    if (computedStyle.display === 'none') {
      return this._$el.css('visibility', 'hidden')
    } else {
      this._$el.css('visibility', 'visible')
    }

    const getNumStyle = name => pxToNum(computedStyle.getPropertyValue(name))

    const ml = getNumStyle('margin-left')
    const mr = getNumStyle('margin-right')
    const mt = getNumStyle('margin-top')
    const mb = getNumStyle('margin-bottom')

    this._$margin.css({
      left: -ml,
      top: -mt,
      width: width + ml + mr,
      height: height + mt + mb
    })

    const bl = getNumStyle('border-left-width')
    const br = getNumStyle('border-right-width')
    const bt = getNumStyle('border-top-width')
    const bb = getNumStyle('border-bottom-width')

    const bw = width - bl - br
    const bh = height - bt - bb

    this._$padding.css({
      left: bl,
      top: bt,
      width: bw,
      height: bh
    })

    const pl = getNumStyle('padding-left')
    const pr = getNumStyle('padding-right')
    const pt = getNumStyle('padding-top')
    const pb = getNumStyle('padding-bottom')

    this._$content.css({
      left: bl + pl,
      top: bl + pt,
      width: bw - pl - pr,
      height: bh - pt - pb
    })

    this._$size
      .css({
        top: -mt - (top - mt < 25 ? 0 : 25),
        left: -ml
      })
      .html(`${formatElName(this._target)} | ${width} × ${height}`)
  }
  _bindEvent() {
    window.addEventListener(
      'scroll',
      () => {
        if (!this._isShow) return
        this.render()
      },
      false
    )
  }
  _appendTpl($container) {
    $container.append(require('./Highlight.hbs')())

    const $el = (this._$el = $container.find('.eruda-elements-highlight'))
    this._$margin = $el.find('.eruda-margin')
    this._$padding = $el.find('.eruda-padding')
    this._$content = $el.find('.eruda-content')
    this._$size = $el.find('.eruda-size')
  }
}

function formatElName(el) {
  const { id, className } = el

  let ret = `<span style="color:#ee78e6">${el.tagName.toLowerCase()}</span>`

  if (id !== '') ret += `<span style="color:#ffab66">#${id}</span>`

  let classes = ''
  if (isStr(className)) {
    each(className.split(/\s+/g), val => {
      if (trim(val) === '') return

      classes += `.${val}`
    })
  }

  ret += `<span style="color:#8ed3fb">${classes}</span>`

  return ret
}
