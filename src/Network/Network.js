import Tool from '../DevTools/Tool'
import isEmpty from 'licia/isEmpty'
import $ from 'licia/$'
import ms from 'licia/ms'
import each from 'licia/each'
import last from 'licia/last'
import Detail from './Detail'
import map from 'licia/map'
import escape from 'licia/escape'
import { getFileName, classPrefix as c } from '../lib/util'
import evalCss from '../lib/evalCss'
import chobitsu from '../lib/chobitsu'

export default class Network extends Tool {
  constructor() {
    super()

    this._style = evalCss(require('./Network.scss'))

    this.name = 'network'
    this._requests = {}
  }
  init($el, container) {
    super.init($el)

    this._container = container
    this._initTpl()
    this._detail = new Detail(this._$detail)
    this._bindEvent()
  }
  show() {
    super.show()

    this._render()
  }
  clear() {
    this._requests = {}
    this._render()
  }
  requests() {
    const ret = []
    each(this._requests, (request) => {
      ret.push(request)
    })
    return ret
  }
  _reqWillBeSent = (params) => {
    this._requests[params.requestId] = {
      name: getFileName(params.request.url),
      url: params.request.url,
      status: 'pending',
      type: 'unknown',
      subType: 'unknown',
      size: 0,
      data: params.request.postData,
      method: params.request.method,
      startTime: params.timestamp * 1000,
      time: 0,
      resTxt: '',
      done: false,
      reqHeaders: params.request.headers || {},
      resHeaders: {},
    }
  }
  _resReceivedExtraInfo = (params) => {
    const target = this._requests[params.requestId]
    if (!target) {
      return
    }

    target.resHeaders = params.headers

    this._updateType(target)
    this._render()
  }
  _updateType(target) {
    const contentType = target.resHeaders['content-type'] || ''
    const { type, subType } = getType(contentType)
    target.type = type
    target.subType = subType
  }
  _resReceived = (params) => {
    const target = this._requests[params.requestId]
    if (!target) {
      return
    }

    const { response } = params
    const { status, headers } = response
    target.status = status
    if (status < 200 || status >= 300) {
      target.hasErr = true
    }
    if (headers) {
      target.resHeaders = headers
      this._updateType(target)
    }

    this._render()
  }
  _loadingFinished = (params) => {
    const target = this._requests[params.requestId]
    if (!target) {
      return
    }

    const time = params.timestamp * 1000
    target.time = time - target.startTime
    target.displayTime = ms(target.time)

    target.size = params.encodedDataLength
    target.done = true
    target.resTxt = chobitsu.domain('Network').getResponseBody({
      requestId: params.requestId,
    }).body

    this._render()
  }
  _bindEvent() {
    const $el = this._$el
    const container = this._container

    const self = this

    $el
      .on('click', c('.request'), function () {
        const id = $(this).data('id')
        const data = self._requests[id]

        if (!data.done) return

        self._detail.show(data)
      })
      .on('click', c('.clear-request'), () => this.clear())

    this._detail.on('showSources', function (type, data) {
      const sources = container.get('sources')
      if (!sources) return

      sources.set(type, data)

      container.showTool('sources')
    })

    chobitsu.domain('Network').enable()

    const network = chobitsu.domain('Network')
    network.on('requestWillBeSent', this._reqWillBeSent)
    network.on('responseReceivedExtraInfo', this._resReceivedExtraInfo)
    network.on('responseReceived', this._resReceived)
    network.on('loadingFinished', this._loadingFinished)
  }
  destroy() {
    super.destroy()

    evalCss.remove(this._style)

    const network = chobitsu.domain('Network')
    network.off('requestWillBeSent', this._reqWillBeSent)
    network.off('responseReceivedExtraInfo', this._resReceivedExtraInfo)
    network.off('responseReceived', this._resReceived)
    network.off('loadingFinished', this._loadingFinished)
  }
  _initTpl() {
    const $el = this._$el
    $el.html(
      c(`<div class="title">
      Request
      <div class="btn clear-request">
        <span class="icon-clear"></span>
      </div>
    </div>
    <ul class="requests"></ul>
    <div class="detail"></div>`)
    )
    this._$detail = $el.find(c('.detail'))
    this._$requests = $el.find(c('.requests'))
  }
  _render() {
    if (!this.active) return

    const renderData = {}

    if (!isEmpty(this._requests)) renderData.requests = this._requests

    let html = `<li><span class="${c('name')}">Empty</span></li>`
    if (renderData.requests) {
      html = map(
        renderData.requests,
        ({ hasErr, name, status, method, subType, size, displayTime }, idx) => {
          return `<li class="${c('request')} ${
            hasErr ? c('error') : ''
          }" data-id="${idx}">
          <span class="${c('name')}">${escape(name)}</span>
          <span class="${c('status')}">${status}</span>
          <span class="${c('method')}">${method}</span>
          <span class="${c('type')}">${subType}</span>
          <span class="${c('size')}">${size}</span>
          <span class="${c('time')}">${displayTime}</span>
        </li>`
        }
      ).join('')
    }

    this._renderHtml(html)
  }
  _renderHtml(html) {
    if (html === this._lastHtml) return
    this._lastHtml = html
    this._$requests.html(html)
  }
}

function getType(contentType) {
  if (!contentType) return 'unknown'

  const type = contentType.split(';')[0].split('/')

  return {
    type: type[0],
    subType: last(type),
  }
}
