import { stringifyAll } from './stringifyUtil'

onmessage = function(e) {
  let [id, obj, options] = e.data
  let result = stringifyAll(obj, options)
  postMessage([id, result])
}
