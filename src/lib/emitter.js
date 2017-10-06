import util from './util'

let emitter = new util.Emitter();
emitter.ADD = 'ADD';
emitter.SHOW = 'SHOW';
emitter.SCALE = 'SCALE';

module.exports = emitter;