// import "../content-scripts/content-script"
import Vue from 'vue'
import App from '../page/App.vue'

window.vm = new Vue({
  el: '#app',
  render: h => h(App)
})
