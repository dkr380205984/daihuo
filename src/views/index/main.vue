<template>
  <div id="indexMain"
    class="detailCtnNoRepeat"
    v-loading="loading">
    <div class="header">
      <div class="title">首页</div>
    </div>
    <div class="moduleCtn">
      <div class="module flexBt">
        <div class="left">
          <div class="circle">{{user_info.name.substring(0,1)}}</div>
          <div class="nameCtn">
            <div class="line">欢迎！{{user_info.name}}</div>
            <div class="line"
              style="color:rgba(0,0,0,0.45);font-size:14px">{{user_info.type===1?'平台账号':user_info.type===2?'运营商':user_info.type===3?'主播':'工厂人员'}}</div>
          </div>
        </div>
        <div class="right">
          <div class="once">
            <span class="name">下单数</span>
            <span class="number blue">{{stock_sts.total}}</span>
          </div>
          <div class="once">
            <span class="name">已入库</span>
            <span class="number green">{{stock_sts.push}}</span>
          </div>
          <div class="once">
            <span class="name">待入库</span>
            <span class="number orange">{{stock_sts.wait_push}}</span>
          </div>
        </div>
      </div>
      <div class="module">
        <div class="titleCtn">
          <div class="title">搜索</div>
        </div>
        <div class="content">
          <div class="searchCtn">
            <el-input class="input"
              placeholder="请输入产品/sku/订单编号按回车搜索"
              v-model="search_value"
              @keydown.native.enter="searchInfo">
              <i slot="suffix"
                class="el-input__icon el-icon-search"></i>
              <!-- <el-select v-model="search_type"
                slot="prepend"
                class="select"
                placeholder="请选择">
                <el-option label="所有"
                  value="1"></el-option>
                <el-option label="sku编号"
                  value="2"></el-option>
                <el-option label="产品编号"
                  value="3"></el-option>
              </el-select> -->
            </el-input>
            <div class="btn btnBlue"
              @click="searchInfo">搜索</div>
          </div>
          <div class="seachHistory">
            <div class="container">
              <span class="label">近期搜索记录</span>
              <span class="normal"
                v-for="(item,index) in history"
                :key="index"
                @click="searchHistory(item)">{{item}}</span>
            </div>
            <div class="btn noBorder"
              @click="resetHistory">清空历史</div>
          </div>
          <div class="searchBox"
            v-show="show_search"
            v-loading="search_loading">
            <i class="el-icon-circle-close icons"
              @click="show_search = false"></i>
            <div class="block">
              <div class="titled">sku搜索相关</div>
              <div class="info"
                v-for="item in sku_list"
                :key="item.sku_code">
                <span class="text blue"
                  @click="openUrl(item.product_id)">{{item.sku_code}}</span>
              </div>
              <div class="noMsg"
                v-if="sku_list.length===0">暂无sku相关信息</div>
            </div>
            <div class="block">
              <div class="titled">产品搜索相关</div>
              <div class="info"
                v-for="item in product_list"
                :key="item.id">
                <span class="text blue"
                  @click="openUrl(item.id)">{{item.product_code}}</span>
              </div>
              <div class="noMsg"
                v-if="product_list.length===0">暂无产品相关信息</div>
            </div>
            <div class="block">
              <div class="titled">订单搜索相关</div>
              <div class="info"
                v-for="item in order_list"
                :key="item.id">
                <span class="text blue">{{item.order_code}}</span>
              </div>
              <div class="noMsg"
                v-if="order_list.length===0">暂无订单相关信息</div>
            </div>
          </div>
        </div>
      </div>
      <div class="module">
        <div class="titleCtn">
          <div class="title">推荐款式</div>
        </div>
        <div class="imgCtn">
          <div class="once"
            v-for="item in recommand_list"
            :key="item.id">
            <div class="img">
              <el-image :src="item.images[0]?item.images[0].image_url:require('@/assets/image/noPic.jpg')"
                :preview-src-list="item.images.length>0?item.images.map((item)=>item.image_url):[require('@/assets/image/noPic.jpg')]">
              </el-image>
            </div>
            <div class="name"
              @click="$router.push('/product/detail/' + item.id)">{{item.name}}</div>
          </div>
        </div>
      </div>
      <div style="display:flex">
        <div class="module"
          style="flex:1;margin-right:20px">
          <div class="titleCtn">
            <div class="title">系统公告</div>
          </div>
          <div class="msgCtn">
            <div class="msg"
              v-for="item in msg_list"
              :key="item.id">
              <span class="type"
                :class="{'blue':item.type==='普通','red':item.type==='紧急','orange':item.type==='重要'}">{{item.type}}</span>
              <span class="user">{{item.user_name||'系统公告'}}</span>
              <span class="time">{{$diffDate(item.created_at)}}</span>
              <span class="html"
                @click="lookDetail(item)">{{item.title}}</span>
              <span class="detail blue"
                @click="lookDetail(item)">查看公告</span>
            </div>
          </div>
        </div>
        <div class="module"
          style="width:320px">
          <div class="titleCtn">
            <div class="title">微信小程序</div>
          </div>
          <div class="codeCtn">
            <div class="code">
              <img style="width:100%;height:100%"
                src="https://zhihui.tlkrzf.com/1610079833000.jpg" />
            </div>
            <div class="text">扫一扫使用微信小程序</div>
          </div>
        </div>
      </div>
      <div class="module">
        <div class="titleCtn">
          <div class="title">订单数量统计</div>
        </div>
        <div ref="chart"
          style="width: 1192px;height:200px;"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { order, product, statistics, serach, notify } from '@/assets/js/api'
