import chobitsu from 'chobitsu'

export default class Highlight {
  constructor() {
    this._isShow = false

    chobitsu.domain('Overlay').enable()
  }
  setEl(el) {
    this._target = el
  }
  show() {
    this._isShow = true
    const { nodeId } = chobitsu.domain('DOM').getNodeId({ node: this._target })
    chobitsu.domain('Overlay').highlightNode({
      nodeId,
      highlightConfig: {
        showInfo: true,
        contentColor: 'rgba(111, 168, 220, .66)',
        paddingColor: 'rgba(147, 196, 125, .55)',
        borderColor: 'rgba(255, 229, 153, .66)',
        marginColor: 'rgba(246, 178, 107, .66)',
      },
    })
  }
  destroy() {
    chobitsu.domain('Overlay').disable()
  }
  hide() {
    this._isShow = false
    chobitsu.domain('Overlay').hideHighlight()
  }
}
