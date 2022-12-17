import Chobitsu from 'chobitsu/Chobitsu'
import * as Network from 'chobitsu/domains/Network'
import * as Overlay from 'chobitsu/domains/Overlay'
import * as DOM from 'chobitsu/domains/DOM'
import * as Storage from 'chobitsu/domains/Storage'

const chobitsu = new Chobitsu()
chobitsu.register('Network', Network)
chobitsu.register('Overlay', Overlay)
chobitsu.register('DOM', {
  ...DOM,
  getNodeId: DOM.getDOMNodeId,
  getNode: DOM.getDOMNode,
})
chobitsu.register('Storage', Storage)

export default chobitsu