import { NotifyInfo } from '@/types/notify'
export default Vue.extend({
  data(): {
    history: string[]
    search_value: string
    search_loading: boolean
    show_search: boolean
    search_type: string
    [propName: string]: any
  } {
    return {
      loading: true,
      user_info: JSON.parse(window.localStorage.getItem('userInfo') as string),
      search_type: '1',
      search_value: '',
      search_loading: false,
      history: window.localStorage.getItem('searchHistory')
        ? JSON.parse(window.localStorage.getItem('searchHistory') as string)
        : [],
      show_search: false,
      recommand_list: [],
      sku_list: [],
      product_list: [],
      order_list: [],
      msg_list: [],
      stock_sts: {
        push: 0,
        total: 0,
        wait_push: 0
      }
    }
  },
  methods: {
    searchInfo() {
      if (!this.search_value) {
        this.$message.error('请输入产品/sku/订单编号按回车搜索')
        return
      }
      this.search_loading = true
      this.show_search = true
      if (!this.history.find((item) => item === this.search_value)) {
        if (this.history.length < 10) {
          this.history.unshift(this.search_value)
        } else {
          this.history.unshift(this.search_value)
          this.history.pop()
        }
        window.localStorage.setItem('searchHistory', JSON.stringify(this.history))
      }
      serach
        .mainSearch({
          keyword: this.search_value
        })
        .then((res) => {
          console.log(res)
          this.product_list = res.data.data.product
          this.sku_list = res.data.data.sku
          this.order_list = res.data.data.order
          this.search_loading = false
        })
    },
    resetHistory() {
      this.history = []
      window.localStorage.setItem('searchHistory', JSON.stringify([]))
    },
    searchHistory(item: string) {
      this.search_value = item
      this.searchInfo()
    },
    openUrl(id: number) {
      window.open('/product/detail/' + id)
    },
    getEcharts(orderInfo: any) {
      const $echarts = require('echarts')
      const Chart = $echarts.init(this.$refs.chart as HTMLCanvasElement)
      const xData: any[] = []
      const yData: any[] = []
      Object.keys(orderInfo).forEach((key) => {
        xData.push(key)
        yData.push(orderInfo[key])
      })
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          x: 60,
          y: 35,
          x2: 60,
          y2: 35
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xData
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: yData,
            type: 'line',
            areaStyle: {}
          }
        ]
      }
      Chart.setOption(option)
    },
    lookDetail(item: NotifyInfo) {
      this.$alert('公告详情：' + item.content, item.title, {
        confirmButtonText: '确定',
        dangerouslyUseHTMLString: true
      })
      if (window.localStorage.getItem('msgList')) {
        const msgList = JSON.parse(window.localStorage.getItem('msgList') as string)
        msgList.push(item.id)
      } else {
        window.localStorage.setItem('msgList', JSON.stringify([item.id]))
      }
    }
  },
  mounted() {
    Promise.all([
      product.recommand(),
      statistics.orderNumber(),
      notify.list({ page: 1, limit: 5 }),
      statistics.stockNumber()
    ]).then((res) => {
      this.getEcharts(res[1].data.data)
      this.recommand_list = res[0].data.data
      this.msg_list = res[2].data.data.items
      console.log(window.localStorage.getItem('msgList'))
      if (this.msg_list.length > 0) {
        if (window.localStorage.getItem('msgList')) {
          if (JSON.parse(window.localStorage.getItem('msgList') as string).indexOf(this.msg_list[0].id) === -1) {
            this.lookDetail(this.msg_list[0])
          }
        } else {
          this.lookDetail(this.msg_list[0])
        }
      }

      this.stock_sts = res[3].data.data
      this.loading = false
    })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/index/main.less';
</style>
<style lang="less">
#indexMain {
  .searchCtn {
    .el-input-group__prepend {
      background-color: #fff !important;
    }
    .select {
      width: 120px;
      .el-input .el-input__inner {
        border-color: transparent !important;
      }
      .el-input .el-input__inner:focus {
        border-color: transparent !important;
      }
    }
  }
  .el-image__inner {
    width: auto;
    max-width: 100%;
    height: 120px;
  }
}
</style>