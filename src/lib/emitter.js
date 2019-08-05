import { Emitter } from './util'

const emitter = new Emitter()
emitter.ADD = 'ADD'
emitter.SHOW = 'SHOW'
emitter.SCALE = 'SCALE'

module.exports = emitter
