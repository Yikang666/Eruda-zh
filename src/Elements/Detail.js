import isEmpty from 'licia/isEmpty'
import lowerCase from 'licia/lowerCase'
import pick from 'licia/pick'
import toStr from 'licia/toStr'
import map from 'licia/map'
import isEl from 'licia/isEl'
import escape from 'licia/escape'
import startWith from 'licia/startWith'
import contain from 'licia/contain'
import unique from 'licia/unique'
import isStr from 'licia/isStr'
import isNaN from 'licia/isNaN'
import isNum from 'licia/isNum'
import each from 'licia/each'
import keys from 'licia/keys'
import isNull from 'licia/isNull'
import trim from 'licia/trim'
import isFn from 'licia/isFn'
import isBool from 'licia/isBool'
import safeGet from 'licia/safeGet'
import $ from 'licia/$'
import MutationObserver from 'licia/MutationObserver'
import CssStore from './CssStore'
import Settings from '../Settings/Settings'
import LunaModal from 'luna-modal'
import chobitsu from '../lib/chobitsu'
import { formatNodeName } from './util'
import { pxToNum, isErudaEl, classPrefix as c } from '../lib/util'

export default class Detail {
  constructor($container, devtools) {
    this._$container = $container
    this._devtools = devtools
    this._curEl = document.documentElement
    this._bindEvent()
    this._initObserver()
    this._initCfg()
  }
  show(el) {
    this._curEl = el
    this._rmDefComputedStyle = true
    this._computedStyleSearchKeyword = ''
    this._enableObserver()
    this._render()

    const { nodeId } = chobitsu.domain('DOM').getNodeId({ node: el })
    chobitsu.domain('Overlay').highlightNode({
      nodeId,
      highlightConfig: {
        showInfo: true,
        contentColor: 'rgba(111, 168, 220, .66)',
        paddingColor: 'rgba(147, 196, 125, .55)',
        borderColor: 'rgba(255, 229, 153, .66)',
        marginColor: 'rgba(246, 178, 107, .66)',
      },
    })
  }
  hide = () => {
    this._$container.hide()
    this._disableObserver()
    chobitsu.domain('Overlay').hideHighlight()
  }
  destroy() {
    this._disableObserver()
    this.restoreEventTarget()
    this._rmCfg()
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
  _toggleAllComputedStyle() {
    this._rmDefComputedStyle = !this._rmDefComputedStyle

    this._render()
  }
  _render() {
    const data = this._getData(this._curEl)

    let attribute = '<tr><td>Empty</td></tr>'
    if (!isEmpty(data.attributes)) {
      attribute = map(data.attributes, ({ name, value }) => {
        return `<tr>
          <td class="${c('attribute-name-color')}">${escape(name)}</td>
          <td class="${c('string-color')}">${value}</td>
        </tr>`
      }).join('')
    }
    attribute = `<div class="${c('attributes section')}">
      <h2>Attributes</h2>
      <div class="${c('table-wrapper')}">
        <table>
          <tbody>
            ${attribute} 
          </tbody>
        </table>
      </div>
    </div>`

    let styles = ''
    if (!isEmpty(data.styles)) {
      const style = map(data.styles, ({ selectorText, style }) => {
        style = map(style, (val, key) => {
          return `<div class="${c('rule')}"><span>${escape(
            key
          )}</span>: ${val};</div>`
        }).join('')
        return `<div class="${c('style-rules')}">
          <div>${escape(selectorText)} {</div>
            ${style}
          <div>}</div>
        </div>`
      }).join('')
      styles = `<div class="${c('styles section')}">
        <h2>Styles</h2>
        <div class="${c('style-wrapper')}">
          ${style}
        </div>
      </div>`
    }

    let computedStyle = ''
    if (data.computedStyle) {
      let toggleButton = c(`<div class="btn toggle-all-computed-style">
        <span class="icon-expand"></span>
      </div>`)
      if (data.rmDefComputedStyle) {
        toggleButton = c(`<div class="btn toggle-all-computed-style">
          <span class="icon-compress"></span>
        </div>`)
      }

      const boxModel = data.boxModel
      // prettier-ignore
      const boxModelHtml = [`<div class="${c('box-model')}">`,
        boxModel.position ? `<div class="${c('position')}">` : '',
          boxModel.position ? `<div class="${c('label')}">position</div><div class="${c('top')}">${boxModel.position.top}</div><br><div class="${c('left')}">${boxModel.position.left}</div>` : '',
          `<div class="${c('margin')}">`,
            `<div class="${c('label')}">margin</div><div class="${c('top')}">${boxModel.margin.top}</div><br><div class="${c('left')}">${boxModel.margin.left}</div>`,
            `<div class="${c('border')}">`,
              `<div class="${c('label')}">border</div><div class="${c('top')}">${boxModel.border.top}</div><br><div class="${c('left')}">${boxModel.border.left}</div>`,
              `<div class="${c('padding')}">`,
                `<div class="${c('label')}">padding</div><div class="${c('top')}">${boxModel.padding.top}</div><br><div class="${c('left')}">${boxModel.padding.left}</div>`,
                `<div class="${c('content')}">`,
                  `<span>${boxModel.content.width}</span>&nbsp;×&nbsp;<span>${boxModel.content.height}</span>`,
                '</div>',
                `<div class="${c('right')}">${boxModel.padding.right}</div><br><div class="${c('bottom')}">${boxModel.padding.bottom}</div>`,
              '</div>',
              `<div class="${c('right')}">${boxModel.border.right}</div><br><div class="${c('bottom')}">${boxModel.border.bottom}</div>`,
            '</div>',
            `<div class="${c('right')}">${boxModel.margin.right}</div><br><div class="${c('bottom')}">${boxModel.margin.bottom}</div>`,
          '</div>',
          boxModel.position ? `<div class="${c('right')}">${boxModel.position.right}</div><br><div class="${c('bottom')}">${boxModel.position.bottom}</div>` : '',
        boxModel.position ? '</div>' : '',
      '</div>'].join('')

      computedStyle = `<div class="${c('computed-style section')}">
        <h2>
          Computed Style
          ${toggleButton}
          <div class="${c('btn computed-style-search')}">
            <span class="${c('icon-filter')}"></span>
          </div>
          ${
            data.computedStyleSearchKeyword
              ? `<div class="${c('btn search-keyword')}">${escape(
                  data.computedStyleSearchKeyword
                )}</div>`
              : ''
          }
        </h2>
        ${boxModelHtml}
        <div class="${c('table-wrapper')}">
          <table>
            <tbody>
            ${map(data.computedStyle, (val, key) => {
              return `<tr>
                <td class="${c('key')}">${escape(key)}</td>
                <td>${val}</td>
              </tr>`
            }).join('')}
            </tbody>
          </table>
        </div>
      </div>`
    }

    let listeners = ''
    if (data.listeners) {
      listeners = map(data.listeners, (listeners, key) => {
        listeners = map(listeners, ({ useCapture, listenerStr }) => {
          return `<li ${useCapture ? `class="${c('capture')}"` : ''}>${escape(
            listenerStr
          )}</li>`
        }).join('')
        return `<div class="${c('listener')}">
          <div class="${c('listener-type')}">${escape(key)}</div>
          <ul class="${c('listener-content')}">
            ${listeners}
          </ul>
        </div>`
      }).join('')
      listeners = `<div class="${c('listeners section')}">
        <h2>Event Listeners</h2>
        <div class="${c('listener-wrapper')}">
          ${listeners} 
        </div>
      </div>`
    }

    const html = `<div class="${c('control')}">
      <span class="${c('icon-arrow-left back')}"></span>
      <span class="${c('element-name')}">${data.name}</span>
      <span class="${c('icon-refresh refresh')}"></span>
    </div>
    ${attribute}
    ${styles}
    ${computedStyle}
    ${listeners}`

    this._$container.html(html).show()
  }
  _getData(el) {
    const ret = {}

    const cssStore = new CssStore(el)

    const { className, id, attributes, tagName } = el

    ret.computedStyleSearchKeyword = this._computedStyleSearchKeyword
    ret.attributes = formatAttr(attributes)
    ret.name = formatNodeName({ tagName, id, className, attributes })

    const events = el.erudaEvents
    if (events && keys(events).length !== 0) ret.listeners = events

    if (needNoStyle(tagName)) return ret

    let computedStyle = cssStore.getComputedStyle()

    function getBoxModelValue(type) {
      let keys = ['top', 'left', 'right', 'bottom']
      if (type !== 'position') keys = map(keys, (key) => `${type}-${key}`)
      if (type === 'border') keys = map(keys, (key) => `${key}-width`)

      return {
        top: boxModelValue(computedStyle[keys[0]], type),
        left: boxModelValue(computedStyle[keys[1]], type),
        right: boxModelValue(computedStyle[keys[2]], type),
        bottom: boxModelValue(computedStyle[keys[3]], type),
      }
    }

    const boxModel = {
      margin: getBoxModelValue('margin'),
      border: getBoxModelValue('border'),
      padding: getBoxModelValue('padding'),
      content: {
        width: boxModelValue(computedStyle['width']),
        height: boxModelValue(computedStyle['height']),
      },
    }

    if (computedStyle['position'] !== 'static') {
      boxModel.position = getBoxModelValue('position')
    }
    ret.boxModel = boxModel

    const styles = cssStore.getMatchedCSSRules()
    styles.unshift(getInlineStyle(el.style))
    styles.forEach((style) => processStyleRules(style.style))
    ret.styles = styles

    if (this._rmDefComputedStyle) {
      computedStyle = rmDefComputedStyle(computedStyle, styles)
    }
    ret.rmDefComputedStyle = this._rmDefComputedStyle
    const computedStyleSearchKeyword = lowerCase(ret.computedStyleSearchKeyword)
    if (computedStyleSearchKeyword) {
      computedStyle = pick(computedStyle, (val, property) => {
        return (
          contain(property, computedStyleSearchKeyword) ||
          contain(val, computedStyleSearchKeyword)
        )
      })
    }
    processStyleRules(computedStyle)
    ret.computedStyle = computedStyle

    return ret
  }
  _bindEvent() {
    const devtools = this._devtools

    this._$container
      .on('click', c('.toggle-all-computed-style'), () =>
        this._toggleAllComputedStyle()
      )
      .on('click', c('.computed-style-search'), () => {
        LunaModal.prompt('Filter').then((filter) => {
          if (isNull(filter)) return
          filter = trim(filter)
          this._computedStyleSearchKeyword = filter
          this._render()
        })
      })
      .on('click', '.eruda-listener-content', function () {
        const text = $(this).text()
        const sources = devtools.get('sources')

        if (sources) {
          sources.set('js', text)
          devtools.showTool('sources')
        }
      })
      .on('click', c('.element-name'), () => {
        const sources = devtools.get('sources')

        if (sources) {
          sources.set('object', this._curEl)
          devtools.showTool('sources')
        }
      })
      .on('click', c('.back'), this.hide)
      .on('click', c('.refresh'), () => {
        this._render()
        devtools.notify('Refreshed')
      })
  }
  _initObserver() {
    this._observer = new MutationObserver((mutations) => {
      each(mutations, (mutation) => this._handleMutation(mutation))
    })
  }
  _enableObserver() {
    this._observer.observe(document.documentElement, {
      attributes: true,
      childList: true,
      subtree: true,
    })
  }
  _disableObserver() {
    this._observer.disconnect()
  }
  _handleMutation(mutation) {
    if (isErudaEl(mutation.target)) return

    if (mutation.type === 'attributes') {
      if (mutation.target !== this._curEl) return
      this._render()
    }
  }
  _rmCfg() {
    const cfg = this.config

    const settings = this._devtools.get('settings')

    if (!settings) return

    settings
      .remove(cfg, 'overrideEventTarget')
      .remove(cfg, 'observeElement')
      .remove('Elements')
  }
  _initCfg() {
    const cfg = (this.config = Settings.createCfg('elements', {
      overrideEventTarget: true,
    }))

    if (cfg.get('overrideEventTarget')) this.overrideEventTarget()

    cfg.on('change', (key, val) => {
      switch (key) {
        case 'overrideEventTarget':
          return val ? this.overrideEventTarget() : this.restoreEventTarget()
      }
    })

    const settings = this._devtools.get('settings')
    if (!settings) return

    settings
      .text('Elements')
      .switch(cfg, 'overrideEventTarget', 'Catch Event Listeners')

    settings.separator()
  }
}

function processStyleRules(style) {
  each(style, (val, key) => (style[key] = processStyleRule(val)))
}

const formatAttr = (attributes) =>
  map(attributes, (attr) => {
    let { value } = attr
    const { name } = attr
    value = escape(value)

    const isLink =
      (name === 'src' || name === 'href') && !startWith(value, 'data')
    if (isLink) value = wrapLink(value)
    if (name === 'style') value = processStyleRule(value)

    return { name, value }
  })

const regColor = /rgba?\((.*?)\)/g
const regCssUrl = /url\("?(.*?)"?\)/g

function processStyleRule(val) {
  // For css custom properties, val is unable to retrieved.
  val = toStr(val)

  return val
    .replace(
      regColor,
      '<span class="eruda-style-color" style="background-color: $&"></span>$&'
    )
    .replace(regCssUrl, (match, url) => `url("${wrapLink(url)}")`)
}

function getInlineStyle(style) {
  const ret = {
    selectorText: 'element.style',
    style: {},
  }

  for (let i = 0, len = style.length; i < len; i++) {
    const s = style[i]

    ret.style[s] = style[s]
  }

  return ret
}

function rmDefComputedStyle(computedStyle, styles) {
  const ret = {}

  let keepStyles = ['display', 'width', 'height']
  each(styles, (style) => {
    keepStyles = keepStyles.concat(keys(style.style))
  })
  keepStyles = unique(keepStyles)

  each(computedStyle, (val, key) => {
    if (!contain(keepStyles, key)) return

    ret[key] = val
  })

  return ret
}

const NO_STYLE_TAG = ['script', 'style', 'meta', 'title', 'link', 'head']

const needNoStyle = (tagName) =>
  NO_STYLE_TAG.indexOf(tagName.toLowerCase()) > -1

const wrapLink = (link) => `<a href="${link}" target="_blank">${link}</a>`

function boxModelValue(val, type) {
  if (isNum(val)) return val

  if (!isStr(val)) return '‒'

  const ret = pxToNum(val)
  if (isNaN(ret)) return val

  if (type === 'position') return ret

  return ret === 0 ? '‒' : ret
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
