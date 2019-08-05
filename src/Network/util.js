import { last } from '../lib/util'

export function getType(contentType) {
  if (!contentType) return 'unknown'

  const type = contentType.split(';')[0].split('/')

  return {
    type: type[0],
    subType: last(type)
  }
}

export function lenToUtf8Bytes(str) {
  const m = encodeURIComponent(str).match(/%[89ABab]/g)

  return str.length + (m ? m.length : 0)
}

export function readBlobAsText(blob, callback) {
  const reader = new FileReader()
  reader.onload = () => {
    callback(null, reader.result)
  }
  reader.onerror = err => {
    callback(err)
  }
  reader.readAsText(blob)
}
