import { stringifyAll } from './stringifyUtil'

onmessage = function(e) {
  const [id, obj, options] = e.data
  const result = stringifyAll(obj, options)
  postMessage([id, result])
}
