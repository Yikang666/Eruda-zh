import Tool from '../DevTools/Tool'
import Settings from '../Settings/Settings'
import $ from 'licia/$'
import escape from 'licia/escape'
import isEmpty from 'licia/isEmpty'
import unique from 'licia/unique'
import each from 'licia/each'
import trim from 'licia/trim'
import sameOrigin from 'licia/sameOrigin'
import ajax from 'licia/ajax'
import MutationObserver from 'licia/MutationObserver'
import toArr from 'licia/toArr'
import concat from 'licia/concat'
import isNull from 'licia/isNull'
import map from 'licia/map'
import { isErudaEl, classPrefix as c } from '../lib/util'
import evalCss from '../lib/evalCss'
import chobitsu from '../lib/chobitsu'
import LunaModal from 'luna-modal'
import Storage from './Storage'
import { filterData } from './util'

export default class Resources extends Tool {
  constructor() {
    super()

    this._style = evalCss(require('./Resources.scss'))

    this.name = 'resources'
    this._localStoreData = []
    this._localStoreSearchKeyword = ''
    this._hideErudaSetting = false
    this._sessionStoreData = []
    this._sessionStoreSearchKeyword = ''
    this._cookieSearchKeyword = ''
    this._observeElement = true
  }
  init($el, container) {
    super.init($el)

    this._container = container

    this._initTpl()
    this._localStorage = new Storage(
      this._$localStorage,
      container,
      this,
      'local'
    )
    this._sessionStorage = new Storage(
      this._$sessionStorage,
      container,
      this,
      'session'
    )

    this._bindEvent()
    this._initObserver()
    this._initCfg()
  }
  refresh() {
    return this.refreshLocalStorage()
      .refreshSessionStorage()
      .refreshCookie()
      .refreshScript()
      .refreshStylesheet()
      .refreshIframe()
      .refreshImage()
  }
  destroy() {
    super.destroy()

    this._disableObserver()
    evalCss.remove(this._style)
    this._rmCfg()
  }
  refreshScript() {
    let scriptData = []

    $('script').each(function () {
      const src = this.src

      if (src !== '') scriptData.push(src)
    })

    scriptData = unique(scriptData)

    const scriptState = getState('script', scriptData.length)
    let scriptDataHtml = '<li>Empty</li>'
    if (!isEmpty(scriptData)) {
      scriptDataHtml = map(scriptData, (script) => {
        script = escape(script)
        return `<li><a href="${script}" target="_blank" class="${c(
          'js-link'
        )}">${script}</a></li>`
      }).join('')
    }

    const scriptHtml = `<h2 class="${c('title')}">
      Script
      <div class="${c('btn refresh-script')}">
        <span class="${c('icon-refresh')}"></span>
      </div>
    </h2>
    <ul class="${c('link-list')}">
      ${scriptDataHtml}
    </ul>`

    const $script = this._$script
    setState($script, scriptState)
    $script.html(scriptHtml)

    return this
  }
  refreshStylesheet() {
    let stylesheetData = []

    $('link').each(function () {
      if (this.rel !== 'stylesheet') return

      stylesheetData.push(this.href)
    })

    stylesheetData = unique(stylesheetData)

    const stylesheetState = getState('stylesheet', stylesheetData.length)
    let stylesheetDataHtml = '<li>Empty</li>'
    if (!stylesheetData) {
      stylesheetDataHtml = map(stylesheetData, (stylesheet) => {
        stylesheet = escape(stylesheet)
        return ` <li><a href="${stylesheet}" target="_blank" class="${c(
          'css-link'
        )}">${stylesheet}</a></li>`
      }).join('')
    }

    const stylesheetHtml = `<h2 class="${c('title')}">
      Stylesheet
      <div class="${c('btn refresh-stylesheet')}">
        <span class="${c('icon-refresh')}"></span>
      </div>
    </h2>
    <ul class="${c('link-list')}">
      ${stylesheetDataHtml}
    </ul>`

    const $stylesheet = this._$stylesheet
    setState($stylesheet, stylesheetState)
    $stylesheet.html(stylesheetHtml)

    return this
  }
  refreshIframe() {
    let iframeData = []

    $('iframe').each(function () {
      const $this = $(this)
      const src = $this.attr('src')

      if (src) iframeData.push(src)
    })

    iframeData = unique(iframeData)

    let iframeDataHtml = '<li>Empty</li>'
    if (!isEmpty(iframeData)) {
      iframeDataHtml = map(iframeData, (iframe) => {
        iframe = escape(iframe)
        return `<li><a href="${iframe}" target="_blank" class="${c(
          'iframe-link'
        )}">${iframe}</a></li>`
      }).join('')
    }
    const iframeHtml = `<h2 class="${c('title')}">
      Iframe
      <div class="${c('btn refresh-iframe')}">
        <span class="${c('icon-refresh')}"></span>
      </div>
    </h2>
    <ul class="${c('link-list')}">
      ${iframeDataHtml}
    </ul>`

    this._$iframe.html(iframeHtml)

    return this
  }
  refreshLocalStorage() {
    this._localStorage.refresh()

    return this
  }
  refreshSessionStorage() {
    this._sessionStorage.refresh()

    return this
  }
  refreshCookie() {
    const { cookies } = chobitsu.domain('Network').getCookies()
    let cookieData = map(cookies, ({ name, value }) => ({
      key: name,
      val: value,
    }))

    const cookieSearchKeyword = this._cookieSearchKeyword
    cookieData = filterData(cookieData, cookieSearchKeyword)
    const cookieState = getState('cookie', cookieData.length)

    let cookieDataHtml = '<tr><td>Empty</td></tr>'
    if (!isEmpty(cookieData)) {
      cookieDataHtml = map(cookieData, ({ key, val }) => {
        key = escape(key)

        return `<tr>
          <td class="${c('key')}">${key}</td>
          <td>${escape(val)}</td>
          <td class="${c('control')}">
            <span class="${c(
              'icon-delete delete-cookie'
            )}" data-key="${key}"></span>
          </td>
        </tr>`
      }).join('')
    }

    const cookieHtml = `<h2 class="${c('title')}">
      Cookie
      <div class="${c('btn refresh-cookie')}">
        <span class="${c('icon-refresh')}"></span>
      </div>
      <div class="${c('btn clear-cookie')}">
        <span class="${c('icon-clear')}"></span>
      </div>
      <div class="${c('btn search')}" data-type="cookie">
        <span class="${c('icon-filter')}"></span>
      </div>
      ${
        cookieSearchKeyword
          ? `<div class="${c('btn search-keyword')}">${escape(
              cookieSearchKeyword
            )}</div>`
          : ''
      }
    </h2>
    <div class="${c('content')}">
      <table>
        <tbody>
          ${cookieDataHtml}
        </tbody>
      </table>
    </div>`

    const $cookie = this._$cookie
    setState($cookie, cookieState)
    $cookie.html(cookieHtml)

    return this
  }
  refreshImage() {
    let imageData = []

    const performance = (this._performance =
      window.webkitPerformance || window.performance)
    if (performance && performance.getEntries) {
      const entries = this._performance.getEntries()
      entries.forEach((entry) => {
        if (entry.initiatorType === 'img' || isImg(entry.name)) {
          imageData.push(entry.name)
        }
      })
    } else {
      $('img').each(function () {
        const $this = $(this)
        const src = $this.attr('src')

        if ($this.data('exclude') === 'true') return

        imageData.push(src)
      })
    }

    imageData = unique(imageData)
    imageData.sort()

    const imageState = getState('image', imageData.length)
    let imageDataHtml = '<li>Empty</li>'
    if (!isEmpty(imageData)) {
      imageDataHtml = map(imageData, (image) => {
        return `<li class="${c('image')}">
          <img src="${escape(image)}" data-exclude="true" class="${c(
          'img-link'
        )}"/>
        </li>`
      }).join('')
    }

    const imageHtml = `<h2 class="${c('title')}">
      Image
      <div class="${c('btn refresh-image')}">
        <span class="${c('icon-refresh')}"></span>
      </div>
    </h2>
    <ul class="${c('image-list')}">
      ${imageDataHtml}
    </ul>`

    const $image = this._$image
    setState($image, imageState)
    $image.html(imageHtml)

    return this
  }
  show() {
    super.show()
    if (this._observeElement) this._enableObserver()

    return this.refresh()
  }
  hide() {
    this._disableObserver()

    return super.hide()
  }
  _initTpl() {
    const $el = this._$el
    console.log('init tpl')
    $el.html(
      c(`<div class="section local-storage"></div>
      <div class="section session-storage"></div>
      <div class="section cookie"></div>
      <div class="section script"></div>
      <div class="section stylesheet"></div>
      <div class="section iframe"></div>
      <div class="section image"></div>`)
    )
    this._$localStorage = $el.find(c('.local-storage'))
    this._$sessionStorage = $el.find(c('.session-storage'))
    this._$cookie = $el.find(c('.cookie'))
    this._$script = $el.find(c('.script'))
    this._$stylesheet = $el.find(c('.stylesheet'))
    this._$iframe = $el.find(c('.iframe'))
    this._$image = $el.find(c('.image'))
  }
  _bindEvent() {
    const self = this
    const $el = this._$el
    const container = this._container

    $el
      .on('click', '.eruda-refresh-cookie', () => {
        container.notify('Refreshed')
        this.refreshCookie()
      })
      .on('click', '.eruda-refresh-script', () => {
        container.notify('Refreshed')
        this.refreshScript()
      })
      .on('click', '.eruda-refresh-stylesheet', () => {
        container.notify('Refreshed')
        this.refreshStylesheet()
      })
      .on('click', '.eruda-refresh-iframe', () => {
        container.notify('Refreshed')
        this.refreshIframe()
      })
      .on('click', '.eruda-refresh-image', () => {
        container.notify('Refreshed')
        this.refreshImage()
      })
      .on('click', '.eruda-search', function () {
        const $this = $(this)
        const type = $this.data('type')

        LunaModal.prompt('Filter').then((filter) => {
          if (isNull(filter)) return
          filter = trim(filter)
          switch (type) {
            case 'cookie':
              self._cookieSearchKeyword = filter
              self.refreshCookie()
              break
          }
        })
      })
      .on('click', '.eruda-delete-cookie', function () {
        const key = $(this).data('key')

        chobitsu.domain('Network').deleteCookies({ name: key })
        self.refreshCookie()
      })
      .on('click', '.eruda-clear-cookie', () => {
        chobitsu.domain('Storage').clearDataForOrigin({
          storageTypes: 'cookies',
        })
        this.refreshCookie()
      })
      .on('click', '.eruda-img-link', function () {
        const src = $(this).attr('src')

        showSources('img', src)
      })
      .on('click', '.eruda-css-link', linkFactory('css'))
      .on('click', '.eruda-js-link', linkFactory('js'))
      .on('click', '.eruda-iframe-link', linkFactory('iframe'))

    function showSources(type, data) {
      const sources = container.get('sources')
      if (!sources) return

      sources.set(type, data)

      container.showTool('sources')

      return true
    }

    function linkFactory(type) {
      return function (e) {
        if (!container.get('sources')) return
        e.preventDefault()

        const url = $(this).attr('href')

        if (type === 'iframe' || !sameOrigin(location.href, url)) {
          showSources('iframe', url)
        } else {
          ajax({
            url,
            success: (data) => {
              showSources(type, data)
            },
            dataType: 'raw',
          })
        }
      }
    }
  }
  _rmCfg() {
    const cfg = this.config

    const settings = this._container.get('settings')

    if (!settings) return

    settings
      .remove(cfg, 'hideErudaSetting')
      .remove(cfg, 'observeElement')
      .remove('Resources')
  }
  _initCfg() {
    const cfg = (this.config = Settings.createCfg('resources', {
      hideErudaSetting: true,
      observeElement: true,
    }))

    if (cfg.get('hideErudaSetting')) this._hideErudaSetting = true
    if (!cfg.get('observeElement')) this._observeElement = false

    cfg.on('change', (key, val) => {
      switch (key) {
        case 'hideErudaSetting':
          this._hideErudaSetting = val
          return
        case 'observeElement':
          this._observeElement = val
          return val ? this._enableObserver() : this._disableObserver()
      }
    })

    const settings = this._container.get('settings')
    settings
      .text('Resources')
      .switch(cfg, 'hideErudaSetting', 'Hide Eruda Setting')
      .switch(cfg, 'observeElement', 'Auto Refresh Elements')
      .separator()
  }
  _initObserver() {
    this._observer = new MutationObserver((mutations) => {
      each(mutations, (mutation) => {
        this._handleMutation(mutation)
      })
    })
  }
  _handleMutation(mutation) {
    if (isErudaEl(mutation.target)) return

    const checkEl = (el) => {
      const tagName = getLowerCaseTagName(el)
      switch (tagName) {
        case 'script':
          this.refreshScript()
          break
        case 'img':
          this.refreshImage()
          break
        case 'link':
          this.refreshStylesheet()
          break
      }
    }

    if (mutation.type === 'attributes') {
      checkEl(mutation.target)
    } else if (mutation.type === 'childList') {
      checkEl(mutation.target)
      let nodes = toArr(mutation.addedNodes)
      nodes = concat(nodes, toArr(mutation.removedNodes))

      for (const node of nodes) {
        checkEl(node)
      }
    }
  }
  _enableObserver() {
    this._observer.observe(document.documentElement, {
      attributes: true,
      childList: true,
      subtree: true,
    })
  }
  _disableObserver() {
    this._observer.disconnect()
  }
}

function setState($el, state) {
  $el
    .rmClass(c('ok'))
    .rmClass(c('danger'))
    .rmClass(c('warn'))
    .addClass(c(state))
}

function getState(type, len) {
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

function getLowerCaseTagName(el) {
  if (!el.tagName) return ''
  return el.tagName.toLowerCase()
}

const regImg = /\.(jpeg|jpg|gif|png)$/

const isImg = (url) => regImg.test(url)
