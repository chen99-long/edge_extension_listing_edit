export const statusMap = {
  pause: 'pause', start: 'start', stop: 'stop'
}
// 给content-script通信
export function sendMessageToContentScript (tabId, message, callback) {
  chrome.tabs.sendMessage(tabId, message).then(res => callback && callback(res))
}
