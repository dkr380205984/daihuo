<template>
  <div id="orderList"
    class="listCtnNoRepeat">
    <div class="header">
      <div class="title">订单列表</div>
      <div class="btnCtn">
        <div class="btn btnBlue"
          @click="import_flag=true">导入订单</div>
      </div>
    </div>
    <div class="filterCtn">
      <span class="label">筛选</span>
      <div class="elCtn">
        <el-input v-model="msg"
          placeholder="输入关键字"></el-input>
      </div>
      <div class="elCtn">
        <el-input v-model="msg"
          placeholder="输入关键字"></el-input>
      </div>
      <div class="elCtn">
        <el-select v-model="msg"
          placeholder="输入关键字"></el-select>
      </div>
      <div class="btnCtn">
        <div class="btn btnGray">取消</div>
        <div class="btn btnBlue">重置</div>
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
          width="150">
        </el-table-column>
        <el-table-column prop="addressee"
          label="收件人"
          width="150">
        </el-table-column>
        <el-table-column prop="addressee_phone"
          label="手机号"
          width="150">
        </el-table-column>
        <el-table-column prop="product_name"
          label="产品名称"
          width="170">
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
          <template>
            <span class="opr blue">详情</span>
            <span class="opr orange">修改</span>
            <span class="opr red">删除</span>
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
                v-model="msg"></el-select>
            </div>
          </div>
          <div class="row">
            <div class="label">来源博主：</div>
            <div class="info">
              <el-select placeholder="请选择来源博主"
                v-model="msg"></el-select>
            </div>
          </div>
          <div class="row">
            <div class="label">上传文件：</div>
            <div class="info">
              <form id="uploadForm"
                enctype="multipart/form-data">
                <input type="file"
                  ref="clearFile"
                  @change="getFile($event)"
                  accept=".xlsx">
              </form>
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
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'
import { order } from '@/assets/js/api'
interface SkuInfo {
  price: number
  store: string
  image_url: string
  [propName: string]: any
}
interface OrderList {
  address: string
  addressee: string
  addressee_phone: string
  area: string
  city: string
  province: string
  product_name: string | null
  local_product_name: string | null
  presenter: string
  order_code: string
  sku_code: string
  desc: string
  create_user: string
  create_time: string
  sku_info: string | null
  [propName: string]: any
}
export default Vue.extend({
  data(): { file_list: any[]; [propName: string]: any } {
    return {
      list: [],
      file_once: [], // 测试用的单文件上传
      file_list: [],
      msg: '',
      page: 1,
      total: 1,
      import_flag: false
    }
  },
  methods: {
    uploadOrder() {
      const formData = new FormData()
      formData.append('file', this.file_once[0])
      formData.append('presenter', '1')
      formData.append('source', '1')
      console.log(formData)
      order.import(formData).then((res: any) => {
        if (res.data.status) {
          this.$message.success('导入成功')
        }
      })
    },
    getFile(event: any) {
      this.file_once = event.target.files
    },
    formAdapter(data: OrderList[]): OrderList[] {
      return data.map((item: OrderList) => {
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
    }
  },
  mounted() {
    order
      .list({
        page: this.page,
        limit: 10
      })
      .then((res) => {
        console.log(res)
        this.list = this.formAdapter(res.data.data.items)
        this.total = res.data.data.total
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/order/list.less';
</style>