<template>
  <div id="sendMsg"
    class="createCtnNoRepeat">
    <div class="header">
      <div class="title">发送公告</div>
    </div>
    <div class="moduleCtn">
      <div class="module">
        <div class="titleCtn">
          <div class="title">填写信息</div>
        </div>
        <div class="contentCtn">
          <div class="lineCtn">
            <div class="label">通知类型：</div>
            <div class="line">
              <div class="btns">
                <span class="btn blue"
                  :class="{'active':type==='普通'}"
                  @click="type='普通'">普通</span>
              </div>
              <div class="btns">
                <span class="btn yellow"
                  :class="{'active':type==='重要'}"
                  @click="type='重要'">重要</span>
              </div>
              <div class="btns">
                <span class="btn red"
                  :class="{'active':type==='紧急'}"
                  @click="type='紧急'">紧急</span>
              </div>
            </div>
          </div>
          <div class="lineCtn">
            <div class="label">通知标题：</div>
            <div class="line">
              <el-input class="eldom"
                placeholder="请输入通知标题"
                v-model="title"></el-input>
            </div>
          </div>
          <div class="lineCtn">
            <div class="label">通知信息：</div>
            <div class="line">
              <div ref='editor'></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnBlue"
            @click="saveMsg">提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import Editor from 'wangeditor'
import E from 'wangeditor'
import { notify, user } from '@/assets/js/api'
import { UserInfo } from '@/types/setting'
export default Vue.extend({
  data(): {
    type: string
    editor: any
    title: string
    content: HTMLElement
    user_list: UserInfo[]
  } {
    return {
      type: '普通',
      title: '',
      editor: '',
      user_list: [],
      content: ('' as unknown) as HTMLElement
    }
  },
  methods: {
    saveMsg() {
      console.log(this.content)
      notify
        .send({
          type: this.type,
          title: this.title,
          content: this.content,
          receive_user: this.user_list.map((item) => item.id as number)
        })
        .then((res) => {
          if (res.data.status) {
            this.$message.success('发送成功')
          }
        })
    }
  },
  mounted() {
    this.editor = new E(this.$refs.editor as HTMLElement)
    this.editor.config.menus = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      'emoticon', // 表情
      // 'image', // 插入图片
      // 'table', // 表格
      // 'video', // 插入视频
      // 'code', // 插入代码
      'undo', // 撤销
      'redo', // 重复
      'fullscreen' // 全屏
    ]
    this.editor.config.onchange = (html: HTMLElement) => {
      this.content = html // 绑定当前逐渐地值
    }
    this.editor.create()
    user.list().then((res) => {
      this.user_list = res.data.data
    })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/setting/sendMsg.less';
</style>