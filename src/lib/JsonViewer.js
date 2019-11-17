import {
  evalCss,
  $,
  startWith,
  isObj,
  uniqId,
  upperFirst,
  toNum,
  escape,
  toStr,
  chunk,
  each,
  isNaN,
  isNum,
  isBool,
  keys,
  trim,
  lowerCase,
  isUndef,
  stringifyAll,
  Emitter
} from './util'

let hasEvalCss = false

export default class JsonViewer extends Emitter {
  constructor(data, $el) {
    super()

    if (!hasEvalCss) {
      evalCss(require('./json.scss'))
      hasEvalCss = true
    }

    if (isObj(data) && isUndef(data.type) && isUndef(data.id)) {
      data = JSON.parse(
        stringifyAll(data, {
          ignore: [Object.prototype, Array.prototype]
        })
      )
    }

    this._data = {
      id: uniqId('json'),
      enumerable: {
        0: data
      }
    }
    this._$el = $el
    this._map = {}
    createMap(this._map, this._data)

    this._appendTpl()
    this._bindEvent()
  }
  jsonToHtml(data, firstLevel) {
    let ret = ''

    each(['enumerable', 'unenumerable', 'symbol'], type => {
      if (!data[type]) return

      const typeKeys = keys(data[type])
      typeKeys.sort(sortObjName)
      for (let i = 0, len = typeKeys.length; i < len; i++) {
        const key = typeKeys[i]
        ret += this.createEl(key, data[type][key], type, firstLevel)
      }
    })

    if (data.proto) {
      if (ret === '') {
        ret = this.jsonToHtml(data.proto, firstLevel)
      } else {
        ret += this.createEl('__proto__', data.proto, 'proto', firstLevel)
      }
    }

    return ret
  }
  createEl(key, val, keyType, firstLevel = false) {
    let type = typeof val
    let id

    if (val === null) {
      return `<li>${wrapKey(key)}<span class="eruda-null">null</span></li>`
    } else if (isNum(val) || isBool(val)) {
      return `<li>${wrapKey(key)}<span class="eruda-${type}">${encode(
        val
      )}</span></li>`
    }

    if (val.type === 'RegExp') type = 'regexp'
    if (val.type === 'Number') type = 'number'

    if (val.type === 'Number' || val.type === 'RegExp') {
      return `<li>${wrapKey(key)}<span class="eruda-${type}">${encode(
        val.value
      )}</span></li>`
    } else if (val.type === 'Undefined' || val.type === 'Symbol') {
      return `<li>${wrapKey(key)}<span class="eruda-special">${lowerCase(
        val.type
      )}</span></li>`
    } else if (val === '(...)') {
      return `<li>${wrapKey(key)}<span class="eruda-special">${val}</span></li>`
    } else if (isObj(val)) {
      id = val.id
      const referenceId = val.reference
      const objAbstract = getObjAbstract(val) || upperFirst(type)

      let obj = `<li ${
        firstLevel ? 'data-first-level="true"' : ''
      } ${'data-object-id="' + (referenceId || id) + '"'}>
                            <span class="${
                              firstLevel ? '' : 'eruda-expanded eruda-collapsed'
                            }"></span>
                            ${wrapKey(key)}
                            <span class="eruda-open">${
                              firstLevel ? '' : objAbstract
                            }</span>
                            <ul class="eruda-${type}" ${
        firstLevel ? '' : 'style="display:none"'
      }>`

      if (firstLevel) obj += this.jsonToHtml(this._map[id])

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
    const data = this._map[this._data.id]

    this._$el.html(this.jsonToHtml(data, true))
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
        $this.find('ul').html(self.jsonToHtml(map[circularId], false))
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

function createMap(map, data) {
  const id = data.id

  if (!id && id !== 0) return

  const isArr = data.type && startWith(data.type, 'Array')
  if (isArr && data.enumerable) {
    const arr = objToArr(data, id, data.type)
    if (arr.length > 100) data = splitBigArr(arr)
  }
  map[id] = data

  const values = []
  each(['enumerable', 'unenumerable', 'symbol'], type => {
    if (!data[type]) return
    for (const key in data[type]) {
      values.push(data[type][key])
    }
  })
  if (data.proto) {
    values.push(data.proto)
  }
  for (let i = 0, len = values.length; i < len; i++) {
    const val = values[i]
    if (isObj(val)) createMap(map, val)
  }
}

function splitBigArr(data) {
  let idx = 0
  const enumerable = {}
  each(chunk(data, 100), val => {
    const obj = {}
    const startIdx = idx
    obj.type = '[' + startIdx
    obj.enumerable = {}
    each(val, val => {
      obj.enumerable[idx] = val
      idx += 1
    })
    const endIdx = idx - 1
    obj.type += (endIdx - startIdx > 0 ? ' … ' + endIdx : '') + ']'
    obj.id = uniqId('json')
    obj.jsonSplitArr = true
    enumerable[idx] = obj
  })

  const ret = {}
  ret.enumerable = enumerable
  ret.id = data.id
  ret.type = data.type
  if (data.unenumerable) ret.unenumerable = data.unenumerable
  if (data.symbol) ret.symbol = data.symbol
  if (data.proto) ret.proto = data.proto

  return ret
}

function objToArr(data, id, type) {
  const ret = []

  const enumerable = {}
  each(data.enumerable, (val, key) => {
    const idx = toNum(key)
    if (!isNaN(idx)) {
      ret[idx] = val
    } else {
      enumerable[key] = val
    }
  })

  ret.enumerable = enumerable
  ret.type = type
  ret.id = id
  if (data.unenumerable) ret.unenumerable = data.unenumerable
  if (data.symbol) ret.symbol = data.symbol
  if (data.proto) ret.proto = data.proto

  return ret
}

const encode = str => {
  return escape(toStr(str))
    .replace(/\n/g, '↵')
    .replace(/\f|\r|\t/g, '')
}

// $, upperCase, lowerCase, _
function sortObjName(a, b) {
  const numA = toNum(a)
  const numB = toNum(b)
  if (!isNaN(numA) && !isNaN(numB)) {
    if (numA > numB) return 1
    if (numA < numB) return -1
    return 0
  }

  if (startWith(a, 'get ') || startWith(a, 'set ')) a = a.slice(4)
  if (startWith(b, 'get ') || startWith(b, 'set ')) b = b.slice(4)

  const lenA = a.length
  const lenB = b.length
  const len = lenA > lenB ? lenB : lenA

  for (let i = 0; i < len; i++) {
    const codeA = a.charCodeAt(i)
    const codeB = b.charCodeAt(i)
    const cmpResult = cmpCode(codeA, codeB)

    if (cmpResult !== 0) return cmpResult
  }

  if (lenA > lenB) return 1
  if (lenA < lenB) return -1

  return 0
}

function cmpCode(a, b) {
  a = transCode(a)
  b = transCode(b)

  if (a > b) return 1
  if (a < b) return -1
  return 0
}

function transCode(code) {
  // _ should be placed after lowercase chars.
  if (code === 95) return 123
  return code
}

function getObjAbstract(data) {
  const { type, value } = data
  if (!type) return

  if (type === 'Function') {
    return getFnAbstract(value)
  }
  if (type === 'Array' && data.unenumerable) {
    return `Array(${data.unenumerable.length})`
  }

  return data.type
}

const regFnHead = /function(.*?)\((.*?)\)/

function extractFnHead(str) {
  const fnHead = str.match(regFnHead)

  if (fnHead) return fnHead[0]

  return str
}

function getFnAbstract(str) {
  if (str.length > 500) str = str.slice(0, 500) + '...'

  return 'ƒ ' + trim(extractFnHead(str).replace('function', ''))
}
