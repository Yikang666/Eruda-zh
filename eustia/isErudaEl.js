/* See if an element is within eruda.
 */

exports = function (el) {
  let parentNode = el.parentNode

  if (!parentNode) return false

  while (parentNode) {
    parentNode = parentNode.parentNode
    if (parentNode && parentNode.id === 'eruda') return true
  }

  return false
}
