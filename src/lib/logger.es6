import util from './util'
import emitter from './emitter.es6'

let logger;

export default logger = new util.Logger('[Eruda]', ENV === 'production' ? 'warn' : 'debug');

logger.formatter = function (type, argList) 
{
    argList.unshift(this.name);

    return argList;
};

emitter.on(emitter.LOG, (type, ...args) => logger[type](...args));
