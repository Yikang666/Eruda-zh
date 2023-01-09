import map from 'licia/map'
import isEmpty from 'licia/isEmpty'
import $ from 'licia/$'
import trim from 'licia/trim'
import isNull from 'licia/isNull'
import escape from 'licia/escape'
import LunaModal from 'luna-modal'
import { setState, getState, filterData } from './util'
import chobitsu from '../lib/chobitsu'
import { classPrefix as c } from '../lib/util'

export default class Cookie {
  constructor($container, devtools) {
    this._$container = $container
    this._devtools = devtools
    this._filter = ''

    this._bindEvent()
  }
  refresh() {
    const $container = this._$container
    const filter = this._filter

    const { cookies } = chobitsu.domain('Network').getCookies()
    let cookieData = map(cookies, ({ name, value }) => ({
      key: name,
      val: value,
    }))

    cookieData = filterData(cookieData, filter)
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

    setState($container, cookieState)

    $container.html(`<h2 class="${c('title')}">
      Cookie
      <div class="${c('btn refresh-cookie')}">
        <span class="${c('icon-refresh')}"></span>
      </div>
      <div class="${c('btn clear-cookie')}">
        <span class="${c('icon-clear')}"></span>
      </div>
      <div class="${c('btn filter')}" data-type="cookie">
        <span class="${c('icon-filter')}"></span>
      </div>
      ${
        filter
          ? `<div class="${c('btn filter-text')}">${escape(filter)}</div>`
          : ''
      }
    </h2>
    <div class="${c('content')}">
      <table>
        <tbody>
          ${cookieDataHtml}
        </tbody>
      </table>
    </div>`)
  }
  _bindEvent() {
    const devtools = this._devtools
    const self = this

    this._$container
      .on('click', c('.refresh-cookie'), () => {
        devtools.notify('Refreshed')
        this.refresh()
      })
      .on('click', c('.clear-cookie'), () => {
        chobitsu.domain('Storage').clearDataForOrigin({
          storageTypes: 'cookies',
        })
        this.refresh()
      })
      .on('click', c('.delete-cookie'), function () {
        const key = $(this).data('key')

        chobitsu.domain('Network').deleteCookies({ name: key })
        self.refresh()
      })
      .on('click', c('.filter'), () => {
        LunaModal.prompt('Filter').then((filter) => {
          if (isNull(filter)) return
          filter = trim(filter)
          this._filter = filter
          this.refresh()
        })
      })
  }
}
