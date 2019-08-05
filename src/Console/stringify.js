import StringifyWorker from '../lib/stringifyWorker'
import { nextTick, uniqId, tryIt, stringifyAll } from '../lib/util'

const isWorkerSupported = !!window.Worker

const callbacks = {}
let worker

if (isWorkerSupported) {
  tryIt(function() {
    /* Some browsers like uc mobile doesn't destroy worker properly after refreshing.
     * After a few times of visiting, it reaches the maximum number of workers per site. 
     */
    worker = new StringifyWorker()
    worker.onmessage = function(e) {
      const [id, result] = e.data
      if (callbacks[id]) {
        callbacks[id](result)
        delete callbacks[id]
      }
    }
  })
}

function exports(obj, options, cb) {
  const useWorker = exports.useWorker && isWorkerSupported && worker

  if (useWorker) {
    const id = uniqId('stringifyWorker')
    callbacks[id] = cb
    // Some native object can't be cloned, such as window.location.
    try {
      worker.postMessage([id, obj, options])
      return
    } catch (e) {
      delete callbacks[id]
    }
  }

  const result = stringifyAll(obj, options)
  nextTick(() => cb(result))
}

exports.useWorker = false

export default exports
