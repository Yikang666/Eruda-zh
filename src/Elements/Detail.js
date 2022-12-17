import isEmpty from 'licia/isEmpty'
import lowerCase from 'licia/lowerCase'
import pick from 'licia/pick'
import toStr from 'licia/toStr'
import map from 'licia/map'
import escape from 'licia/escape'
import startWith from 'licia/startWith'
import contain from 'licia/contain'
import unique from 'licia/unique'
import isStr from 'licia/isStr'
import isNaN from 'licia/isNaN'
import isNum from 'licia/isNum'
import each from 'licia/each'
import keys from 'licia/keys'
import CssStore from './CssStore'
import { pxToNum, classPrefix as c } from '../lib/util'

export default class Detail {
  constructor($container) {
    this._$container = $container
    this._bindEvent()
  }
  show(el) {
    const data = this._getData(el)

    let parents = ''
    if (!isEmpty(data.parents)) {
      parents = `<ul class="${c('parents')}">
        ${map(data.parents, ({ text, idx }) => {
          return `<li>
            <div class="${c('parent')}" data-idx="${idx}">${text}</div>
            <span class="${c('icon-arrow-right')}"></span>
          </li>`
        }).join('')}
      </ul>`
    }

    let children = ''
    if (data.children) {
      children = `<ul class="${c('children')}">
        ${map(data.children, ({ isCmt, idx, isEl, text }) => {
          return `<li class="${c(
            `child ${isCmt ? 'green' : ''} ${isEl ? 'active-effect' : ''}`
          )}" data-idx="${idx}">${text}</li>`
        }).join('')}
      </ul>`
    }

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

    const html = `${parents}
    <div class="${c('breadcrumb')}">
      ${data.name}
    </div>
    ${children}
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
    ret.parents = getParents(el)
    ret.children = formatChildNodes(el.childNodes)
    ret.attributes = formatAttr(attributes)
    ret.name = formatElName({ tagName, id, className, attributes })

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
  _bindEvent() {}
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

function formatChildNodes(nodes) {
  const ret = []

  for (let i = 0, len = nodes.length; i < len; i++) {
    const child = nodes[i]
    const nodeType = child.nodeType

    if (nodeType === 3 || nodeType === 8) {
      const val = child.nodeValue.trim()
      if (val !== '')
        ret.push({
          text: val,
          isCmt: nodeType === 8,
          idx: i,
        })
      continue
    }

    const isSvg = !isStr(child.className)

    if (
      nodeType === 1 &&
      child.id !== 'eruda' &&
      (isSvg || child.className.indexOf('eruda') < 0)
    ) {
      ret.push({
        text: formatElName(child),
        isEl: true,
        idx: i,
      })
    }
  }

  return ret
}

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

function formatElName(data, { noAttr = false } = {}) {
  const { id, className, attributes } = data

  let ret = `<span class="eruda-tag-name-color">${data.tagName.toLowerCase()}</span>`

  if (id !== '') ret += `<span class="eruda-function-color">#${id}</span>`

  if (isStr(className)) {
    let classes = ''
    each(className.split(/\s+/g), (val) => {
      if (val.trim() === '') return
      classes += `.${val}`
    })
    ret += `<span class="eruda-attribute-name-color">${classes}</span>`
  }

  if (!noAttr) {
    each(attributes, (attr) => {
      const name = attr.name
      if (name === 'id' || name === 'class' || name === 'style') return
      ret += ` <span class="eruda-attribute-name-color">${name}</span><span class="eruda-operator-color">="</span><span class="eruda-string-color">${attr.value}</span><span class="eruda-operator-color">"</span>`
    })
  }

  return ret
}

function getParents(el) {
  const ret = []
  let i = 0
  let parent = el.parentNode

  while (parent && parent.nodeType === 1) {
    ret.push({
      text: formatElName(parent, { noAttr: true }),
      idx: i++,
    })

    parent = parent.parentNode
  }

  return ret.reverse()
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
