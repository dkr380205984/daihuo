<template>
  <div id="index">
    <div class="indexMain">
      <!-- 导航栏 -->
      <div class="navMain">
        <div class="clientInfo">
          <div class="icon">
            <img src="../assets/image/index/图标.jpg" />
          </div>
          <div class="sampleName">中国围巾城</div>
          <div class="allName">China Scarf City</div>
        </div>
        <div class="navCtn">
          <div class="nav"
            v-for="(item,index) in navList"
            :key="index"
            :class="{'active':$route.name===item.name}"
            @click="goRouter(item)">
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
import { Vue } from 'vue-property-decorator'
// 导航栏
interface NavInfo {
  name: string
  url: string
  icon?: string
  hoverIcon?: string
  active?: boolean
}
export default Vue.extend({
  data(): { navList: NavInfo[]; [propName: string]: any } {
    return {
      actived: '首页',
      navList: [
        { name: '首页', url: '/index/main', icon: require('@/assets/image/index/首页.png') },
        {
          name: '产品管理',
          url: '/product/list/page=1&&keyword=&&date=&&client_id=&&user_id=&&type=0&&types=null',
          icon: require('@/assets/image/index/产品管理.png')
        },
        {
          name: '库存管理',
          url: '/store/list/page=1&&keyword=&&date=&&client_id=&&user_id=&&type=0',
          icon: require('@/assets/image/index/库存管理.png')
        },
        {
          name: '出入库日志',
          url: '/store/logList/page=1&&keyword=&&date=&&type=&&search_type=0&&store_id=&&data_source=0',
          icon: require('@/assets/image/index/出入库日志.png')
        },
        {
          name: '订单管理',
          url: '/order/list/page=1&&keyword=&&date=&&type=0',
          icon: require('@/assets/image/index/订单管理.png')
        },
        {
          name: '品类设置',
          url: '/setting/category/page=1&&keyword=',
          icon: require('@/assets/image/index/品类设置.png')
        },
        {
          name: '系统设置',
          url: '/setting/main/page=1&&keyword=&&type=user',
          icon: require('@/assets/image/index/系统设置.png')
        },
        { name: '发布公告', url: '/setting/sendMsg', icon: require('@/assets/image/index/发布公告.png') }
      ]
    }
  },
  methods: {
    goRouter(item: NavInfo) {
      this.$router.push(item.url)
    }
  },
  mounted() {
    if (JSON.parse(window.localStorage.getItem('userInfo') as string).type !== 1) {
      this.navList = [
        { name: '首页', url: '/index/main', icon: require('@/assets/image/index/首页.png') },
        {
          name: '产品管理',
          url: '/product/list/page=1&&keyword=&&date=&&client_id=&&user_id=&&type=0&&types=null',
          icon: require('@/assets/image/index/产品管理.png')
        },
        {
          name: '库存管理',
          url: '/store/list/page=1&&keyword=&&date=&&client_id=&&user_id=&&type=0',
          icon: require('@/assets/image/index/库存管理.png')
        },
        {
          name: '出入库日志',
          url: '/store/logList/page=1&&keyword=&&date=&&type=&&search_type=0&&store_id=',
          icon: require('@/assets/image/index/出入库日志.png')
        },
        {
          name: '订单管理',
          url: '/order/list/page=1&&keyword=&&date=&&type=0',
          icon: require('@/assets/image/index/订单管理.png')
        },
        {
          name: '品类设置',
          url: '/setting/category/page=1&&keyword=',
          icon: require('@/assets/image/index/品类设置.png')
        },
        {
          name: '系统设置',
          url: '/setting/main/page=1&&keyword=&&type=user',
          icon: require('@/assets/image/index/系统设置.png')
        }
      ]
      if (JSON.parse(window.localStorage.getItem('userInfo') as string).type === 3) {
        this.navList = [
          { name: '首页', url: '/index/main', icon: require('@/assets/image/index/首页.png') },
          {
            name: '产品管理',
            url: '/product/list/page=1&&keyword=&&date=&&client_id=&&user_id=&&type=0&&types=null',
            icon: require('@/assets/image/index/产品管理.png')
          },
          {
            name: '订单管理',
            url: '/order/list/page=1&&keyword=&&date=&&type=0',
            icon: require('@/assets/image/index/订单管理.png')
          }
        ]
      }
      if (JSON.parse(window.localStorage.getItem('userInfo') as string).type === 4) {
        this.navList = [
          { name: '首页', url: '/index/main', icon: require('@/assets/image/index/首页.png') },
          {
            name: '产品管理',
            url: '/product/list/page=1&&keyword=&&date=&&client_id=&&user_id=&&type=0&&types=null',
            icon: require('@/assets/image/index/产品管理.png')
          }
        ]
      }
    }
  }
})
</script>
<style lang="less" scoped>
@import '~@/assets/less/index/index.less';
</style>