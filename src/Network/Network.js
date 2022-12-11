import Tool from '../DevTools/Tool'
import $ from 'licia/$'
import ms from 'licia/ms'
import each from 'licia/each'
import Detail from './Detail'
import throttle from 'licia/throttle'
import { getFileName, classPrefix as c } from '../lib/util'
import evalCss from '../lib/evalCss'
import chobitsu from '../lib/chobitsu'
import LunaDataGrid from 'luna-data-grid'
import ResizeSensor from 'licia/ResizeSensor'
import { getType } from './util'

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
    this._updateDataGridHeight()
    this._resizeSensor = new ResizeSensor($el.get(0))
    this._bindEvent()
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
    if (!request) {
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
    if (!request) {
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
    if (!request) {
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
  _bindEvent() {
    const $el = this._$el

    const self = this

    $el.on('click', c('.clear-request'), () => this.clear())

    this._requestDataGrid.on('select', (node) => {
      const id = $(node.container).data('id')
      const request = self._requests[id]
      if (!request.done) {
        return
      }
      self._detail.show(request)
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
      c(`<div class="title">
      Request
      <div class="btn clear-request">
        <span class="icon-clear"></span>
      </div>
    </div>
    <div class="requests"></div>
    <div class="detail"></div>`)
    )
    this._$detail = $el.find(c('.detail'))
    this._$requests = $el.find(c('.requests'))
  }
}
