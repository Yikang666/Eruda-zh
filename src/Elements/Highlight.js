import { $, pxToNum, isStr, each, trim } from '../lib/util'
import evalCss from '../lib/evalCss'

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

    const bl = getNumStyle('border-left-width')
    const br = getNumStyle('border-right-width')
    const bt = getNumStyle('border-top-width')
    const bb = getNumStyle('border-bottom-width')

    const pl = getNumStyle('padding-left')
    const pr = getNumStyle('padding-right')
    const pt = getNumStyle('padding-top')
    const pb = getNumStyle('padding-bottom')

    const pw = width - bl - br
    const ph = height - bt - bb

    const marginColor = 'rgba(246, 178, 107, 0.66)'
    const borderColor = 'rgba(255, 229, 153, 0.66)'
    const paddingColor = 'rgba(147, 196, 125, 0.55)'
    const contentColor = 'rgba(111, 168, 220, 0.66)'

    this._$margin.css({
      left: -ml,
      top: -mt,
      width: width + ml + mr,
      height: height + mt + mb,
      borderTop: `${mt}px solid ${marginColor}`,
      borderLeft: `${ml}px solid ${marginColor}`,
      borderRight: `${mr}px solid ${marginColor}`,
      borderBottom: `${mb}px solid ${marginColor}`
    })

    this._$border.css({
      left: 0,
      top: 0,
      width,
      height,
      borderTop: `${bt}px solid ${borderColor}`,
      borderLeft: `${bl}px solid ${borderColor}`,
      borderRight: `${br}px solid ${borderColor}`,
      borderBottom: `${bb}px solid ${borderColor}`
    })

    this._$padding.css({
      left: bl,
      top: bt,
      width: pw,
      height: ph,
      borderTop: `${pt}px solid ${paddingColor}`,
      borderLeft: `${pl}px solid ${paddingColor}`,
      borderRight: `${pr}px solid ${paddingColor}`,
      borderBottom: `${pb}px solid ${paddingColor}`
    })

    this._$content.css({
      left: bl + pl,
      top: bt + pt,
      width: pw - pl - pr,
      height: ph - pt - pb,
      background: contentColor
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
    this._$border = $el.find('.eruda-border')
    this._$size = $el.find('.eruda-size')
  }
}

function formatElName(el) {
  const { id, className } = el

  let ret = `<span style="color:#881280;">${el.tagName.toLowerCase()}</span>`

  if (id !== '') ret += `<span style="color:1a1aa8;">#${id}</span>`

  let classes = ''
  if (isStr(className)) {
    each(className.split(/\s+/g), val => {
      if (trim(val) === '') return

      classes += `.${val}`
    })
  }

  ret += `<span style="color:1a1aa8;">${classes}</span>`

  return ret
}
