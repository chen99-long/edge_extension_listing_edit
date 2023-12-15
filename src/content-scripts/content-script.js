
import Vue from 'vue'
import InfoBox from './view/infoBox.vue'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
Vue.use(ElementUI)
// 注入一个小窗口
const infoBox = document.createElement('div')
infoBox.className = 'info-box-app'
infoBox.id = 'info-box-app'
document.body.appendChild(infoBox)
window.infoBoxVm = new Vue({
  el: '#info-box-app',
  render: h => h(InfoBox)
})

// 改变elementUI的font位置
const fontStr = `
<style>
@font-face {
  font-family: element-icons;
  src: url(${chrome.runtime.getURL('fonts')}/element-icons.535877f5.woff)
      format('woff'),
    url(${chrome.runtime.getURL('fonts')}/element-icons.732389de.ttf)
      format('truetype');
  font-weight: 400;
  font-display: 'auto';
  font-style: normal;
}
</style>
`

document.body.insertAdjacentHTML('beforeEnd', fontStr)
