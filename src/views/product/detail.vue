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
                        style="min-width:150px"
                        v-for="(item,index) in table_data.header"
                        :key="index">{{item}}</div>
                    </div>
                  </div>
                  <div class="tbody">
                    <div class="trow"
                      v-for="(item,index) in table_data.render_content"
                      :key="index">
                      <div class="tcolumn"
                        style="min-width:150px"
                        v-for="(itemChild,indexChild) in table_data.header"
                        :key="indexChild">
                        <span v-if="itemChild!=='图片'">{{item[itemChild]}}
                          <span style="cursor:pointer;color:#1a95ff"
                            v-if="indexChild===0"
                            @click="goPrint(item[itemChild])">（打印）</span>
                        </span>
                        <span v-if="itemChild==='图片'&&!item[itemChild]">暂无图片</span>
                        <el-image v-if="itemChild==='图片' && item[itemChild]"
                          style="width:80px;height:80px;padding:10px 0"
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
            <span class="right"
              v-if="collect_data.total>4"
              @click="collect_flag = true;">查看全部</span>
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
            <span class="right"
              v-if="order_data.total>4"
              @click="order_flag = true">查看全部</span>
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
            <span class="right"
              @click="getLog($route.params.id)">查看全部</span>
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
    <div class="popup"
      v-show="log_flag">
      <div class="main">
        <div class="title">
          <div class="text">出入库日志</div>
          <i class="el-icon-close"
            @click="log_flag=false"></i>
        </div>
        <div class="content">
          <div class="boxCtn">
            <div class="box">
              <span class="label">出库数</span>
              <span class="number green">{{log_sts.outNum}}</span>
            </div>
            <div class="box">
              <span class="label">入库数</span>
              <span class="number orange">{{log_sts.inNum}}</span>
            </div>
            <div class="box">
              <span class="label">库存量</span>
              <span class="number blue">{{log_sts.inNum - log_sts.outNum}}</span>
            </div>
          </div>
          <div class="detailInfo">
            <div class="tableCtn">
              <div class="normalTb"
                style="width: 100%;">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn">类型</div>
                    <div class="tcolumn">sku编码</div>
                    <div class="tcolumn">数量</div>
                    <div class="tcolumn">单价</div>
                    <div class="tcolumn">仓库</div>
                    <div class="tcolumn">出库单位</div>
                    <div class="tcolumn">操作人</div>
                    <div class="tcolumn">日期</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item) in log_list"
                    :key="item.id">
                    <div class="tcolumn"
                      :class="{'orange':item.type===1,'blue':item.type===2}">{{item.type===1?'入库':'出库'}}</div>
                    <div class="tcolumn">{{item.sku.sku_code}}</div>
                    <div class="tcolumn">{{item.number}}</div>
                    <div class="tcolumn">{{item.price}}元</div>
                    <div class="tcolumn">{{item.stock_name}}</div>
                    <div class="tcolumn">{{item.client_name||'无'}}</div>
                    <div class="tcolumn">{{item.user_name}}</div>
                    <div class="tcolumn">{{item.create_time}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="log_flag=false">取消</div>
          <div class="btn btnBlue"
            @click="log_flag=false">确定</div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="collect_flag||order_flag">
      <div class="main">
        <div class="title">
          <div class="text">{{collect_flag?'收藏':'订单'}}详情</div>
          <i class="el-icon-close"
            @click="collect_flag=false;order_flag=false;"></i>
        </div>
        <div class="content">
          <div class="tableCtn">
            <div class="normalTb"
              style="width: 100%;"
              v-if="collect_flag">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn">主播姓名</div>
                  <div class="tcolumn">收藏日期</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in collect_data.list"
                  :key="index">
                  <div class="tcolumn">{{item.name}}</div>
                  <div class="tcolumn">{{$diffDate(item.create_time)}}</div>
                </div>
              </div>
            </div>
            <div class="normalTb"
              style="width: 100%;"
              v-if="order_flag">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn">订单号</div>
                  <div class="tcolumn">日期</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in order_data.list"
                  :key="index">
                  <div class="tcolumn">{{item.order_code}}</div>
                  <div class="tcolumn">{{$diffDate(item.create_time)}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="collect_flag=false;order_flag=false">取消</div>
          <div class="btn btnBlue"
            @click="collect_flag=false;order_flag=false">确定</div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-if="printPopupFlag">
      <div class="main"
        style="width:500px">
        <div class="title">
          <div class="text">提示</div>
          <i class="el-icon-close"
            @click="printPopupFlag=false;"></i>
        </div>
        <div class="content">
          <div class="row"
            style="flex-direction: column;">
            <div class="label"
              style="width:100%;text-align:left">请选择打印方式：</div>
            <div class="info">
              <el-radio-group v-model="printInfo.type"
                style="line-height:40px">
                <el-radio :label="1">卷纸打印</el-radio>
                <el-radio :label="2">A4纸打印</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="row"
            style="flex-direction: column;">
            <div class="label"
              style="width:100%;text-align:left">请输入需要打印的张数：</div>
            <div class="info">
              <el-input v-model="printInfo.number"
                style="height:40px"
                placeholder="默认“1”张">
              </el-input>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="printPopupFlag=false">取消</div>
          <div class="btn btnBlue"
            @click="goPrint(false)">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { product, store } from '@/assets/js/api'
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
      collect_flag: false,
      order_data: {
        total: 0,
        list: [],
        newList: []
      },
      order_flag: false,
      store_data: {
        total: 0
      },
      sku_data: [],
      log_flag: false,
      log_list: [],
      log_sts: {
        inNum: 0,
        outNum: 0
      },
      printSku: null,
      printPopupFlag: false,
      printInfo: {
        type: 1,
        number: ''
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
      this.category_info = data.category_info // 这个数值用于打印的时候传值给打印页
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
    },
    goPrint(skuCode: string | boolean) {
      if (!skuCode) {
        window.open(
          '/print/printSkuByPro/' +
            this.printSku.id +
            '/' +
            (this.printInfo.number || 1) +
            '/' +
            this.$route.params.id +
            '?printType=' +
            this.printInfo.type
        )
        this.printPopupFlag = false
        this.printInfo = {
          type: 1,
          number: ''
        }
        this.printSku = null
        return
      }
      this.printSku = this.sku_data.find((item: SkuInfo) => item.sku_code === skuCode)
      this.printPopupFlag = true
      // this.$prompt('请选择打印：', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消'
      // })
      //   .then((obj: any) => {
      //     if (obj.value) {
      //       window.open('/print/printSkuByPro/' + sku.id + '/' + obj.value + '/' + this.$route.params.id)
      //     } else {
      //       this.$message.error('请输入打印张数')
      //     }
      //   })
      //   .catch(() => {
      //     this.$message({
      //       type: 'info',
      //       message: '已取消'
      //     })
      //   })
      // this.$prompt('请输入需要打印的张数：', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消'
      // })
      //   .then((obj: any) => {
      //     if (obj.value) {
      //       window.open('/print/printSkuByPro/' + sku.id + '/' + obj.value + '/' + this.$route.params.id)
      //     } else {
      //       this.$message.error('请输入打印张数')
      //     }
      //   })
      //   .catch(() => {
      //     this.$message({
      //       type: 'info',
      //       message: '已取消'
      //     })
      //   })
    },
    // 日志统计
    stsLog(): void {
      this.log_sts.inNum = this.log_list
        .filter((item: any) => item.type === 1)
        .reduce((total: number, current: any) => {
          return total + current.number
        }, 0)
      this.log_sts.outNum = this.log_list
        .filter((item: any) => item.type === 2)
        .reduce((total: number, current: any) => {
          return total + current.number
        }, 0)
    },
    getLog(id: number): void {
      this.loading = true
      store
        .skuLog({
          stock_id: '',
          product_id: id,
          sku_code: ''
        })
        .then((res) => {
          this.log_list = res.data.data
          if (this.log_list.length > 0) {
            this.stsLog()
            this.log_flag = true
            this.loading = false
          } else {
            this.$message.warning('该产品暂无相关的出入库日志')
          }
        })
    }
  },
  mounted() {
    product.detail({ id: this.$route.params.id }).then((res) => {
      console.log(res.data.data)
      if (res.data.status) {
        this.formAdapter(res.data.data)
        this.sku_data = res.data.data.sku_info
        this.loading = false
      }
    })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/product/detail.less';
@import '~@/assets/less/store/list.less';
</style>
<style lang="less">
.img {
  img {
    height: 150px;
    width: auto;
  }
}
.el-message-box__input {
  height: 32px;
}
</style>