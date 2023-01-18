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
    name: 'User Agent',
    val: navigator.userAgent,
  },
  {
    name: 'Device',
    val: [
      '<table><tbody>',
      `<tr><td class="eruda-device-key">screen</td><td>${screen.width} * ${screen.height}</td></tr>`,
      `<tr><td>viewport</td><td>${window.innerWidth} * ${window.innerHeight}</td></tr>`,
      `<tr><td>pixel ratio</td><td>${window.devicePixelRatio}</td></tr>`,
      '</tbody></table>',
    ].join(''),
  },
  {
    name: 'System',
    val: [
      '<table><tbody>',
      `<tr><td class="eruda-system-key">os</td><td>${detectOs()}</td></tr>`,
      `<tr><td>browser</td><td>${
        browser.name + ' ' + browser.version
      }</td></tr>`,
      '</tbody></table>',
    ].join(''),
  },
  {
    name: 'About',
    val:
      '<a href="https://eruda.liriliri.io" target="_blank">Eruda v' +
      VERSION +
      '</a>',
  },
  {
    name: 'Backers',
    val() {
      return `<a rel="noreferrer noopener" href="https://opencollective.com/eruda" target="_blank"><img style="width: 100%;"src="https://opencollective.com/eruda/backers.svg?width=${
        window.innerWidth * 1.5
      }"></a>`
    },
  },
]
