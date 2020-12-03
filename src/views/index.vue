<template>
  <div id="index">
    <div class="indexMain">
      <!-- 导航栏 -->
      <div class="navMain">
        <div class="clientInfo">
          <div class="icon">
            <img src="../assets/image/noPic.jpg" />
          </div>
          <div class="sampleName">简写短一点</div>
          <div class="allName">全程长一点长一点</div>
        </div>
        <div class="navCtn">
          <div class="nav"
            v-for="(item,index) in navList"
            :key="index"
            :class="{'active':item.active}"
            @click="$router.push(item.url)">
            <div class="icon">
              <img :src="item.icon || require('@/assets/image/noPic.jpg')" />
            </div>
            <span class="name">{{item.name}}</span>
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
// 导航栏
interface NavInfo {
  name: string
  url: string
  icon?: string
  hoverIcon?: string
  active?: boolean
}
@Component
export default class Index extends Vue {
  navList: NavInfo[] = []
  created() {
    this.navList = [
      { name: '首页', url: '/index', active: true },
      { name: '列表通用样式', url: '/css/list' },
      { name: '详情通用样式', url: '/css/detail' },
      { name: '添加通用样式', url: '/css/create' },
      { name: '产品管理', url: '/product/list' },
      { name: '订单管理', url: '/index' },
      { name: '主播管理', url: '/index' },
      { name: '个人中心', url: '/index' },
      { name: '系统设置', url: '/setting/main' }
    ]
  }
}
</script>
<style lang="less" scoped>
@import '~@/assets/less/index/index.less';
</style>