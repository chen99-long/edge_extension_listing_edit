<template>
  <div id="app">
    <div v-if="isListPage" class="listPage">
      以后有空了再写
    </div>
    <div v-else>
      打开edge语言配置页面使用
    </div>
  </div>
</template>

<script>
import { sendMessageToContentScript } from '../utils/status'
export default {
  data () {
    return {
      regex: /https:\/\/partner\.microsoft\.com\/.*\/listings/,
      isListPage: false
    }
  },
  created () {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const url = tabs[0].url
      this.isListPage = this.regex.test(url)
      this.isListPage && await sendMessageToContentScript(tabs[0].id, { action: 'commandShow' })
      window.close()
    })
  }
}
</script>

<style scoped>

</style>
