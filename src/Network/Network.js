import Tool from '../DevTools/Tool'
import $ from 'licia/$'
import ms from 'licia/ms'
import each from 'licia/each'
import map from 'licia/map'
import Detail from './Detail'
import throttle from 'licia/throttle'
import { getFileName, classPrefix as c } from '../lib/util'
import evalCss from '../lib/evalCss'
import chobitsu from '../lib/chobitsu'
import LunaDataGrid from 'luna-data-grid'
import ResizeSensor from 'licia/ResizeSensor'
import { getType } from './util'
import copy from 'licia/copy'
import extend from 'licia/extend'
import { curlStr } from './util'

export default class Network extends Tool {
  constructor() {
    super()

    this._style = evalCss(require('./Network.scss'))

    this.name = 'network'
    this._requests = {}
    this._selectedRequest = null
    this._isRecording = true
  }
  init($el, container) {
    super.init($el)

    this._container = container
    this._initTpl()
    this._detail = new Detail(this._$detail, container)
    this._requestDataGrid = new LunaDataGrid(this._$requests.get(0), {
      columns: [
        {
          id: 'name',
          title: 'Name',
          sortable: true,
          weight: 30,
        },
        {
          id: 'method',
          title: 'Method',
          sortable: true,
          weight: 14,
        },
        {
          id: 'status',
          title: 'Status',
          sortable: true,
          weight: 14,
        },
        {
          id: 'type',
          title: 'Type',
          sortable: true,
          weight: 14,
        },
        {
          id: 'size',
          title: 'Size',
          sortable: true,
          weight: 14,
        },
        {
          id: 'time',
          title: 'Time',
          sortable: true,
          weight: 14,
        },
      ],
    })
    this._resizeSensor = new ResizeSensor($el.get(0))
    this._bindEvent()
  }
  show() {
    super.show()
    this._updateDataGridHeight()
  }
  clear() {
    this._requests = {}
    this._requestDataGrid.clear()
  }
  requests() {
    const ret = []
    each(this._requests, (request) => {
      ret.push(request)
    })
    return ret
  }
  _updateDataGridHeight() {
    const height = this._$el.offset().height - 41
    this._requestDataGrid.setOption('minHeight', height)
    this._requestDataGrid.setOption('maxHeight', height)
  }
  _reqWillBeSent = (params) => {
    if (!this._isRecording) {
      return
    }

    const request = {
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
    let node
    request.render = () => {
      const data = {
        name: request.name,
        method: request.method,
        status: request.status,
        type: request.subType,
        size: request.size,
        time: request.displayTime,
      }
      if (node) {
        node.data = data
        node.render()
      } else {
        node = this._requestDataGrid.append(data, { selectable: true })
        $(node.container).data('id', params.requestId)
      }
      if (request.hasErr) {
        $(node.container).addClass(c('request-error'))
      }
    }
    request.render()
    this._requests[params.requestId] = request
  }
  _resReceivedExtraInfo = (params) => {
    const request = this._requests[params.requestId]
    if (!this._isRecording || !request) {
      return
    }

    request.resHeaders = params.headers

    this._updateType(request)
    request.render()
  }
  _updateType(request) {
    const contentType = request.resHeaders['content-type'] || ''
    const { type, subType } = getType(contentType)
    request.type = type
    request.subType = subType
  }
  _resReceived = (params) => {
    const request = this._requests[params.requestId]
    if (!this._isRecording || !request) {
      return
    }

    const { response } = params
    const { status, headers } = response
    request.status = status
    if (status < 200 || status >= 300) {
      request.hasErr = true
    }
    if (headers) {
      request.resHeaders = headers
      this._updateType(request)
    }

    request.render()
  }
  _loadingFinished = (params) => {
    const request = this._requests[params.requestId]
    if (!this._isRecording || !request) {
      return
    }

    const time = params.timestamp * 1000
    request.time = time - request.startTime
    request.displayTime = ms(request.time)

    request.size = params.encodedDataLength
    request.done = true
    request.resTxt = chobitsu.domain('Network').getResponseBody({
      requestId: params.requestId,
    }).body

    request.render()
  }
  _copyCurl = () => {
    const request = this._selectedRequest

    copy(
      curlStr({
        requestMethod: request.method,
        url() {
          return request.url
        },
        requestFormData() {
          return request.data
        },
        requestHeaders() {
          const reqHeaders = request.reqHeaders || {}
          extend(reqHeaders, {
            'User-Agent': navigator.userAgent,
            Referer: location.href,
          })

          return map(reqHeaders, (value, name) => {
            return {
              name,
              value,
            }
          })
        },
      })
    )

    this._container.notify('Copied')
  }
  _updateButtons() {
    const $control = this._$control
    const $showDetail = $control.find(c('.show-detail'))
    const $copyCurl = $control.find(c('.copy-curl'))

    $showDetail.addClass(c('icon-disabled'))
    $copyCurl.addClass(c('icon-disabled'))

    if (this._selectedRequest) {
      $showDetail.rmClass(c('icon-disabled'))
      $copyCurl.rmClass(c('icon-disabled'))
    }
  }
  _toggleRecording = () => {
    this._$control.find(c('.record')).toggleClass(c('recording'))
    this._isRecording = !this._isRecording
  }
  _bindEvent() {
    const $control = this._$control
    const requestDataGrid = this._requestDataGrid

    const self = this

    $control
      .on('click', c('.clear-request'), () => this.clear())
      .on('click', c('.show-detail'), () =>
        this._detail.show(this._selectedRequest)
      )
      .on('click', c('.copy-curl'), this._copyCurl)
      .on('click', c('.record'), this._toggleRecording)

    requestDataGrid.on('select', (node) => {
      const id = $(node.container).data('id')
      const request = self._requests[id]
      this._selectedRequest = request
      this._updateButtons()
    })

    requestDataGrid.on('deselect', () => {
      this._selectedRequest = null
      this._updateButtons()
    })

    this._resizeSensor.addListener(
      throttle(() => this._updateDataGridHeight(), 15)
    )

    chobitsu.domain('Network').enable()

    const network = chobitsu.domain('Network')
    network.on('requestWillBeSent', this._reqWillBeSent)
    network.on('responseReceivedExtraInfo', this._resReceivedExtraInfo)
    network.on('responseReceived', this._resReceived)
    network.on('loadingFinished', this._loadingFinished)
  }
  destroy() {
    super.destroy()

    this._resizeSensor.destroy()
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
      c(`<div class="control">
      <span class="icon-record record recording"></span>
      <span class="icon-clear clear-request"></span>
      <span class="icon-eye icon-disabled show-detail"></span>
      <span class="icon-copy icon-disabled copy-curl"></span>
    </div>
    <div class="requests"></div>
    <div class="detail"></div>`)
    )
    this._$detail = $el.find(c('.detail'))
    this._$requests = $el.find(c('.requests'))
    this._$control = $el.find(c('.control'))
  }
}
