import isEmpty from 'licia/isEmpty'
import map from 'licia/map'
import each from 'licia/each'
import isStr from 'licia/isStr'
import startWith from 'licia/startWith'
import truncate from 'licia/truncate'
import escape from 'licia/escape'
import $ from 'licia/$'
import LunaModal from 'luna-modal'
import isNull from 'licia/isNull'
import trim from 'licia/trim'
import { safeStorage, classPrefix as c } from '../lib/util'
import { filterData } from './util'

export default class Storage {
  constructor($container, devtools, resources, type) {
    this._type = type
    this._$container = $container
    this._devtools = devtools
    this._resources = resources
    this._filter = ''
    this._storeData = []

    this._bindEvent()
  }
  refresh() {
    const filter = this._filter

    this._refreshStorage()

    const storeData = filterData(this._storeData, filter)
    let storeDataHtml = '<tr><td>Empty</td></tr>'
    if (!isEmpty(storeData)) {
      storeDataHtml = map(storeData, ({ key, val }) => {
        key = escape(key)

        return `<tr>
          <td class="${c('key')}">${key}</td>
          <td class="${c('storage-val')}" data-key="${key}">${escape(val)}</td>
          <td class="${c('control')}">
            <span class="${c(
              'icon-delete delete-storage'
            )}" data-key="${key}"></span>
          </td>
        </tr>`
      }).join('')
    }

    this._$container.html(`<h2 class="${c('title')}">
      Local Storage
      <div class="${c('btn refresh-storage')}">
        <span class="${c('icon-refresh')}"></span>
      </div>
      <div class="${c('btn clear-storage')}">
        <span class="${c('icon-clear')}"></span>
      </div>
      <div class="${c('btn filter')}">
        <span class="${c('icon-filter')}"></span>
      </div>
      ${
        filter
          ? `<div class="${c('btn search-keyword')}">${escape(filter)}</div>`
          : ''
      }
    </h2>
    <div class="${c('content')}">
      <table>
        <tbody>
          ${storeDataHtml}
        </tbody>
      </table>
    </div>`)
  }
  _refreshStorage() {
    const resources = this._resources

    let store = safeStorage(this._type, false)

    if (!store) return

    const storeData = []

    // Mobile safari is not able to loop through localStorage directly.
    store = JSON.parse(JSON.stringify(store))

    each(store, (val, key) => {
      // According to issue 20, not all values are guaranteed to be string.
      if (!isStr(val)) return

      if (resources.config.get('hideErudaSetting')) {
        if (startWith(key, 'eruda') || key === 'active-eruda') return
      }

      storeData.push({
        key: key,
        val: truncate(val, 200),
      })
    })

    this._storeData = storeData
  }
  _bindEvent() {
    const type = this._type
    const devtools = this._devtools
    const self = this

    this._$container
      .on('click', c('.refresh-storage'), () => {
        devtools.notify('Refreshed')
        this.refresh()
      })
      .on('click', c('.clear-storage'), function () {
        each(self._storeData, (val) => {
          if (type === 'local') {
            localStorage.removeItem(val.key)
          } else {
            sessionStorage.removeItem(val.key)
          }
        })
        self.refresh()
      })
      .on('click', c('.storage-val'), function () {
        const $this = $(this)
        const key = $this.data('key')

        const val =
          type === 'local'
            ? localStorage.getItem(key)
            : sessionStorage.getItem(key)

        try {
          showSources('object', JSON.parse(val))
        } catch (e) {
          showSources('raw', val)
        }
      })
      .on('click', c('.filter'), function () {
        LunaModal.prompt('Filter').then((filter) => {
          if (isNull(filter)) return
          filter = trim(filter)
          self._filter = filter
          self.refresh()
        })
      })
      .on('click', c('.delete-storage'), function () {
        const $this = $(this)
        const key = $this.data('key')

        if (type === 'local') {
          localStorage.removeItem(key)
        } else {
          sessionStorage.removeItem(key)
        }

        self.refresh()
      })

    function showSources(type, data) {
      const sources = devtools.get('sources')
      if (!sources) return

      sources.set(type, data)

      devtools.showTool('sources')

      return true
    }
  }
}
