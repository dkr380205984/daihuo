<template>
  <div id="stockList"
    class="listCtnNoRepeat">
    <div class="header">
      <div class="title">库存列表</div>
    </div>
    <div class="filterCtn">
      <span class="label">筛选</span>
      <div class="elCtn">
        <el-select v-model="search_type"
          placeholder="选择搜索类型">
          <el-option v-for="item in search_type_list"
            :key="item.value"
            :value="item.value"
            :label="item.name"></el-option>
        </el-select>
      </div>
      <div class="elCtn">
        <el-input v-model="keyword"
          :placeholder="'输入' + search_type_list[search_type].name + '搜索'"></el-input>
      </div>
      <div class="elCtn">
        <el-select v-model="client_id"
          placeholder="搜索供货单位">
          <el-option v-for="item in client_list"
            :key="item.id"
            :value="item.id"
            :label="item.name"></el-option>
        </el-select>
      </div>
      <div class="elCtn">
        <el-date-picker v-model="date"
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
        <div class="btn btnBlue">重置</div>
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
              <div class="tcolumn">产品价格</div>
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
              <div class="tcolumn">
                <span class="blue">{{item.min_price + '元 ~ ' + item.max_price + '元'}}</span>
              </div>
              <div class="tcolumn">{{item.create_time.substring(0,10)}}</div>
              <div class="tcolumn flexRow">
                <span class="opr blue"
                  @click="$message.error('详情页还没做')">详情</span>
              </div>
            </div>
            <div class="detailInfo"
              v-show="item.show">
              <div class="tableInfo">
                <div class="th">
                  <div class="tr">
                    <div class="tl"
                      v-for="(itemHeader,indexHeader) in item.header"
                      :key="indexHeader"><span class="text">{{itemHeader}}</span></div>
                  </div>
                </div>
                <div class="tb">
                  <div class="tr"
                    v-for="itemSku in item.sku_info"
                    :key="itemSku.id">
                    <div class="tl"
                      v-for="(itemHeader,indexHeader) in item.header"
                      :key="indexHeader">
                      <span class="text"
                        v-if="itemHeader!=='图片' && itemHeader!=='操作'">{{itemSku[filterName(itemHeader)]}}</span>
                      <div class="image"
                        v-if="itemHeader==='图片'"><img :src="itemSku.image_url || require('@/assets/image/noPic.jpg')" /></div>
                      <span class="oprCtn"
                        v-if="itemHeader==='操作'">
                        <span class="opr orange"
                          @click="getStoreInfo(itemSku.sku_code,1)">入库</span>
                        <span class="opr green"
                          @click="getStoreInfo(itemSku.sku_code,2)">出库</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
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
      v-show="storeFlag">
      <div class="main"
        style="width:600px">
        <div class="title">
          <div class="text">产品{{Number(storeInfo.type)===1?'入库':'出库'}}</div>
          <i class="el-icon-close"
            @click="storeFlag=false"></i>
        </div>
        <div class="content">
          <div class="row">
            <div class="label">sku编码：</div>
            <div class="info text"
              style="color:#1a95ff">
              {{storeInfo.sku_code}}
            </div>
          </div>
          <div class="row">
            <div class="label">{{Number(storeInfo.type)===1?'入库':'出库'}}数量：</div>
            <div class="info">
              <el-input placeholder="请输入数量"
                v-model="storeInfo.number">
              </el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">选择仓库：</div>
            <div class="info">
              <el-select placeholder="请选择仓库"
                v-model="storeInfo.stock_id">
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
                v-model="storeInfo.desc"></el-input>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="storeFlag=false">取消</div>
          <div class="btn btnBlue"
            @click="saveStore">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'
import { product, store } from '@/assets/js/api'
import { ProductForm } from '@/types/product'
import { SkuStoreSave } from '@/types/store'
export default Vue.extend({
  data(): { list: ProductForm[]; storeInfo: SkuStoreSave; [propName: string]: any } {
    return {
      storeInfo: {
        sku_code: '',
        number: '',
        stock_id: 1,
        type: '', // 1入库，2出库
        order_id: '',
        desc: ''
      },
      storeFlag: false,
      store_arr: [],
      search_type: 0,
      search_type_list: [
        {
          value: 0,
          name: '产品名称'
        },
        {
          value: 1,
          name: 'sku编码'
        }
      ],
      client_id: '',
      client_list: [],
      keyword: '',
      page: 1,
      total: 1,
      list: [],
      date: []
    }
  },
  methods: {
    formAdapter(data: ProductForm[]): ProductForm[] {
      const selfData = this.$clone(data)
      selfData.forEach((item: ProductForm) => {
        item.header = []
        for (const key of Object.keys(JSON.parse(item.sku_info[0].sku_info))) {
          if (key !== '库存数' && key !== '单价' && key !== 'sku编码' && key !== '图片') {
            item.header.push(key)
          }
        }
        item.header.unshift('图片')
        item.header.unshift('库存数')
        item.header.unshift('单价')
        item.header.unshift('sku编码')
        item.sku_info.forEach((itemSku) => {
          for (const key of Object.keys(JSON.parse(itemSku.sku_info))) {
            itemSku[key] = JSON.parse(itemSku.sku_info)[key]
          }
        })
        item.header.push('操作')
      })
      return selfData
    },
    filterName(str: string) {
      if (str === '图片') {
        return 'image_url'
      } else if (str === 'sku编码') {
        return 'sku_code'
      } else if (str === '单价') {
        return 'price'
      } else if (str === '库存数') {
        return 'store'
      } else {
        return str
      }
    },
    getStoreInfo(sku: string, type: number): void {
      this.storeInfo.sku_code = sku
      this.storeInfo.type = type
      this.storeFlag = true
    },
    saveStore(): void {
      store.skuSave(this.storeInfo).then((res) => {
        console.log(res)
        if (res.data.status) {
          this.$message.success(Number(this.storeInfo.type) === 1 ? '入库' : '出库' + '成功')
          this.storeFlag = false
        }
      })
    },
    getList(): void {
      product
        .list({
          page: 1,
          limit: 10
        })
        .then((res) => {
          if (res.data.data) {
            this.list = this.formAdapter(res.data.data.items)
            this.total = res.data.data.total
          }
        })
    }
  },
  mounted() {
    this.getList()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/product/list.less';
</style>