import { classPrefix as c } from '../lib/util'

export function setState($el, state) {
  $el
    .rmClass(c('ok'))
    .rmClass(c('danger'))
    .rmClass(c('warn'))
    .addClass(c(state))
}

export function getState(type, len) {
  if (len === 0) return ''

  let warn = 0
  let danger = 0

  switch (type) {
    case 'cookie':
      warn = 30
      danger = 60
      break
    case 'script':
      warn = 5
      danger = 10
      break
    case 'stylesheet':
      warn = 4
      danger = 8
      break
    case 'image':
      warn = 50
      danger = 100
      break
  }

  if (len >= danger) return 'danger'
  if (len >= warn) return 'warn'

  return 'ok'
}
