<template>
  <div id="productDetail"
    class="detailCtnNoRepeat"
    v-loading="loading">
    <div class="header">
      <div class="title">产品详情</div>
    </div>
    <div class="moduleCtn">
      <div class="module">
        <div class="titleCtn">
          <div class="title">详情页面</div>
        </div>
        <div class="contentCtn">
          <div class="rowCtn">
            <div class="colCtn flex3">
              <div class="label">产品编号：</div>
              <div class="text blue">{{product_code}}</div>
            </div>
            <div class="colCtn flex3">
              <div class="label">产品名称：</div>
              <div class="text">{{product_name}}</div>
            </div>
          </div>
          <div class="rowCtn">
            <div class="colCtn flex3">
              <div class="label">产品品牌：</div>
              <div class="text">{{product_brand||'暂无品牌'}}</div>
            </div>
            <div class="colCtn flex3">
              <div class="label">供货商：</div>
              <div class="text">{{from_client||'暂无供货商'}}</div>
            </div>
            <div class="colCtn flex3">
              <div class="label">创建日期：</div>
              <div class="text">{{create_time}}</div>
            </div>
          </div>
          <div class="rowCtn">
            <div class="colCtn flex3">
              <div class="label">备注信息：</div>
              <div class="text blue">{{desc}}</div>
            </div>
          </div>
          <div class="rowCtn">
            <div class="colCtn">
              <span class="label">产品图片：</span>
              <div class="imgCtn">
                <div class="img"
                  v-for="(item,index) in product_image"
                  :key="index">
                  <el-image :src="item.image_url || require('@/assets/image/noPic.jpg')"
                    :preview-src-list="item.image_url?[item.image_url]:[require('@/assets/image/noPic.jpg')]">
                  </el-image>
                </div>
              </div>
            </div>
          </div>
          <div class="rowCtn">
            <div class="colCtn">
              <div class="label">表格信息：</div>
              <div class="tableCtn">
                <div class="normalTb">
                  <div class="thead">
                    <div class="trow">
                      <div class="tcolumn min120"
                        v-for="(item,index) in table_data.header"
                        :key="index">{{item}}</div>
                    </div>
                  </div>
                  <div class="tbody">
                    <div class="trow"
                      v-for="(item,index) in table_data.render_content"
                      :key="index">
                      <div class="tcolumn min120"
                        v-for="(itemChild,indexChild) in table_data.header"
                        :key="indexChild"
                        :class="{'blue':indexChild===0}">
                        <span v-if="itemChild!=='图片'">{{item[itemChild]}}</span>
                        <span v-if="itemChild==='图片'&&!item[itemChild]">暂无图片</span>
                        <el-image v-if="itemChild==='图片' && item[itemChild]"
                          style="width:80px;height:80px;;padding:10px 0"
                          :src="item[itemChild]"
                          :preview-src-list="item[itemChild]?[item[itemChild]]:[require('@/assets/image/noPic.jpg')]">
                        </el-image>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="cardCtn">
        <div class="card">
          <div class="title">
            <span class="left">收藏主播</span>
            <span class="right">查看全部</span>
          </div>
          <div class="content">
            <div class="label">累计收藏
              <!-- <i class="el-icon-question"></i> -->
            </div>
            <div class="number">{{collect_data.total}}<em>次</em></div>
            <!-- <div class="rate">较昨日<em class="green">新增9%</em></div> -->
            <div class="otherInfo">
              <div class="text">最近新增</div>
              <div class="line"
                v-for="(item,index) in collect_data.newList"
                :key="index">
                <span class="left">
                  <div class="circle"></div>
                  {{item.user_name}}
                </span>
                <span class="right">{{$diffDate(item.create_time)}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="title">
            <span class="left">产品订单</span>
            <span class="right">查看全部</span>
          </div>
          <div class="content">
            <div class="label">累计订单
              <i class="el-icon-question"></i>
            </div>
            <div class="number">{{order_data.total}}<em>个</em></div>
            <!-- <div class="rate">较昨日<em class="green">新增9%</em></div> -->
            <div class="otherInfo">
              <div class="text">最近新增</div>
              <div class="line"
                v-for="(item,index) in order_data.newList"
                :key="index">
                <span class="left">
                  <div class="circle"
                    style="background:#01B48C"></div>
                  {{item.order_code}}
                </span>
                <span class="right">{{$diffDate(item.create_time)}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="title">
            <span class="left">产品库存</span>
            <span class="right">查看全部</span>
          </div>
          <div class="content">
            <div class="label">库存数量</div>
            <div class="number">{{store_data.total}}<em>个</em></div>
            <!-- <div class="rate">较昨日<em class="green">新增9%</em></div> -->
            <div ref="chart"
              style="width: 336px;height:180px;"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnOrange"
            @click="$router.push('/product/update/' + $route.params.id)">修改</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { product } from '@/assets/js/api'
import { ProductForm } from '@/types/product'
import { SkuInfo } from '@/types/product'
interface ListData {
  list: any[]
  total: number
}
interface ProductDetail extends ProductForm {
  order_data: ListData
  collect_data: ListData
}
export default Vue.extend({
  data(): {
    table_data: { header: any[]; render_content: any[] }
    [propName: string]: any
  } {
    return {
      loading: true,
      product_code: '',
      product_name: '',
      product_type: '',
      product_brand: '',
      product_image: [],
      from_client: '',
      create_time: '',
      desc: '',
      render_data: [],
      table_data: {
        header: [], // 存放表头
        render_content: []
      },
      collect_data: {
        total: 0,
        list: [],
        newList: []
      },
      order_data: {
        total: 0,
        list: [],
        newList: []
      },
      store_data: {
        total: 0
      }
    }
  },
  methods: {
    formAdapter(data: ProductDetail): void {
      this.product_code = data.product_code
      this.product_name = data.name
      this.desc = data.description
      this.create_time = data.create_time.substring(0, 10)
      this.product_image = data.images.length === 0 ? [''] : data.images
      this.from_client = data.client_name
      this.product_brand = data.brand_id
      this.table_data.render_content = data.sku_info.map((item) => {
        const obj = JSON.parse(item.sku_info)
        const sku = 'sku编码'
        obj[sku] = item.sku_code
        return obj
      })

      for (const key of Object.keys(this.table_data.render_content[0])) {
        if (key === 'sku编码') {
          this.table_data.header.unshift(key)
        } else {
          this.table_data.header.push(key)
        }
      }

      this.collect_data = data.collect_data
      this.collect_data.newList = data.collect_data.list.slice(0, 4)
      this.order_data = data.order_data
      this.order_data.newList = data.order_data.list.slice(0, 4)
      this.store_data.total = data.sku_info.reduce((total: number, current: SkuInfo) => {
        return total + current.store
      }, 0)
      this.getEcharts(data.sku_info)
    },
    getEcharts(skuInfo: SkuInfo[]) {
      const $echarts = require('echarts')
      const Chart = $echarts.init(this.$refs.chart as HTMLCanvasElement)
      console.log()
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 10,
          data: skuInfo.map((item) => item.sku_code)
        },
        series: [
          {
            name: '库存数量',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            right: 160,
            emphasis: {
              label: {
                show: true,
                fontSize: '14',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: skuInfo.map((item) => {
              return {
                name: item.sku_code,
                value: item.store
              }
            })
          }
        ]
      }
      Chart.setOption(option)
    }
  },
  mounted() {
    product.detail({ id: this.$route.params.id }).then((res) => {
      console.log(res.data.data)
      if (res.data.status) {
        this.formAdapter(res.data.data)
        this.loading = false
      }
    })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/product/detail.less';
</style>
<style lang="less">
.img {
  img {
    height: 150px;
    width: auto;
  }
}
</style>