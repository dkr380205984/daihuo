<template>
  <div id="orderList"
    class="listCtnNoRepeat"
    v-loading="loading">
    <div class="header">
      <div class="title">订单列表</div>
      <div class="btnCtn">
        <div class="btn btnGreen"
          @click="getStsList">订单发货统计</div>
        <div class="btn btnOrange"
          @click="getOrderClient">打印供货单</div>
        <div class="btn btnBlue"
          @click="importOrder">导入订单</div>
      </div>
    </div>
    <div class="filterCtn">
      <span class="label">筛选</span>
      <div class="elCtn"
        style="width:150px">
        <el-select v-model="search_type"
          placeholder="选择搜索类型"
          @change="changeRouter(1)">
          <el-option v-for="item in search_type_list"
            :key="item.value"
            :value="item.value"
            :label="item.name"></el-option>
        </el-select>
      </div>
      <div class="elCtn">
        <el-input v-model="keyword"
          :placeholder="'输入' + search_type_list[search_type].name + '按回车搜索'"
          @change="changeRouter(1)"></el-input>
      </div>
      <div class="elCtn">
        <el-date-picker @change="changeRouter(1)"
          v-model="date"
          style="width:290px"
          class="filter_item"
          type="daterange"
          align="right"
          unlink-panels
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <div class="btnCtn">
        <div class="btn btnBlue">搜索</div>
        <div class="btn btnGray"
          @click="reset">重置</div>
      </div>
    </div>
    <div class="content">
      <el-table :data="list"
        style="width: 100%">
        <el-table-column fixed
          prop="order_code"
          label="订单号"
          width="180">
        </el-table-column>
        <el-table-column fixed
          prop="sku_code"
          label="sku编码"
          width="170">
        </el-table-column>
        <el-table-column prop="presenter"
          label="来源主播"
          width="150">
        </el-table-column>
        <el-table-column prop="addressee"
          label="收件人"
          width="150">
        </el-table-column>
        <el-table-column prop="addressee_phone"
          label="手机号"
          width="160">
        </el-table-column>
        <el-table-column prop="product_name"
          label="产品名称"
          width="210">
        </el-table-column>
        <el-table-column prop="price"
          label="产品价格(元)"
          width="120">
        </el-table-column>
        <el-table-column prop="number"
          label="下单数量"
          width="120">
        </el-table-column>
        <el-table-column prop="province"
          label="省份"
          width="120">
        </el-table-column>
        <el-table-column prop="city"
          label="市级"
          width="120">
        </el-table-column>
        <el-table-column prop="area"
          label="区域"
          width="150">
        </el-table-column>
        <el-table-column prop="create_user"
          label="创建人"
          width="120">
        </el-table-column>
        <el-table-column prop="create_time"
          label="创建日期"
          width="120">
        </el-table-column>
        <el-table-column prop="desc"
          label="用户留言"
          width="150">
        </el-table-column>
        <el-table-column label="操作"
          fixed="right"
          width="120">
          <template scope="item">
            <span class="opr orange"
              @click="getOrderDetail(item.row)">修改</span>
            <span class="opr red"
              @click="deleteOrder(item.row.id)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pageCtn">
      <el-pagination background
        :current-page.sync="page"
        :page-size="10"
        layout="prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
    <div class="popup"
      v-show="import_flag">
      <div class="main">
        <div class="title">
          <div class="text">导入订单</div>
          <i class="el-icon-close"
            @click="import_flag=false"></i>
        </div>
        <div class="content">
          <div class="row">
            <div class="label">选择平台：</div>
            <div class="info">
              <el-select placeholder="请选择来源平台"
                v-model="source">
                <el-option label="抖音"
                  value="1"></el-option>
                <el-option label="拼多多"
                  value="2"></el-option>
                <el-option label="淘宝"
                  value="3"></el-option>
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="label">来源主播：</div>
            <div class="info">
              <el-select placeholder="请选择来源主播"
                v-model="presenter">
                <el-option v-for="item in user_list"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"></el-option>
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="label">上传文件：</div>
            <div class="info">
              <form id="uploadForm"
                enctype="multipart/form-data">
                <input class="unshow"
                  type="file"
                  id="uploadFile"
                  @change="getFile($event)"
                  accept=".xlsx">
              </form>
              <div class="uploadBtn">
                <i class="el-icon-upload"></i>
                <span style="margin-left: 8px;cursor:pointer"
                  @click="triggerUpload">点击上传文件</span>
                <div class="el-upload__tip"
                  v-if="file_once.length===0">只能上传excel文件，且不超过10M</div>
                <div class="el-upload__tip"
                  v-if="file_once.length>0">已选择：{{file_once[0].name}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="import_flag=false">取消</div>
          <div class="btn btnBlue"
            @click="uploadOrder">确定</div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="print_flag">
      <div class="main">
        <div class="title">
          <div class="text">打印供货单</div>
          <i class="el-icon-close"
            @click="print_flag=false"></i>
        </div>
        <div class="content"
          style="padding-right:40px">
          <div class="tips">选择一家供货商打印订单条形码信息，默认为今日，如需打印其他日期，请手动选择</div>
          <div style="margin:24px 0">
            <span style="color:rgba(0,0,0,.65);font-size:14px">选择日期：</span>
            <el-date-picker v-model="print_date"
              style="width:290px"
              class="filter_item"
              type="daterange"
              align="right"
              unlink-panels
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
          <div style="margin:24px 0">
            <el-radio-group v-model="client_id">
              <el-radio v-for="item in client_list"
                :key="item.client_id"
                :label="item.client_name">{{item.client_name}}</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="print_flag=false">取消</div>
          <div class="btn btnBlue"
            @click="goPrint">确定</div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="sts_flag">
      <div class="main">
        <div class="title">
          <div class="text">订单发货统计</div>
          <i class="el-icon-close"
            @click="sts_flag=false"></i>
        </div>
        <div class="content"
          style="padding-right:40px">
          <div class="tips">请筛选日期进行统计，尽量不要超过七天，默认为今日订单统计</div>
          <div style="margin:24px 0">
            <span style="color:rgba(0,0,0,.65);font-size:14px">选择日期：</span>
            <el-date-picker @change="getStsList"
              v-model="sts_date"
              style="width:290px"
              class="filter_item"
              type="daterange"
              align="right"
              unlink-panels
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
          <div class="tableCtn">
            <div class="thead">
              <div class="trowCtn">
                <div class="trow">
                  <div class="tcolumn"
                    style="flex:0.5">序号</div>
                  <div class="tcolumn">SKU编码</div>
                  <div class="tcolumn">规格</div>
                  <div class="tcolumn"
                    style="align-items:center">图片</div>
                  <div class="tcolumn">下单数</div>
                  <div class="tcolumn">库存数</div>
                  <div class="tcolumn">待入库</div>
                </div>
              </div>
            </div>
            <div class="tbody">
              <div class="trowCtn">
                <div class="trow"
                  v-for="(item,index) in sts_list"
                  :key="index">
                  <div class="tcolumn"
                    style="flex:0.5">{{index+1}}</div>
                  <div class="tcolumn">{{item.sku_code}}</div>
                  <div class="tcolumn">{{getSkuName(item.sku_info,item.category_info)}}</div>
                  <div class="tcolumn">
                    <el-image style="width:60px;height:40px;padding:10px 20px"
                      :src="item.image?item.image:require('@/assets/image/noPic.jpg')"
                      :preview-src-list="item.image?[item.image]:[require('@/assets/image/noPic.jpg')]">
                    </el-image>
                  </div>
                  <div class="tcolumn">{{item.number}}</div>
                  <div class="tcolumn">{{item.store}}</div>
                  <div class="tcolumn">{{item.wait_push}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="sts_flag=false">取消</div>
          <div class="btn btnBlue"
            @click="goExcel">导出excel</div>
        </div>
      </div>
    </div>
    <div class="sidePopup"
      v-if="update_flag">
      <div class="main">
        <div class="title">
          <div class="text">修改订单信息</div>
          <i class="el-icon-close"
            @click="update_flag = false"></i>
        </div>
        <div class="content">
          <div class="editCtn">
            <div class="label">订单号：
              <span class="blue">{{update_info.order_code}}</span>
            </div>
          </div>
          <div class="editCtn">
            <div class="label">sku编码：
              <span class="blue">{{update_info.sku_code}}</span>
            </div>
          </div>
          <div class="editCtn">
            <div class="label">收件人
              <span class="explanation">(必填)</span>
            </div>
            <div class="inputCtn">
              <el-input v-model="update_info.addressee"
                placeholder="请输入收件人"></el-input>
            </div>
          </div>
          <div class="editCtn">
            <div class="label">手机号
              <span class="explanation">(必填)</span>
            </div>
            <div class="inputCtn">
              <el-input v-model="update_info.addressee_phone"
                placeholder="请输入手机号"></el-input>
            </div>
          </div>
          <div class="editCtn">
            <div class="label">产品名称
              <span class="explanation">(必填)</span>
            </div>
            <div class="inputCtn">
              <el-input v-model="update_info.product_name"
                placeholder="请输入产品名称"></el-input>
            </div>
          </div>
          <div class="editCtn">
            <div class="label">产品价格
              <span class="explanation">(必填)</span>
            </div>
            <div class="inputCtn">
              <el-input v-model="update_info.price"
                placeholder="请输入产品价格">
                <template slot="append">元</template>
              </el-input>
            </div>
          </div>
          <div class="editCtn">
            <div class="label">省份
              <span class="explanation">(必填)</span>
            </div>
            <div class="inputCtn">
              <el-input v-model="update_info.province"
                placeholder="请输入省份"></el-input>
            </div>
          </div>
          <div class="editCtn">
            <div class="label">市级
              <span class="explanation">(必填)</span>
            </div>
            <div class="inputCtn">
              <el-input v-model="update_info.city"
                placeholder="请输入市级"></el-input>
            </div>
          </div>
          <div class="editCtn">
            <div class="label">区域
              <span class="explanation">(必填)</span>
            </div>
            <div class="inputCtn">
              <el-input v-model="update_info.area"
                placeholder="请输入区域"></el-input>
            </div>
          </div>
          <div class="editCtn">
            <div class="label">备注信息
              <span class="explanation">(用户留言)</span>
            </div>
            <div class="inputCtn">
              <el-input v-model="update_info.desc"
                placeholder="请输入备注信息"></el-input>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="btnCtn">
            <div class="btn btnGray"
              @click="update_flag=false">取消</div>
            <div class="btn btnOrange"
              @click="updateOrder">修改</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'
import { order, user, client, statistics } from '@/assets/js/api'
import { OrderInfo } from '@/types/order'
import { SkuInfo } from '@/types/product'
interface StsData {
  image: string
  number: number
  sku_code: string
  sku_id: number
  store: number
  wait_push: number
  sku_info: string
  category_info: string
}
export default Vue.extend({
  data(): { file_list: any[]; update_info: OrderInfo; [propName: string]: any } {
    return {
      loading: true,
      list: [],
      file_once: [], // 测试用的单文件上传
      file_list: [],
      user_list: [],
      presenter: '',
      source: '',
      page: 1,
      total: 1,
      print_flag: false,
      import_flag: false,
      update_flag: false,
      update_info: {
        address: '',
        addressee: '',
        addressee_phone: '',
        area: '',
        city: '',
        province: '',
        product_name: '',
        local_product_name: '',
        presenter: '',
        order_code: '',
        sku_code: '',
        desc: '',
        create_user: '',
        create_time: '',
        sku_info: '',
        number: ''
      },
      search_type: 0,
      search_type_list: [
        {
          value: 0,
          name: '订单号'
        },
        {
          value: 1,
          name: 'sku编码'
        },
        {
          value: 2,
          name: '产品编号'
        },
        {
          value: 3,
          name: '产品名称'
        }
      ],
      keyword: '',
      date: [],
      client_list: [],
      client_id: '',
      print_date: [],
      sts_list: [],
      sts_flag: false,
      sts_date: []
    }
  },
  methods: {
    // 把非组合项找出来
    getUnCombine(categoryInfo: string): string[] {
      const categoryInfoArray = JSON.parse(categoryInfo)
      const returnObj = [] as string[]
      categoryInfoArray.forEach((item: any) => {
        if (!item.is_combine) {
          if (!item.keyArr) {
            returnObj.push(item.name)
          } else {
            if (item.keyArr instanceof Array) {
              returnObj.push(item.keyArr.join(','))
            } else {
              returnObj.push(Object.keys(item.keyArr).join(','))
            }
          }
        }
      })
      return returnObj
    },
    getSkuName(skuInfo: string, categoryInfo: string): string {
      let returnStr = ''
      const skuInfoSelf = JSON.parse(skuInfo)
      const deleteObj = this.getUnCombine(categoryInfo)
      const price = '零售价'
      const costPrice = '成本价'
      const storeNum = '库存数'
      const image = '图片'
      const sku = 'sku编码'
      delete skuInfoSelf[price]
      delete skuInfoSelf[costPrice]
      delete skuInfoSelf[storeNum]
      delete skuInfoSelf[image]
      delete skuInfoSelf[sku]
      deleteObj.forEach((item: string) => {
        delete skuInfoSelf[item]
      })
      Object.keys(skuInfoSelf).forEach((key) => {
        returnStr = returnStr + skuInfoSelf[key] + '/'
      })
      return returnStr.substring(0, returnStr.length - 1)
    },
    reset() {
      this.$router.push('/order/list/page=1&&keyword=&&date=&&type=0')
    },
    changeRouter(page: number | string) {
      this.$router.push(
        '/order/list/page=' +
          (page || 1) +
          '&&keyword=' +
          this.keyword +
          '&&date=' +
          this.date +
          '&&type=' +
          this.search_type
      )
    },
    // 更新筛选条件
    getFilters() {
      const params = this.$getHash(this.$route.params.params)
      this.page = Number(params.page)
      this.keyword = params.keyword
      this.search_type = params.type && Number(params.type)
      if (params.date !== 'null' && params.date !== '') {
        this.date = params.date.split(',')
      } else {
        this.date = []
      }
    },
    importOrder(): void {
      this.file_once = []
      this.import_flag = true
    },
    uploadOrder(): void {
      const formData = new FormData()
      formData.append('file', this.file_once[0])
      formData.append('presenter', this.presenter)
      formData.append('source', this.source)
      order.import(formData).then((res: any) => {
        if (res.data.status) {
          this.$message.success('导入成功')
          this.getList()
          this.import_flag = false
        }
      })
    },
    getFile(event: any) {
      if (event.target.files.length > 0) {
        this.file_once = event.target.files
      }
    },
    formAdapter(data: OrderInfo[]): OrderInfo[] {
      return data.map((item: OrderInfo) => {
        const sku: SkuInfo = item.sku_info ? JSON.parse(item.sku_info) : {}
        const price = '单价'
        return {
          address: item.address,
          addressee: item.addressee,
          addressee_phone: item.addressee_phone,
          area: item.area,
          city: item.city,
          province: item.province,
          product_name: item.product_name,
          local_product_name: item.local_product_name,
          presenter: item.presenter,
          order_code: item.order_code,
          sku_code: item.sku_code,
          sku_info: item.sku_info,
          create_time: item.create_time.substring(0, 10),
          create_user: item.create_user,
          price: (sku[price] || 0) + '元',
          number: item.number,
          desc: item.desc
        }
      })
    },
    triggerUpload(): void {
      const dom = document.getElementById('uploadFile') as HTMLInputElement
      dom.click()
    },
    getOrderDetail(info: OrderInfo): void {
      this.update_info = info
      this.update_flag = true
    },
    getList(): void {
      this.loading = true
      order
        .list({
          product_code: this.search_type === 2 ? this.keyword : '',
          sku_code: this.search_type === 1 ? this.keyword : '',
          product_name: this.search_type === 3 ? this.keyword : '',
          order_code: this.search_type === 0 ? this.keyword : '',
          page: this.page,
          limit: 10,
          start_time: this.date && this.date.length > 0 ? this.date[0] : '',
          end_time: this.date && this.date.length > 0 ? this.date[1] : ''
        })
        .then((res) => {
          this.list = this.formAdapter(res.data.data.items)
          this.total = res.data.data.total
          this.loading = false
        })
    },
    deleteOrder(id: number | string): void {
      this.$confirm('是否要删除该订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          order.delete({ id }).then((res) => {
            if (res.data.stauts) {
              this.$message.success('删除成功')
              this.getList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    updateOrder(): void {
      this.$message.warning('暂无接口')
    },
    goPrint() {
      if (!this.client_id) {
        this.$message.error('请选择一家供货商进行打印')
        return
      }
      window.open('/print/printSku/' + this.client_id + '/' + this.print_date.join(','))
    },
    filterSts(data: { [propName: string]: StsData }): StsData[] {
      const returnArr = [] as StsData[]
      Object.keys(data).forEach((key) => {
        returnArr.push(data[key])
      })
      return returnArr
    },
    getStsList(): void {
      this.loading = true
      statistics
        .dispatchSts({
          start_time: this.sts_date && this.sts_date.length > 0 ? this.sts_date[0] : '',
          end_time: this.sts_date && this.sts_date.length > 0 ? this.sts_date[1] : ''
        })
        .then((res) => {
          this.sts_list = this.filterSts(res.data.data.order_data)
          this.sts_flag = true
          this.loading = false
        })
    },
    getOrderClient() {
      this.loading = true
      statistics
        .dispatchSts({
          start_time: this.sts_date && this.sts_date.length > 0 ? this.sts_date[0] : '',
          end_time: this.sts_date && this.sts_date.length > 0 ? this.sts_date[1] : ''
        })
        .then((res) => {
          this.client_list = res.data.data.client_data
          this.print_flag = true
          this.loading = false
        })
    },
    goExcel() {
      if (this.sts_list.length === 0) {
        this.$message.error('至少有一条发货统计才能导出')
        return
      }
      const data = this.sts_list.map((item: StsData, index: number) => {
        return {
          index: index + 1,
          sku_code: item.sku_code,
          iamge: item.image,
          number: item.number,
          store: item.store,
          wait_push: item.wait_push,
          size: this.getSkuName(item.sku_info, item.category_info)
        }
      })
      this.$downloadExcel(
        data,
        [
          { title: '序号', key: 'index' },
          { title: 'SKU编码', key: 'sku_code' },
          { title: '规格', key: 'size' },
          { title: '下单数', key: 'number' },
          { title: '库存数', key: 'store' },
          { title: '待入库', key: 'wait_push' }
        ],
        '订单发货统计表'
      )
    }
  },
  watch: {
    page(newVal) {
      this.changeRouter(newVal)
    },
    $route(newVal) {
      // 点击返回的时候更新下筛选条件
      this.getFilters()
      this.getList()
    }
  },
  mounted() {
    Promise.all([
      client.list(),
      user.list({
        type: 3
      })
    ]).then((res) => {
      this.client_list = res[0].data.data
      this.user_list = res[1].data.data
    })
    this.print_date = [this.$getDate(new Date()), this.$getDate(new Date(new Date().getTime() + 24 * 60 * 60 * 1000))]
    this.sts_date = [this.$getDate(new Date()), this.$getDate(new Date(new Date().getTime() + 24 * 60 * 60 * 1000))]
    this.getList()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/order/list.less';
</style>