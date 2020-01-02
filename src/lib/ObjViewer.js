import {
  Emitter,
  getProto,
  isNum,
  isBool,
  lowerCase,
  isObj,
  upperFirst,
  keys,
  each,
  toSrc,
  isPromise,
  type,
  $,
  difference,
  allKeys,
  filter
} from './util'
import { encode, getFnAbstract, sortObjName } from './JsonViewer'
import evalCss from './evalCss'

let hasEvalCss = false

export default class ObjViewer extends Emitter {
  constructor(
    data,
    $el,
    { showUnenumerable = false, showGetterVal = false } = {}
  ) {
    super()

    if (!hasEvalCss) {
      evalCss(require('./json.scss'))
      hasEvalCss = true
    }

    this._data = [data]
    this._$el = $el
    this._visitor = new Visitor()
    this._map = {}
    this._showUnenumerable = showUnenumerable
    this._showGetterVal = showGetterVal

    this._appendTpl()
    this._bindEvent()
  }
  _objToHtml(data, firstLevel) {
    let ret = ''

    const types = ['enumerable']
    const enumerableKeys = keys(data)
    let unenumerableKeys = []
    let symbolKeys = []

    if (this._showUnenumerable && !firstLevel) {
      types.push('unenumerable')
      types.push('symbol')
      unenumerableKeys = difference(
        allKeys(data, {
          prototype: false,
          unenumerable: true
        }),
        enumerableKeys
      )
      symbolKeys = filter(
        allKeys(data, {
          prototype: false,
          symbol: true
        }),
        key => {
          return typeof key === 'symbol'
        }
      )
    }

    each(['enumerable', 'unenumerable', 'symbol'], type => {
      let typeKeys = []
      if (type === 'symbol') {
        typeKeys = symbolKeys
      } else if (type === 'unenumerable') {
        typeKeys = unenumerableKeys
      } else {
        typeKeys = enumerableKeys
      }
      typeKeys.sort(sortObjName)
      for (let i = 0, len = typeKeys.length; i < len; i++) {
        const key = typeKeys[i]
        let val = ''
        try {
          val = data[key]
          if (isPromise(val)) {
            val.catch(() => {})
          }
        } catch (e) {
          val = e.message
        }
        ret += this._createEl(key, val, type, firstLevel)
      }
    })

    const proto = getProto(data)
    if (!firstLevel && proto) {
      if (ret === '') {
        ret = this._objToHtml(proto)
      } else {
        ret += this._createEl('__proto__', proto, 'proto')
      }
    }

    return ret
  }
  _createEl(key, val, keyType, firstLevel = false) {
    const visitor = this._visitor
    let t = typeof val
    const valType = type(val, false)

    if (val === null) {
      return `<li>${wrapKey(key)}<span class="eruda-null">null</span></li>`
    } else if (isNum(val) || isBool(val)) {
      return `<li>${wrapKey(key)}<span class="eruda-${t}">${encode(
        val
      )}</span></li>`
    }

    if (valType === 'RegExp') t = 'regexp'
    if (valType === 'Number') t = 'number'

    if (valType === 'Number' || valType === 'RegExp') {
      return `<li>${wrapKey(key)}<span class="eruda-${t}">${encode(
        val.value
      )}</span></li>`
    } else if (valType === 'Undefined' || valType === 'Symbol') {
      return `<li>${wrapKey(key)}<span class="eruda-special">${lowerCase(
        valType
      )}</span></li>`
    } else if (val === '(...)') {
      return `<li>${wrapKey(key)}<span class="eruda-special">${val}</span></li>`
    } else if (isObj(val)) {
      const visitedObj = visitor.get(val)
      let id
      if (visitedObj) {
        id = visitedObj.id
      } else {
        id = visitor.set(val)
        this._map[id] = val
      }
      const objAbstract = getObjAbstract(val, valType) || upperFirst(t)

      let obj = `<li ${
        firstLevel ? 'data-first-level="true"' : ''
      } ${'data-object-id="' + id + '"'}>
                            <span class="${
                              firstLevel ? '' : 'eruda-expanded eruda-collapsed'
                            }"></span>
                            ${wrapKey(key)}
                            <span class="eruda-open">${
                              firstLevel ? '' : objAbstract
                            }</span>
                            <ul class="eruda-${t}" ${
        firstLevel ? '' : 'style="display:none"'
      }>`

      if (firstLevel) obj += this._objToHtml(val)

      return obj + '</ul><span class="eruda-close"></span></li>'
    }

    function wrapKey(key) {
      if (firstLevel) return ''
      if (isObj(val) && val.jsonSplitArr) return ''

      let keyClass = 'eruda-key'
      if (
        keyType === 'unenumerable' ||
        keyType === 'proto' ||
        keyType === 'symbol'
      ) {
        keyClass = 'eruda-key-lighter'
      }

      return `<span class="${keyClass}">${encode(key)}</span>: `
    }

    return `<li>${wrapKey(key)}<span class="eruda-${typeof val}">"${encode(
      val
    )}"</span></li>`
  }
  _appendTpl() {
    this._$el.html(this._objToHtml(this._data, true))
  }
  _bindEvent() {
    const map = this._map

    const self = this

    this._$el.on('click', 'li', function(e) {
      const $this = $(this)
      const circularId = $this.data('object-id')
      const $firstSpan = $(this)
        .find('span')
        .eq(0)

      if ($this.data('first-level')) return
      if (circularId) {
        $this.find('ul').html(self._objToHtml(map[circularId], false))
        $this.rmAttr('data-object-id')
      }

      e.stopImmediatePropagation()

      if (!$firstSpan.hasClass('eruda-expanded')) return

      const $ul = $this.find('ul').eq(0)
      if ($firstSpan.hasClass('eruda-collapsed')) {
        $firstSpan.rmClass('eruda-collapsed')
        $ul.show()
      } else {
        $firstSpan.addClass('eruda-collapsed')
        $ul.hide()
      }

      self.emit('change')
    })
  }
}

function getObjAbstract(data, type) {
  if (!type) return

  if (type === 'Function') {
    return getFnAbstract(toSrc(data))
  }
  if (type === 'Array') {
    return `Array(${data.length})`
  }

  return type
}

class Visitor {
  constructor() {
    this.id = 0
    this.visited = []
  }
  set(val) {
    const { visited, id } = this
    const obj = {
      id,
      val
    }
    visited.push(obj)

    this.id++

    return id
  }
  get(val) {
    const { visited } = this

    for (let i = 0, len = visited.length; i < len; i++) {
      const obj = visited[i]
      if (val === obj.val) return obj
    }

    return false
  }
}
