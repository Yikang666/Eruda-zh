const ErudaDiv = document
  .querySelector('#eruda')
  .shadowRoot.querySelector(
    'div > div.eruda-dev-tools > div.eruda-tab > div.luna-tab-tabs-container > div'
  )

const tabInfo = [
  { id: 'console', text: '\u63a7\u5236\u53f0' },
  { id: 'elements', text: '\u5143\u7d20' },
  { id: 'network', text: '\u7f51\u7edc' },
  { id: 'info', text: '\u4fe1\u606f' },
  { id: 'settings', text: '\u8bbe\u7f6e' },
]

tabInfo.forEach((item) => {
  const tab = ErudaDiv.querySelector(`.luna-tab-item[data-id="${item.id}"]`)
  if (tab) {
    tab.textContent = item.text
  }
})
