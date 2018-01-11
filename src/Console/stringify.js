import stringify from '../lib/stringify';
import StringifyWorker from '../lib/stringifyWorker';
import {nextTick, uniqId} from '../lib/util';

let isWorkerSupported = !!window.Worker;

let callbacks = {},
    worker;

if (isWorkerSupported) 
{
    worker = new StringifyWorker();
    worker.onmessage = function (e) 
    {
        let [id, result] = e.data;
        if (callbacks[id]) 
        {
            callbacks[id](result);
            delete callbacks[id];
        }
    };
}

function exports(obj, options, cb) 
{
    let useWorker = exports.useWorker && isWorkerSupported;

    if (useWorker) 
    {
        let id = uniqId('stringifyWorker');
        callbacks[id] = cb;
        // Some native object can't be cloned, such as window.location.
        try 
        {
            worker.postMessage([id, obj, options]);
            return;
        } catch (e) 
        {
            delete callbacks[id];
        }
    }

    let result = stringify(obj, options);
    nextTick(() => cb(result));
}

exports.useWorker = false;

export default exports;