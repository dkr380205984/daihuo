<template>
  <div class="listCtnNoRepeat"
    v-loading="loading">
    <div class="header">
      <div class="title">库存日志列表</div>
      <div class="btnCtn">
        <div class="btn btnOrange"
          @click="goPrint">打印单据</div>
        <div class="btn btnBlue"
          @click="goExcel">导出excel</div>
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
      <div class="elCtn"
        style="width:150px">
        <el-input v-model="keyword"
          placeholder="按回车搜索"
          @change="changeRouter(1)"></el-input>
      </div>
      <div class="elCtn"
        style="width:150px">
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
      <div class="elCtn"
        style="width:150px">
        <el-select v-model="source"
          placeholder="操作类型"
          @change="changeRouter(1)">
          <el-option value="0"
            label="全部"></el-option>
          <el-option value="PDA"
            label="PDA"></el-option>
          <el-option value="电脑后台"
            label="电脑后台"></el-option>
        </el-select>
      </div>
      <div class="elCtn"
        style="width:150px">
        <el-select v-model="store_id"
          placeholder="筛选仓库"
          clearable
          @change="changeRouter(1)">
          <el-option v-for="item in store_list"
            :key="item.id"
            :value="item.id"
            :label="item.name"></el-option>
        </el-select>
      </div>
      <div class="elCtn"
        style="width:240px">
        <el-date-picker @change="changeRouter(1)"
          style="width:240px"
          v-model="date"
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
        <div class="btn btnGray"
          @click="reset">重置</div>
      </div>
    </div>
    <div class="content">
      <el-table :data="list"
        style="width: 100%"
        ref="multipleTable"
        @selection-change="handleSelectionChange">
        <el-table-column fixed
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column fixed
          label="产品编号"
          width="150">
          <template scope="item">
            {{item.row.product_info?item.row.product_info.product_code:'获取产品失败'}}
          </template>
        </el-table-column>
        <el-table-column fixed
          label="操作类型"
          width="120">
          <template scope="item">
            <div class="tcolumn"
              :class="{'orange':item.row.type===1,'green':item.row.type===2}">{{item.row.type|filterType}}/{{item.row.data_source}}</div>
          </template>
        </el-table-column>
        <el-table-column label="产品名称"
          width="150">
          <template scope="item">
            {{item.row.product_info?item.row.product_info.name:'获取产品失败'}}
          </template>
        </el-table-column>
        <el-table-column label="sku编码"
          width="150">
          <template scope="item">
            {{item.row.sku?item.row.sku.sku_code:'获取产品失败'}}
          </template>
        </el-table-column>
        <el-table-column label="规格"
          width="180">
          <template scope="item">
            <div style="overflow:hidden;white-space:nowrap;text-overflow: ellipsis;">{{getSkuName(item.row.sku?item.row.sku.sku_info:null,item.row.product_info?item.row.product_info.category_info:null)}}</div>
          </template>
        </el-table-column>
        <el-table-column label="数量"
          prop="number"
          width="120">
        </el-table-column>
        <el-table-column label="单价(元)"
          prop="price"
          width="120">
        </el-table-column>
        <el-table-column label="来源仓库"
          prop="stock_name"
          width="120">
        </el-table-column>
        <el-table-column label="出库单位"
          prop="client_name"
          width="120">
        </el-table-column>
        <el-table-column label="操作人"
          prop="user_name"
          width="120">
        </el-table-column>
        <el-table-column label="创建日期"
          prop="create_time"
          width="120">
        </el-table-column>
        <el-table-column label="操作"
          width="120"
          fixed="right">
          <template scope="item">
            <span class="opr red"
              @click="deleteLog(item.row.id)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pageCtn">
      <el-pagination background
        :current-page.sync="pages"
        :page-size="15"
        layout="prev, pager, next"
        :total="total">
      </el-pagination>
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
    selectList: StoreInfo[]
    [propName: string]: any
  } {
    return {
      loading: true,
      search_type: 0,
      source: '0',
      search_type_list: [
        {
          value: 0,
          name: '产品名称'
        },
        {
          value: 1,
          name: '产品编号'
        },
        {
          value: 2,
          name: 'sku编码'
        }
      ],
      store_list: [],
      store_id: '',
      keyword: '',
      type: 1,
      list: [],
      selectList: [],
      date: [],
      pages: 1,
      total: 1
    }
  },
  filters: {
    filterType(type: number) {
      const typeArr = ['入库', '出库']
      return typeArr[type - 1]
    }
  },
  watch: {
    pages(newVal) {
      this.changeRouter(newVal)
    },
    $route(newVal) {
      // 点击返回的时候更新下筛选条件
      this.getFilters()
      this.getList(this.pages)
    }
  },
  methods: {
    handleSelectionChange(val: StoreInfo[]) {
      const notSelectItems = this.list.filter((itemF) => !val.find((itemFind) => itemFind.id === itemF.id))
      val.forEach((itemF) => {
        const finded = this.selectList.find((itemFind) => itemFind.id === itemF.id)
        if (!finded) {
          this.selectList.push(itemF)
        }
      })
      notSelectItems.forEach((itemF) => {
        const findIndex = this.selectList.findIndex((itemFind) => itemFind.id === itemF.id)
        if (findIndex >= 0) {
          this.selectList.splice(findIndex, 1)
        }
      })
    },
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
      if (!skuInfo) {
        return '获取产品失败'
      }
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
    getList(pages: number = 1, limit: number = 15) {
      this.loading = true
      store
        .skuLog({
          page: pages,
          limit,
          stock_id: this.store_id,
          id: '',
          data_source: this.source,
          product_code: this.search_type === 1 ? this.keyword : '',
          sku_code: this.search_type === 2 ? this.keyword : '',
          name: this.search_type === 0 ? this.keyword : '',
          type: this.type,
          start_time: this.date && this.date.length > 0 ? this.date[0] : '',
          end_time: this.date && this.date.length > 0 ? this.date[1] : ''
        })
        .then((res) => {
          this.list = res.data.data.items
          this.total = res.data.data.total
          // 更新当前页勾选状态
          const selectItems: any = []
          this.list.forEach((itemF) => {
            const finded = this.selectList.find((itemFind) => itemFind.id === itemF.id)
            if (finded) {
              selectItems.push(itemF)
            }
          })
          // 采用微任务将执行延后  以达到避开el-table中selection-change在切换页码时此执行快于其本身执行
          // 其实就是在Dom更新后去执行
          this.$nextTick(() => {
            selectItems.forEach((itemF: any) => {
              const multipleTable = this.$refs.multipleTable as any
              multipleTable.toggleRowSelection(itemF)
            })
          })
          // 更新页码
          if (pages !== this.pages) {
            this.pages = pages
          }
          this.loading = false
        })
    },
    reset() {
      this.$router.push('/store/logList/page=1&&keyword=&&date=&&type=&&search_type=0&&store_id=&&data_source=0')
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
          this.type +
          '&&search_type=' +
          this.search_type +
          '&&store_id=' +
          this.store_id +
          '&&data_source=' +
          this.source
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
      this.pages = Number(params.page) || 1
      this.keyword = params.keyword
      this.type = (params.type && Number(params.type)) || 0
      this.store_id = params.store_id && Number(params.store_id)
      this.search_type = params.search_type && Number(params.search_type)
      this.source = params.data_source
      if (params.date !== 'null' && params.date !== '') {
        this.date = params.date.split(',')
      } else {
        this.date = [this.$getDate(new Date()), this.$getDate(new Date(new Date().getTime() + 24 * 60 * 60 * 1000))]
      }
    },
    goPrint() {
      const arrIn = this.selectList.filter((item: StoreInfo) => item.type === 1)
      const arrOut = this.selectList.filter((item: StoreInfo) => item.type === 2)
      if (arrIn.length > 0 && arrOut.length > 0) {
        this.$message.error('请选择一种操作类型单进行打印')
        return
      }
      if (this.selectList.length > 0) {
        window.open(
          '/print/printStoreLog/' +
            this.selectList.map((item: StoreInfo) => item.id).join(',') +
            '/' +
            (arrIn.length > 0 ? '1' : '2')
        )
      } else {
        this.$message.error('请至少选择一条日志进行打印')
      }
    },
    goExcel() {
      if (this.selectList.length === 0) {
        this.$message.error('请至少选择一条日志进行导出')
        return
      }
      const data = this.selectList.map((item: StoreInfo) => {
        return {
          product_code: item.product_info?.product_code,
          type: this.$options.filters!.filterType(item.type),
          product_name: item.product_info?.name,
          sku_code: item.sku?.sku_code,
          size: this.getSkuName(item.sku?.sku_info as string, item.product_info?.category_info as string),
          number: item.number,
          price: item.price,
          client_name: item.client_name,
          stock_name: item.stock_name,
          user_name: item.user_name,
          create_time: item.create_time
        }
      })
      this.$downloadExcel(
        data,
        [
          { title: '产品编号', key: 'product_code' },
          { title: '操作类型', key: 'type' },
          { title: '产品名称', key: 'product_name' },
          { title: 'sku编码', key: 'sku_code' },
          { title: '规格', key: 'size' },
          { title: '数量', key: 'number' },
          { title: '单价', key: 'price' },
          { title: '来源仓库', key: 'stock_name' },
          { title: '出库单位', key: 'client_name' },
          { title: '操作人', key: 'user_name' },
          { title: '创建日期', key: 'create_time' }
        ],
        '围巾城出入库日志'
      )
    }
  },
  mounted() {
    this.getFilters()
    this.getList(this.pages)
    store.list().then((res) => {
      this.store_list = res.data.data.items
    })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/common.less';
</style>