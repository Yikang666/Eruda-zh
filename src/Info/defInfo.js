import detectBrowser from 'licia/detectBrowser'
import detectOs from 'licia/detectOs'
import escape from 'licia/escape'

const browser = detectBrowser()

export default [
  {
    name: 'Location',
    val() {
      return escape(location.href)
    },
  },
  {
    name: '\u7528\u6237\u4ee3\u7406',
    val: navigator.userAgent,
  },
  {
    name: '\u8bbe\u5907',
    val: [
      '<table><tbody>',
      `<tr><td class="eruda-device-key">\u5c4f\u5e55\u5206\u8fa8\u7387</td><td>${screen.width} * ${screen.height}</td></tr>`,
      `<tr><td>\u89c6\u53e3\u5206\u8fa8\u7387</td><td>${window.innerWidth} * ${window.innerHeight}</td></tr>`,
      `<tr><td>\u50cf\u7d20\u6bd4</td><td>${window.devicePixelRatio}</td></tr>`,
      '</tbody></table>',
    ].join(''),
  },
  {
    name: '\u7cfb\u7edf',
    val: [
      '<table><tbody>',
      `<tr><td class="eruda-system-key">\u64cd\u4f5c\u7cfb\u7edf</td><td>${detectOs()}</td></tr>`,
      `<tr><td>\u6d4f\u89c8\u5668</td><td>${
        browser.name + ' ' + browser.version
      }</td></tr>`,
      '</tbody></table>',
    ].join(''),
  },
  {
    name: '\u5173\u4e8e',
    val:
      '<a href="https://eruda.liriliri.io" target="_blank">Eruda v' +
      VERSION +
      '</a>&nbsp;&nbsp<a href="https://github.com/Yikang666/Eruda-zh" target="_blank">Eruda-zh</a>',
  },
  {
    name: '\u652f\u6301\u8005',
    val() {
      return `<a rel="noreferrer noopener" href="https://opencollective.com/eruda" target="_blank"><img data-exclude="true" style="width: 100%;"src="https://opencollective.com/eruda/backers.svg?width=${
        window.innerWidth * 1.5
      }&exclude=true"></a>`
    },
  },
]
