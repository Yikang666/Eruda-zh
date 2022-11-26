import evalCss from './evalCss'
import extend from 'licia/extend'

export default function (util) {
  extend(util, {
    evalCss,
    isErudaEl,
  })
}

export function isErudaEl(el) {
  let parentNode = el.parentNode

  if (!parentNode) return false

  while (parentNode) {
    parentNode = parentNode.parentNode
    if (parentNode && parentNode.id === 'eruda') return true
  }

  return false
}
