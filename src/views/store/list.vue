<template>
  <div id="storeList"
    class="listCtnNoRepeat"
    v-loading="loading">
    <div class="header">
      <div class="title">库存列表</div>
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
          placeholder="输入信息按回车搜索"
          @change="changeRouter(1)"></el-input>
      </div>
      <div class="elCtn"
        style="width:150px">
        <el-select v-model="client_id"
          placeholder="搜索供货单位"
          @change="changeRouter(1)"
          clearable>
          <el-option v-for="item in client_list"
            :key="item.id"
            :value="item.id"
            :label="item.name"></el-option>
        </el-select>
      </div>
      <div class="elCtn"
        style="width:150px">
        <el-select v-model="user_id"
          placeholder="搜索创建人"
          @change="changeRouter(1)"
          clearable>
          <el-option v-for="item in user_list"
            :key="item.id"
            :value="item.id"
            :label="item.name"></el-option>
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
        <div class="btn btnGray"
          @click="reset">重置</div>
      </div>
    </div>
    <div class="content">
      <div class="tableCtn">
        <div class="thead">
          <div class="trowCtn">
            <div class="trow">
              <div class="tcolumn">产品编号</div>
              <div class="tcolumn">产品名称</div>
              <div class="tcolumn">产品图片</div>
              <div class="tcolumn">供货单位</div>
              <div class="tcolumn">库存数</div>
              <div class="tcolumn">创建时间</div>
              <div class="tcolumn">操作</div>
            </div>
          </div>
        </div>
        <div class="tbody">
          <div class="trowCtn"
            v-for="item in list"
            :key="item.id">
            <div class="trow">
              <div class="tcolumn">
                <span class="text"><i class="icon"
                    :class="{'el-icon-arrow-right':!item.show,'el-icon-arrow-down':item.show}"
                    @click="item.show=!item.show;$forceUpdate()"></i>{{item.product_code}}</span>
              </div>
              <div class="tcolumn">{{item.name}}</div>
              <div class="tcolumn">
                <zh-img-list :list="item.images"></zh-img-list>
              </div>
              <div class="tcolumn">{{item.client_name || '暂无'}}</div>
              <div class="tcolumn"
                :class="{'orange':item.store===0,'green':item.store>0}">{{item.store}}</div>
              <div class="tcolumn">{{item.create_time.substring(0,10)}}</div>
              <div class="tcolumn flexRow">
                <span class="opr blue"
                  @click="item.show=!item.show;$forceUpdate()">{{item.show?'收起':'展开'}}</span>
                <span class="opr orange"
                  @click="getLog(item.id,1)">查看日志</span>
              </div>
            </div>
            <div class="detailInfo"
              v-show="item.show">
              <el-table :data="item.sku_info"
                style="width: 100%">
                <el-table-column v-for="(itemHeader,indexHeader) in item.header"
                  :key="indexHeader"
                  :fixed="itemHeader==='零售价'|| itemHeader==='成本价'|| itemHeader==='sku编码'||itemHeader==='库存数'||itemHeader==='图片'?'left':itemHeader==='操作'?'right':false"
                  :prop="filterName(itemHeader)"
                  :label="itemHeader"
                  :width="filterWidth(itemHeader)">
                  <template scope="scope">
                    <span class="text"
                      v-if="itemHeader!=='图片' && itemHeader!=='操作'">{{scope.row[filterName(itemHeader)]}}</span>
                    <div class="image"
                      v-if="itemHeader==='图片'"><img :src="scope.row.image_url || require('@/assets/image/noPic.jpg')" /></div>
                    <div class="oprCtn"
                      v-if="itemHeader==='操作'"
                      style="width:140px">
                      <span class="opr orange"
                        @click="getStoreInfo(scope.row,1)">入库</span>
                      <span class="opr green"
                        @click="getStoreInfo(scope.row,2)">出库</span>
                      <span class="opr blue"
                        @click="getLog(scope.row.sku_code,2)">库存</span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
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
      v-show="store_flag">
      <div class="main"
        style="width:600px">
        <div class="title">
          <div class="text">产品{{Number(store_info.type)===1?'入库':'出库'}}</div>
          <i class="el-icon-close"
            @click="store_flag=false"></i>
        </div>
        <div class="content">
          <div class="row">
            <div class="label">sku编码：</div>
            <div class="info text"
              style="color:#1a95ff">
              {{store_info.sku_code}}
            </div>
          </div>
          <div class="row">
            <div class="label">{{Number(store_info.type)===1?'入库':'出库'}}数量：</div>
            <div class="info">
              <el-input placeholder="请输入数量"
                v-model="store_info.number">
              </el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">{{Number(store_info.type)===1?'入库':'出库'}}单价：</div>
            <div class="info">
              <el-input placeholder="请输入单价"
                v-model="store_info.price">
                <template slot="append">元</template>
              </el-input>
            </div>
          </div>
          <div class="row"
            v-if="Number(store_info.type)===2">
            <div class="label">出库单位：</div>
            <div class="info">
              <el-input placeholder="请输入库存去向"
                v-model="store_info.client_name">
              </el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">选择仓库：</div>
            <div class="info">
              <el-select placeholder="请选择仓库"
                v-model="store_info.stock_id">
                <el-option v-for="item in store_arr"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"></el-option>
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="label">备注信息：</div>
            <div class="info">
              <el-input type="textarea"
                placeholder="请输入备注信息"
                v-model="store_info.desc"></el-input>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="store_flag=false">取消</div>
          <div class="btn btnBlue"
            @click="saveStore">确定</div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="log_flag">
      <div class="main"
        style="width:1000px">
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
              <div class="normalTb">
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
                    <div class="tcolumn">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in log_list"
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
                    <div class="tcolumn">
                      <span class="red"
                        style="cursor:pointer"
                        @click="deleteLog(item.id,index)">删除</span>
                    </div>
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
      v-show="sku_flag">
      <div class="main">
        <div class="title">
          <div class="text">库存详情</div>
          <i class="el-icon-close"
            @click="sku_flag=false"></i>
        </div>
        <div class="content">
          <div class="tableCtn">
            <div class="normalTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn">仓库名称</div>
                  <div class="tcolumn">总库存</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="item in sku_list"
                  :key="item.id">
                  <div class="tcolumn">{{item.stock_name}}</div>
                  <div class="tcolumn">{{item.total}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'
import { product, store, client, user } from '@/assets/js/api'
import { ProductForm, SkuInfo } from '@/types/product'
import { SkuStoreSave } from '@/types/store'
export default Vue.extend({
  data(): { list: ProductForm[]; store_info: SkuStoreSave; [propName: string]: any } {
    return {
      loading: true,
      store_info: {
        sku_code: '',
        number: '',
        stock_id: '',
        price: '',
        client_name: '',
        type: '', // 1入库，2出库
        order_id: '',
        desc: ''
      },
      store_flag: false,
      store_arr: [],
      search_type: 0,
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
      client_id: '',
      client_list: [],
      user_id: '0',
      user_list: [],
      keyword: '',
      page: 1,
      total: 1,
      log_flag: false,
      log_list: [],
      log_sts: {
        inNum: 0,
        outNum: 0
      },
      sku_flag: false,
      sku_list: [],
      list: [],
      date: []
    }
  },
  methods: {
    reset() {
      this.$router.push('/store/list/page=1&&keyword=&&date=&&client_id=&&user_id=&&type=0')
    },
    changeRouter(page: number | string) {
      this.$router.push(
        '/store/list/page=' +
          (page || 1) +
          '&&keyword=' +
          this.keyword +
          '&&date=' +
          this.date +
          '&&client_id=' +
          this.client_id +
          '&&user_id=' +
          this.user_id +
          '&&type=' +
          this.search_type
      )
    },
    // 更新筛选条件
    getFilters() {
      const params = this.$getHash(this.$route.params.params)
      this.page = Number(params.page)
      this.keyword = params.keyword
      this.client_id = params.client_id && Number(params.client_id)
      this.user_id = params.user_id && Number(params.user_id)
      this.search_type = params.type && Number(params.type)
      if (params.date !== 'null' && params.date !== '') {
        this.date = params.date.split(',')
      } else {
        this.date = []
      }
    },
    formAdapter(data: ProductForm[]): ProductForm[] {
      const selfData = this.$clone(data)
      selfData.forEach((item: ProductForm) => {
        item.header = []
        for (const key of Object.keys(JSON.parse(item.sku_info[0].sku_info))) {
          if (key !== '库存数' && key !== '零售价' && key !== '成本价' && key !== 'sku编码' && key !== '图片') {
            item.header.push(key)
          }
        }
        item.header.unshift('图片')
        item.header.unshift('库存数')
        item.header.unshift('零售价')
        item.header.unshift('成本价')
        item.header.unshift('sku编码')
        item.sku_info.forEach((itemSku) => {
          for (const key of Object.keys(JSON.parse(itemSku.sku_info))) {
            itemSku[key] = JSON.parse(itemSku.sku_info)[key]
          }
        })
        item.store = item.sku_info.reduce((total: number, itemChild: any) => {
          return total + itemChild.store
        }, 0)
        item.header.push('操作')
      })
      return selfData
    },
    filterName(str: string) {
      if (str === '图片') {
        return 'image_url'
      } else if (str === 'sku编码') {
        return 'sku_code'
      } else if (str === '零售价') {
        return 'price'
      } else if (str === '成本价') {
        return 'cost_price'
      } else if (str === '库存数') {
        return 'store'
      } else {
        return str
      }
    },
    filterWidth(str: string) {
      if (str === '图片') {
        return 120
      } else if (str === 'sku编码') {
        return 120
      } else if (str === '成本价') {
        return 80
      } else if (str === '零售价') {
        return 80
      } else if (str === '库存数') {
        return 80
      } else if (str === '操作') {
        return 160
      } else {
        return 160
      }
    },
    getStoreInfo(sku: SkuInfo, type: number): void {
      this.store_info.sku_code = sku.sku_code
      this.store_info.type = type
      this.store_info.price = type === 1 ? sku.cost_price : sku.price
      this.store_flag = true
    },
    saveStore(): void {
      store.skuSave(this.store_info).then((res) => {
        if (res.data.status) {
          this.$message.success(Number(this.store_info.type) === 1 ? '入库成功' : '出库成功')
          this.store_flag = false
          this.getList()
        }
      })
    },
    getList(): void {
      this.loading = true
      product
        .list({
          page: this.page,
          limit: 10,
          product_code: this.search_type === 1 ? this.keyword : '',
          sku_code: this.search_type === 2 ? this.keyword : '',
          name: this.search_type === 0 ? this.keyword : '',
          client_id: this.client_id,
          user_id: this.user_id,
          start_time: this.date && this.date.length > 0 ? this.date[0] : '',
          end_time: this.date && this.date.length > 0 ? this.date[1] : ''
        })
        .then((res) => {
          if (res.data.data) {
            this.list = this.formAdapter(res.data.data.items)
            this.total = res.data.data.total
            this.loading = false
          }
        })
    },
    getLog(id: number, type: number = 1): void {
      this.loading = true
      store
        .skuLog({
          stock_id: '',
          product_id: type === 1 ? id : '',
          sku_code: type === 2 ? id : ''
        })
        .then((res) => {
          this.loading = false
          if (type === 1) {
            this.log_list = res.data.data
            if (this.log_list.length > 0) {
              this.stsLog()
              this.log_flag = true
            } else {
              this.$message.warning('该产品暂无相关的出入库日志')
            }
          } else {
            if (res.data.data.items.length > 0) {
              this.sku_list = this.$mergeData(res.data.data.items, {
                mainRule: 'stock_id',
                otherRule: [{ name: 'stock_name' }]
              })
              this.sku_list.forEach((item: any) => {
                item.total = item.childrenMergeInfo.reduce((total: number, current: any) => {
                  if (current.type === 1) {
                    return total + current.number
                  } else if (current.type === 2) {
                    return total - current.number
                  } else {
                    return total
                  }
                }, 0)
              })
              this.sku_flag = true
            } else {
              this.$message.warning('该编码产品暂无相关的出入库日志')
            }
          }
        })
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
    deleteLog(id: number, index: number): void {
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
                this.log_list.splice(index, 1)
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
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
  created() {
    this.getFilters()
    this.getList()
    Promise.all([store.list(), client.list(), user.list()]).then((res) => {
      this.store_arr = res[0].data.data
      this.client_list = res[1].data.data
      this.user_list = res[2].data.data
    })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/store/list.less';
</style>
<style lang="less">
#storeList {
  .detailInfo {
    .image {
      padding: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 40px;
        height: 40px;
      }
    }
    .oprCtn {
      display: flex;
      align-items: center;
      justify-content: center;
      .opr {
        cursor: pointer;
        padding: 0 8px;
        border-right: 1px solid #e9e9e9;
        height: 20px;
        cursor: pointer;
        &:nth-last-child(1) {
          border-right: 0;
        }
        &:nth-child(1) {
          padding-left: 0;
        }
      }
    }
  }
}
</style>