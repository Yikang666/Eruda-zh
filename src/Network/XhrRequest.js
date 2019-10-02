import { getType, lenToUtf8Bytes, readBlobAsText } from './util'
import {
  Emitter,
  fullUrl,
  uniqId,
  isStr,
  getFileName,
  now,
  each,
  trim,
  isCrossOrig,
  toNum,
  fileSize,
  isEmpty
} from '../lib/util'

export default class XhrRequest extends Emitter {
  constructor(xhr, method, url) {
    super()

    this._xhr = xhr
    this._reqHeaders = {}
    this._method = method
    this._url = fullUrl(url)
    this._id = uniqId('request')
  }
  handleSend(data) {
    if (!isStr(data)) data = ''

    data = {
      name: getFileName(this._url),
      url: this._url,
      data,
      method: this._method
    }
    if (!isEmpty(this._reqHeaders)) {
      data.reqHeaders = this._reqHeaders
    }
    this.emit('send', this._id, data)
  }
  handleReqHeadersSet(key, val) {
    if (key && val) {
      this._reqHeaders[key] = val
    }
  }
  handleHeadersReceived() {
    const xhr = this._xhr

    const type = getType(xhr.getResponseHeader('Content-Type'))
    this.emit('update', this._id, {
      type: type.type,
      subType: type.subType,
      size: getSize(xhr, true, this._url),
      time: now(),
      resHeaders: getHeaders(xhr)
    })
  }
  handleDone() {
    const xhr = this._xhr
    const resType = xhr.responseType
    let resTxt = ''

    const update = () => {
      this.emit('update', this._id, {
        status: xhr.status,
        done: true,
        size: getSize(xhr, false, this._url),
        time: now(),
        resTxt
      })
    }

    const type = getType(xhr.getResponseHeader('Content-Type'))
    if (
      resType === 'blob' &&
      (type.type === 'text' ||
        type.subType === 'javascript' ||
        type.subType === 'json')
    ) {
      readBlobAsText(xhr.response, (err, result) => {
        if (result) resTxt = result
        update()
      })
    } else {
      if (resType === '' || resType === 'text') resTxt = xhr.responseText
      if (resType === 'json') resTxt = JSON.stringify(xhr.response)

      update()
    }
  }
}

function getHeaders(xhr) {
  const raw = xhr.getAllResponseHeaders()
  const lines = raw.split('\n')

  const ret = {}

  each(lines, line => {
    line = trim(line)

    if (line === '') return

    const [key, val] = line.split(':', 2)

    ret[key] = trim(val)
  })

  return ret
}

function getSize(xhr, headersOnly, url) {
  let size = 0

  function getStrSize() {
    if (!headersOnly) {
      const resType = xhr.responseType
      let resTxt = ''

      if (resType === '' || resType === 'text') resTxt = xhr.responseText
      if (resTxt) size = lenToUtf8Bytes(resTxt)
    }
  }

  if (isCrossOrig(url)) {
    getStrSize()
  } else {
    try {
      size = toNum(xhr.getResponseHeader('Content-Length'))
    } catch (e) {
      getStrSize()
    }
  }

  if (size === 0) getStrSize()

  return `${fileSize(size)}B`
}
