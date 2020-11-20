<template>
  <div id="index">
    <div class="indexMain">
      <!-- 导航栏 -->
      <div class="navMain">
        <div class="clientInfo">
          <div class="icon">图标</div>
          <div class="sampleName">简写</div>
          <div class="allName">全程长一点</div>
        </div>
        <div class="navCtn">
          <div class="nav"
            v-for="(item,index) in navList"
            :key="index">
            <div class="icon">{{item.icon}}</div>
            <div class="name">{{item.name}}</div>
          </div>
        </div>
      </div>
      <!-- 内容/用户区 -->
      <div class="userMain">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
interface navInfo {
  name: string
  icon?: string
}
@Component
export default class Index extends Vue {
  navList: Array<navInfo> = []
  created() {
    this.navList = [
      { name: '首页', icon: '首页图标' },
      { name: '产品列表', icon: '图标' }
    ]
  }
}
</script>
<style lang="less" scoped>
@import '~@/assets/less/index/index.less';
</style>