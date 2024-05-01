const ErudaDiv = document
  .querySelector('#eruda')
  .shadowRoot.querySelector(
    'div > div.eruda-dev-tools > div.eruda-tab > div.luna-tab-tabs-container > div'
  )

const tabInfo = [
  { id: 'console', text: '控制台' },
  { id: 'elements', text: '元素' },
  { id: 'network', text: '网络' },
  { id: 'resources', text: '资源' },
  { id: 'sources', text: '源码' },
  { id: 'info', text: '信息' },
  { id: 'snippets', text: '片段' },
  { id: 'settings', text: '设置' },
]

tabInfo.forEach((item) => {
  const tab = ErudaDiv.querySelector(`.luna-tab-item[data-id="${item.id}"]`)
  if (tab) {
    tab.textContent = item.text
  }
})
