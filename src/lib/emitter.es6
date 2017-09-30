import util from './util'

let emitter = new util.Emitter();
emitter.ADD = 'ADD';
emitter.LOG = 'LOG';
emitter.SHOW = 'SHOW';

module.exports = emitter;