const ErudaDiv = document
  .querySelector("#eruda")
  .shadowRoot.querySelector(
    "div > div.eruda-dev-tools > div.eruda-tab.luna-tab.luna-tab-platform-windows.luna-tab-theme-light > div.luna-tab-tabs-container > div"
  );

const tabInfo = [
  { id: "console", text: "控制台" },
  { id: "elements", text: "元素" },
  { id: "network", text: "网络" },
  { id: "info", text: "信息" },
  { id: "settings", text: "设置" },
];

tabInfo.forEach((item) => {
  const tab = ErudaDiv.querySelector(`.luna-tab-item[data-id="${item.id}"]`);
  if (tab) {
    tab.textContent = item.text;
  }
});
