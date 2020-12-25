<template>
  <div class="listCtnNoRepeat"
    v-loading="loading">
    <div class="header">
      <div class="title">库存日志列表</div>
      <div class="btnCtn">
        <div class="btn btnBlue"
          @click="goPrint">打印单据</div>
      </div>
    </div>
    <div class="filterCtn">
      <span class="label">筛选</span>
      <div class="elCtn">
        <el-input v-model="keyword"
          placeholder="输入sku编码搜索"
          @change="changeRouter(1)"></el-input>
      </div>
      <div class="elCtn">
        <el-select v-model="type"
          placeholder="操作类型"
          @change="changeRouter(1)">
          <el-option :value="0"
            label="全部"></el-option>
          <el-option :value="1"
            label="入库"></el-option>
          <el-option :value="2"
            label="出库"></el-option>
        </el-select>
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
      <div class="tableCtn">
        <div class="thead">
          <div class="trowCtn">
            <div class="trow">
              <div class="tcolumn">
                <el-checkbox v-model="chooseAll">产品编号</el-checkbox>
              </div>
              <div class="tcolumn">操作类型</div>
              <div class="tcolumn">产品名称</div>
              <div class="tcolumn">sku编码</div>
              <div class="tcolumn"
                style="flex:1.5">规格</div>
              <div class="tcolumn">数量</div>
              <div class="tcolumn">仓库</div>
              <div class="tcolumn">操作人</div>
              <div class="tcolumn">日期</div>
              <div class="tcolumn">操作</div>
            </div>
          </div>
        </div>
        <div class="tbody">
          <div class="trowCtn">
            <div class="trow"
              v-for="item in list"
              :key="item.id">
              <div class="tcolumn">
                <el-checkbox v-model="item.checked"
                  @change="$forceUpdate()">{{item.product_info.product_code}}</el-checkbox>
              </div>
              <div class="tcolumn"
                :class="{'orange':item.type===1,'green':item.type===2}">{{item.type|filterType}}</div>
              <div class="tcolumn">{{item.product_info.name}}</div>
              <div class="tcolumn">{{item.sku.sku_code}}</div>
              <div class="tcolumn overflow"
                style="flex:1.5">{{getSkuName(item.sku.sku_info,item.product_info.category_info)}}</div>
              <div class="tcolumn blue">{{item.number}}</div>
              <div class="tcolumn">{{item.stock_name}}</div>
              <div class="tcolumn">{{item.user_name}}</div>
              <div class="tcolumn">{{item.create_time}}</div>
              <div class="tcolumn flexRow">
                <span class="opr red"
                  @click="deleteLog(item.id)">删除</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { store } from '@/assets/js/api'
import { Vue } from 'vue-property-decorator'
import { StoreInfo } from '@/types/store'
export default Vue.extend({
  data(): {
    list: StoreInfo[]
    [propName: string]: any
  } {
    return {
      loading: true,
      keyword: '',
      type: 1,
      list: [],
      date: [],
      chooseAll: false
    }
  },
  filters: {
    filterType(type: number) {
      const typeArr = ['入库', '出库']
      return typeArr[type - 1]
    }
  },
  watch: {
    chooseAll(newVal) {
      this.list.forEach((item) => {
        item.checked = newVal
      })
    },
    page(newVal) {
      this.changeRouter(newVal)
    },
    $route(newVal) {
      // 点击返回的时候更新下筛选条件
      this.getFilters()
      this.getList()
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
    getList() {
      this.loading = true
      store
        .skuLog({
          stock_id: '',
          id: '',
          sku_code: this.keyword,
          type: this.type,
          start_time: this.date && this.date.length > 0 ? this.date[0] : '',
          end_time: this.date && this.date.length > 0 ? this.date[1] : ''
        })
        .then((res) => {
          this.list = res.data.data.items
          this.loading = false
        })
    },
    reset() {
      this.$router.push('/store/logList/page=1&&keyword=&&date=&&type=')
    },
    changeRouter(page: number | string) {
      this.$router.push(
        '/store/logList/page=' +
          (page || 1) +
          '&&keyword=' +
          this.keyword +
          '&&date=' +
          this.date +
          '&&type=' +
          this.type
      )
    },
    deleteLog(id: number): void {
      this.$confirm('是否删除该出入库日志?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          store
            .skuDelete({
              id
            })
            .then((res) => {
              if (res.data.status) {
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
    // 更新筛选条件
    getFilters() {
      const params = this.$getHash(this.$route.params.params)
      this.page = Number(params.page)
      this.keyword = params.keyword
      this.type = (params.type && Number(params.type)) || 0
      if (params.date !== 'null' && params.date !== '') {
        this.date = params.date.split(',')
      } else {
        this.date = [this.$getDate(new Date()), this.$getDate(new Date(new Date().getTime() + 24 * 60 * 60 * 1000))]
      }
    },
    goPrint() {
      if (this.type !== 1 || this.type !== 2) {
        const arrIn = this.list.filter((item: StoreInfo) => item.checked && item.type === 1)
        const arrOut = this.list.filter((item: StoreInfo) => item.checked && item.type === 2)
        if (arrIn.length > 0 && arrOut.length > 0) {
          this.$message.error('请选择一种操作类型单进行打印')
          return
        }
      }
      const idArr = this.list.filter((item) => item.checked).map((item) => item.id)
      if (idArr.length > 0) {
        window.open('/print/printStoreLog/' + idArr.join(',') + '/' + this.type)
      } else {
        this.$message.error('请至少选择一条日志进行打印')
      }
    }
  },
  mounted() {
    this.getFilters()
    this.getList()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/common.less';
</style>