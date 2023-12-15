import { sendMessageToContentScript } from '../utils/status'

console.log('this is background.js')
// 初次安装
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // 初次安装的时候，保存安装方式
    chrome.management.getSelf(e => {
      chrome.storage.local.set({ installType: e.installType })
    })
  }
})

// 接收消息
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (typeof msg === 'object' && 'action' in msg) {
    switch (msg.action) {
      case 'onmessage':
        console.log('接收消息')
        break
    }
  }
})

// 原理
// 点进去以后会读上传的图片https://partner.microsoft.com/dashboard/microsoftedge/staticres/assets/uploadPlaceholder.png
// 回到主页会读主页json https://partner.microsoft.com/zh-cn/dashboard/microsoftedge/api/Package/dcc03cf0-0a5e-4a43-a664-7f05a001a970/lastUploadedPackage
// 保存成功读https://partner.microsoft.com/zh-cn/dashboard/microsoftedge/api/DCC03CF0-0A5E-4A43-A664-7F05A001A970/FocusNav
chrome.webRequest.onCompleted.addListener(
  function (details) {
    const url = details.url
    if (url.includes('https://partner.microsoft.com/dashboard/microsoftedge/staticres/assets/uploadPlaceholder.png')) {
      console.log('进入编辑')
      sendMessageToContentScript(details.tabId, { action: 'save' })
    } else if (url.includes('lastUploadedPackage')) {
      console.log('回到首页')
      sendMessageToContentScript(details.tabId, { action: 'startNexkEdit' })
    } else if (url.includes('FocusNav')) {
      console.log('保存成功')
      sendMessageToContentScript(details.tabId, { action: 'close' })
    }
  },
  { urls: ['<all_urls>'] }
)
