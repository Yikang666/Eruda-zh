import { getType, lenToUtf8Bytes } from './util'
import {
  Emitter,
  fullUrl,
  uniqId,
  isStr,
  getFileName,
  now,
  toNum,
  fileSize,
  isEmpty
} from '../lib/util'

export default class FetchRequest extends Emitter {
  constructor(url, options = {}) {
    super()

    if (url instanceof window.Request) url = url.url

    this._url = fullUrl(url)
    this._id = uniqId('request')
    this._options = options
    this._reqHeaders = options.headers || {}
    this._method = options.method || 'GET'
  }
  send(fetchResult) {
    const options = this._options

    const data = isStr(options.body) ? options.body : ''

    this._fetch = fetchResult
    this.emit('send', this._id, {
      name: getFileName(this._url),
      url: this._url,
      data,
      method: this._method
    })

    fetchResult.then(res => {
      res = res.clone()

      const type = getType(res.headers.get('Content-Type'))
      res.text().then(resTxt => {
        const data = {
          type: type.type,
          subType: type.subType,
          time: now(),
          size: getSize(res, resTxt),
          resTxt: resTxt,
          resHeaders: getHeaders(res),
          status: res.status,
          done: true
        }
        if (!isEmpty(this._reqHeaders)) {
          data.reqHeaders = this._reqHeaders
        }
        this.emit('update', this._id, data)
      })

      return res
    })
  }
}

function getSize(res, resTxt) {
  let size = 0

  const contentLen = res.headers.get('Content-length')

  if (contentLen) {
    size = toNum(contentLen)
  } else {
    size = lenToUtf8Bytes(resTxt)
  }

  return `${fileSize(size)}B`
}

function getHeaders(res) {
  const ret = {}

  res.headers.forEach((val, key) => (ret[key] = val))

  return ret
}
