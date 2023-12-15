<template>
  <div v-show="show" id="infoBox">
    <div class="box">
      <div class="title">描述：</div>
      <el-input v-model="description" placeholder="输入描述"></el-input>
    </div>
    <div class="box">
      <div class="title">关键词：</div>
      <el-tag
        :key="tag"
        v-for="tag in keywordList"
        closable
        :disable-transitions="false"
        @close="handleClose(tag)">
        {{tag}}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="inputVisible"
        v-model="inputValue"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
      >
     </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新增关键词</el-button>
  </div>
  <div class="box">
    <div class="title">开始位置</div>
    <el-select v-model="num" placeholder="请选择">
    <el-option
      v-for="(item,i) in tableList"
      :key="i"
      :label="i+1+'--'+item"
      :value="i">
    </el-option>
  </el-select>
  </div>
  <div class="box" style="text-align: center;">
     <el-progress type="circle" :percentage="num/tableList.length*100"  :format="format"></el-progress>
 </div>
  <div @click="pause" v-if="status === statusMap.start" class="startBtn">停止</div>
  <div @click="start(message)" class="startBtn" v-else>启动</div>
</template>

<script>
import { statusMap } from '../../utils/status'
// 给页面输入内容
// var evt = new InputEvent('input', {
//   inputType: 'insertText',
//   data: '',
//   dataTransfer: null,
//   isComposing: false
// })

export default {
  data () {
    return {
      description: '',
      keywordList: [],
      num: 0,
      status: statusMap.stop,
      inputVisible: false,
      inputValue: '',
      tableList: [],
      message: { action: 'startNexkEdit' },
      statusMap,
      show: true
    }
  },
  methods: {
    // 进度条
    format (percentage) {
      if (!this.tableList.length) {
        return '正在初始化...'
      }
      return percentage === 100 ? '已完成' : `${this.num}/${this.tableList.length}`
    },
    // 保存表单并保存
    startFilling () {
      const evt = new InputEvent('input', {
        inputType: 'insertText',
        data: '',
        dataTransfer: null,
        isComposing: false
      })
      // 填写描述
      document.querySelector('textarea.form-control').value = this.description
      document.querySelector('textarea.form-control').dispatchEvent(evt)
      // 遍历填写关键词
      // 先删除所有关键词
      document.querySelectorAll('.search-term-bubble-display a:nth-child(2)').forEach(closebtn => closebtn.click())
      for (let i = 0; i < this.keywordList.length; i++) {
        if (document.querySelectorAll('.search-term-bubble-display').length >= this.keywordList.length) break // 如果已经填过了，就不要填了
        document.querySelector('#last-search-item').value = this.keywordList[i]
        document.querySelector('#last-search-item').dispatchEvent(evt)
        document.querySelectorAll('.ng-dirty .btn-link')[document.querySelectorAll('.ng-dirty .btn-link').length - 1].click()
      }
      console.log('表单填写完成，开始保存')
      if (document.querySelectorAll('he-button')[0].shadowRoot.querySelector('.control')) {
        console.log(document.querySelectorAll('he-button')[0].shadowRoot.querySelector('.control'))
        document.querySelectorAll('he-button')[0].shadowRoot.querySelector('.control').click()
      } else {
        console.log('没找到保存按钮')
      }
    },
    // 如果在首页，则点击进入下一个编辑
    startNexkEdit () {
      if (this.num >= this.tableList.length) {
        // 全部完成，结束运行
        console.log('全部完成，结束运行')
        this.status = statusMap.stop
        return
      }
      console.log('当前位置' + this.num)
      document.querySelectorAll('#edit-button')[this.num].click()
      this.num++
    },
    close () {
      document.querySelectorAll('he-button')[1].shadowRoot.querySelector('.control').click()
    },
    run (msg) {
      switch (msg.action) {
        case 'startNexkEdit':
          this.startNexkEdit()
          break
        case 'save':
          console.log('保存表单')
          this.startFilling()
          break
        case 'close':
          console.log('关闭表单')
          this.close()
          break
        default:
          break
      }
    },
    start (msg) {
      if (!this.description && !this.keywordList.length) {
        return alert('输入描述关键词')
      }
      if (!this.tableList.length) {
        return alert('正在初始化语言包，请稍等')
      }
      console.log('开始运行，给启动器发送讯息启动')
      this.status = statusMap.start

      this.run(msg)
    },
    pause () {
      console.log('暂停')
      this.status = statusMap.pause
    },
    // tag标签
    handleClose (tag) {
      this.keywordList.splice(this.keywordList.indexOf(tag), 1)
    },

    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm () {
      const inputValue = this.inputValue
      if (inputValue) {
        this.keywordList.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    }

  },
  created () {
    console.log('edge语言包初始化完成')
    // 接收消息
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      console.log(msg)
      if (typeof msg === 'object' && 'action' in msg) {
        if (msg.action === 'commandShow') {
          this.show = !this.show
        }
        console.log('当前状态------' + this.status)
        // 如果正在执行，就继续
        if (this.status === statusMap.start) {
          const timer = setTimeout(() => {
            this.run(msg)
            clearTimeout(timer)
          }, 1000)
        } else if (this.status === statusMap.pause) {
          // 如果已经取消，就保存当前位置
          this.message = msg
          console.log('save pause status' + this.message)
        } else if (this.status === statusMap.stop) {
          // TODO 语义不明确，close命令收到代表首页列表加载完成
          if (!this.tableList.length && msg.action === 'close') {
            this.tableList = [...document.querySelectorAll('#extensionListTable tbody tr')].map((item, index) => {
              return item.querySelector('span').innerText
            })
            console.log('初始化语言列表' + this.tableList)
          }
        }
      }
    })
  },
  mounted () {
  }
}
</script>

<style>
#infoBox{
  position: fixed;
  left: 20px;
  bottom: 20px;
  z-index: 2000;
  background-color: pink;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 0 10px #0000004d;
}
 #infoBox .el-tag + .el-tag {
    margin-left: 10px;
  }
 #infoBox .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
#infoBox  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
 #infoBox .startBtn{
padding: 7px 16px;
    margin: 4px auto;
    background: skyblue;
    border-radius: 7px;
    text-align: center;
    width: 108px;
    cursor: pointer;
  }
   #infoBox .startBtn:hover{
    background: rgb(128, 208, 239);
   }
  #infoBox .box{
    margin-bottom: 5px;
    max-width: 260px;
  }
</style>
