import util from './util';

let logger;

export default logger = new util.Logger('[Eruda]', ENV === 'production' ? 'warn' : 'debug');

logger.formatter = function (type, argList) 
{
    argList.unshift(this.name);

    return argList;
};
