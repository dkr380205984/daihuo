<template>
  <div id="orderList"
    class="listCtnNoRepeat"
    v-loading="loading">
    <div class="header">
      <div class="title">订单列表</div>
      <div class="btnCtn">
        <div class="btn btnOrange"
          @click="print_flag = true">打印供货单</div>
        <div class="btn btnBlue"
          @click="importOrder">导入订单</div>
      </div>
    </div>
    <div class="filterCtn">
      <span class="label">筛选</span>
      <div class="elCtn">
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
          :placeholder="'输入' + search_type_list[search_type].name + '搜索'"
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
          width="160">
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
          width="190">
        </el-table-column>
        <el-table-column prop="price"
          label="产品价格(元)"
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
          width="150">
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
                :key="item.id"
                :label="item.id">{{item.name}}</el-radio>
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
import { order, user, client } from '@/assets/js/api'
import { OrderInfo } from '@/types/order'
import { SkuInfo } from '@/types/product'
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
        sku_info: ''
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
        }
      ],
      keyword: '',
      date: [],
      client_list: [],
      client_id: '',
      print_date: []
    }
  },
  methods: {
    reset() {
      this.$router.push('/order/list/page=1&&keyword=&&date=')
    },
    changeRouter(page: number | string) {
      this.$router.push('/order/list/page=' + (page || 1) + '&&keyword=' + this.keyword + '&&date=' + this.date)
    },
    // 更新筛选条件
    getFilters() {
      const params = this.$getHash(this.$route.params.params)
      this.page = Number(params.page)
      this.keyword = params.keyword
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
      formData.append('presenter', '1')
      formData.append('source', this.source)
      order.import(formData).then((res: any) => {
        if (res.data.status) {
          this.$message.success('导入成功')
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
          page: this.page,
          limit: 10
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
    Promise.all([client.list(), user.list()]).then((res) => {
      this.client_list = res[0].data.data
      this.user_list = res[1].data.data.items
    })
    this.print_date = [this.$getDate(new Date()), this.$getDate(new Date(new Date().getTime() + 24 * 60 * 60 * 1000))]
    this.getList()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/order/list.less';
</style>