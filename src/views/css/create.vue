<template>
  <div class="createCtnNoRepeat">
    <div class="header">
      <div class="title">添加页大标题</div>
    </div>
    <div class="moduleCtn">
      <div class="module">
        <div class="titleCtn">
          <div class="title">添加页面</div>
        </div>
        <div class="contentCtn">
          <div class="lineCtn">
            <div class="label">能放7个字：</div>
            <div class="line">
              <el-input class="eldom"
                placeholder="输入框1"
                v-model="value"></el-input>
            </div>
          </div>
          <div class="lineCtn">
            <div class="label">右对齐：</div>
            <div class="line">
              <el-input class="eldom"
                placeholder="输入框1"
                v-model="value"></el-input>
              <div class="oprBtn add">
                <i class="el-icon-plus"></i>
              </div>
              <div class="oprBtn addAfterDelete">
                <i class="el-icon-minus"></i>
              </div>
            </div>
            <div class="line">
              <el-input class="eldom"
                placeholder="输入框2"
                v-model="value"></el-input>
              <div class="oprBtn delete">
                <i class="el-icon-minus"></i>
              </div>
            </div>
          </div>
          <div class="lineCtn">
            <div class="label">多个输入框：</div>
            <div class="line oneLine">
              <el-input class="eldom"
                placeholder="输入框1"
                v-model="value"></el-input>
              <el-input class="eldom"
                placeholder="输入框1"
                v-model="value"></el-input>
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
          <div class="btn btnBlue">提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Create extends Vue {
  value: string = ''
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/common.less';
</style>