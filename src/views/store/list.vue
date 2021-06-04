<template>
  <div id="storeList"
    class="listCtnNoRepeat"
    v-loading="loading">
    <div class="header">
      <div class="title">库存列表</div>
      <div class="btnCtn">
        <div class="btn btnBlue"
          @click="exportStoreData"
          v-if="user_info.type===1">导出当前库存数据</div>
        <div class="btn btnBlue"
          @click="excel_flag=true"
          v-if="user_info.type===1">查看导出列表</div>
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
          placeholder="输入信息按回车搜索"
          @change="changeRouter(1)"></el-input>
      </div>
      <div class="elCtn"
        style="width:150px">
        <el-select v-if="user_info.type===1"
          v-model="client_id"
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
              <div class="tcolumn"
                v-if="user_info.type===1">供货单位</div>
              <div class="tcolumn">库存数</div>
              <div class="tcolumn">创建时间</div>
              <div class="tcolumn"
                v-if="user_info.type===1">操作</div>
            </div>
          </div>
        </div>
        <div class="tbody">
          <div class="trowCtn"
            v-for="item in list"
            :key="item.id">
            <div class="trow">
              <div class="tcolumn">
                <span class="text"
                  v-if="user_info.type===1"><i class="icon"
                    :class="{'el-icon-arrow-right':!item.show,'el-icon-arrow-down':item.show}"
                    @click="item.show=!item.show;$forceUpdate()"></i>{{item.product_code}}</span>
                <span class="text"
                  v-if="user_info.type!==1">{{item.product_code}}</span>
              </div>
              <div class="tcolumn">{{item.name}}</div>
              <div class="tcolumn">
                <zh-img-list :list="item.images"></zh-img-list>
              </div>
              <div class="tcolumn"
                v-if="user_info.type===1">{{item.client_name || '暂无'}}</div>
              <div class="tcolumn"
                :class="{'orange':item.store===0,'green':item.store>0}">{{item.store}}</div>
              <div class="tcolumn">{{item.create_time.substring(0,10)}}</div>
              <div class="tcolumn flexRow"
                v-if="user_info.type===1">
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
                    <span :class="`text ${itemHeader === '库存数' && 'green' || ''}`"
                      v-if="itemHeader!=='图片' && itemHeader!=='操作'">{{scope.row[filterName(itemHeader)]}}</span>
                    <div class="image"
                      v-if="itemHeader==='图片'"><img :src="scope.row.image_url || require('@/assets/image/noPic.jpg')" /></div>
                    <div class="oprCtn"
                      v-if="itemHeader==='操作'"
                      style="width:140px">
                      <span class="opr orange"
                        @click="getStoreInfo(item.sku_info,scope.row,1,item.id)">入库</span>
                      <span class="opr green"
                        @click="getStoreInfo(item.sku_info,scope.row,2)">出库</span>
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
        <div class="content"
          v-if="store_flag === 1">
          <h2 class="green"
            style="text-align:center">入库成功！</h2>
          <div class="normalTb">
            <div class="thead">
              <div class="trow">
                <div class="tcolumn center"
                  style="flex:0.5">序号</div>
                <div class="tcolumn center">sku编码</div>
                <div class="tcolumn center">入库仓库</div>
                <div class="tcolumn center"
                  style="flex:0.7">入库数量</div>
                <div class="tcolumn center"
                  style="flex:1.5">打印方式</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="(itemInfo,indexInfo) in goStoreAfterInfo"
                :key="indexInfo">
                <div class="tcolumn center"
                  style="flex:0.5">{{indexInfo + 1}}</div>
                <div class="tcolumn center blue">{{itemInfo.sku_code}}</div>
                <div class="tcolumn center">{{itemInfo.store_name}}</div>
                <div class="tcolumn center"
                  style="flex:0.7">{{itemInfo.number}}</div>
                <div class="tcolumn center"
                  style="flex:1.5;flex-direction:row;
                  align-items:center">
                  <span class="btn noBorder noMargin"
                    style="padding:0"
                    @click="openPrint(1,itemInfo)">卷纸打印</span>
                  <span class="btn noBorder"
                    style="padding:0"
                    @click="openPrint(2,itemInfo)">A4打印</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="content"
          v-else>
          <template v-for="(itemStore,indexStore) in store_info.data">
            <div class="row"
              :key="`sku_code_${indexStore}`">
              <div class="label">sku编码：</div>
              <div class="info">
                <el-select :placeholder="`请选择需要${store_info.type === 1 && '入库' || '出库'}的sku产品`"
                  v-model="itemStore.sku_code"
                  @change="getStoreNumber(itemStore,true,store_info)">
                  <el-option v-for="item in store_info.skuArr"
                    :key="item.id"
                    :value="item.sku_code"
                    :label="item.sku_code"></el-option>
                </el-select>
              </div>
            </div>
            <div class="row"
              v-if="store_info.type === 2"
              :key="`store_name_${indexStore}`">
              <div class="label">选择仓库：</div>
              <div class="info"
                style="display:flex;">
                <el-select placeholder="请选择仓库"
                  v-model="itemStore.stock_id"
                  @change="getStoreNumber(itemStore)">
                  <el-option v-for="item in store_arr"
                    :key="item.id"
                    :value="item.id"
                    :label="item.name"></el-option>
                </el-select>
                <el-input placeholder="当前库存剩余数量"
                  disabled
                  style="margin-left:16px"
                  v-model="itemStore.stock_number">
                </el-input>
              </div>
            </div>
            <div class="row"
              :key="`number_price_${indexStore}`">
              <div class="label">{{Number(store_info.type)===1?'入库':'出库'}}数量：</div>
              <div class="info cutPriceOut"
                style="display:flex;">
                <el-input placeholder="请输入数量"
                  v-model="itemStore.number">
                </el-input>
                <el-input :placeholder="`请输入${Number(store_info.type)===1?'入库':'出库'}单价`"
                  style="margin-left:16px"
                  v-model="itemStore.price">
                  <template slot="append">元</template>
                </el-input>
                <div class="cutPriceCom"
                  v-if="store_info.type === 2">
                  <span class="top el-icon-caret-top"
                    @click="changePriceType(itemStore,-1)"></span>
                  <span :class="`show ${itemStore.price_type === itemPrice.type && 'active'}`"
                    v-for="(itemPrice,indexPrice) in itemStore.priceArr"
                    :key="indexPrice">{{itemPrice.name}}</span>
                  <span class="bottom el-icon-caret-bottom"
                    @click="changePriceType(itemStore,1)"></span>
                </div>
              </div>
            </div>
            <div class="row"
              :key="`handle_button_${indexStore}`">
              <div class="info"
                style="display:flex;justify-content:flex-end">
                <div v-if="indexStore === 0"
                  style="border:1px solid #1A95FF;color:#1A95FF;line-height:32px;border-radius:4px;padding: 0 1em;cursor: pointer;"
                  @click="addItem(store_info.data)">添加下一组</div>
                <div v-else
                  style="border:1px solid #F5222D;color:#F5222D;line-height:32px;border-radius:4px;padding: 0 1em;cursor: pointer;margin-left:16px"
                  @click="deleteItem(store_info.data,indexStore)">删除</div>
              </div>
            </div>
          </template>
          <div class="row"
            v-if="Number(store_info.type)===2">
            <div class="label">出库单位：</div>
            <div class="info">
              <el-autocomplete v-model="store_info.out_client_name"
                :fetch-suggestions="querySearchOutClient"
                placeholder="请输入库存去向"></el-autocomplete>
            </div>
          </div>
          <div class="row"
            v-if="Number(store_info.type)===1">
            <div class="label">入库仓库：</div>
            <div class="info">
              <el-select placeholder="请选择仓库"
                v-model="store_info.go_store_id">
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
          <template v-if="store_flag === 1">
            <div class="btn btnBlue"
              @click="store_flag = false">确定</div>
          </template>
          <template v-else>
            <div class="btn btnGray"
              @click="store_flag=false">取消</div>
            <div class="btn btnBlue"
              @click="saveStore">确定</div>
          </template>
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
                    <div class="tcolumn">单价类型</div>
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
                    <div class="tcolumn">{{item.price_type|filterPriceType}}</div>
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
    <div class="popup"
      v-show="excel_flag">
      <div class="main">
        <div class="title">
          <div class="text">下载库存表格文件列表</div>
          <i class="el-icon-close"></i>
        </div>
        <div class="content">
          <div class="tableCtn">
            <div class="normalTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn">文件名称</div>
                  <div class="tcolumn">更新时间</div>
                  <div class="tcolumn">文件状态</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="item in excel_list"
                  :key="item.id">
                  <div class="tcolumn">{{item.name}}</div>
                  <div class="tcolumn">{{item.complete_time.slice(0,10)}}</div>
                  <div class="tcolumn">
                    <div style="cursor:pointer"
                      :class="{'blue':item.status===2,'green':item.status===1,'red':item.status===3}"
                      @click="downloadExcel(item)">{{item.status===1?'处理中':item.status===2?'点击下载':'导出失败'}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnBlue"
            @click="excel_flag=false">确定</div>
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
  data(): {
    list: ProductForm[]
    store_info: {
      product_id?: string | number
      skuArr: SkuInfo[]
      desc: string
      go_store_id: string | number
      out_client_name: string
      type: 1 | 2
      data: SkuStoreSave[]
    }
    [propName: string]: any
  } {
    return {
      loading: true,
      excel_flag: false,
      excel_list: [],
      store_info: {
        skuArr: [],
        desc: '',
        go_store_id: '',
        out_client_name: '',
        type: 1,
        data: [
          {
            sku_code: '',
            number: '',
            stock_id: '',
            price: '',
            client_name: '',
            type: '', // 1入库，2出库
            order_id: '',
            desc: ''
          }
        ]
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
      date: [],
      goStoreAfterInfo: [],
      user_info: JSON.parse(window.localStorage.getItem('userInfo') as string)
    }
  },
  methods: {
    exportStoreData() {
      store.exportStoreBase64().then((res) => {
        this.$message.success('正在导出数据，请等待数据返回')
        store.exportStore().then((res2) => {
          this.excel_list = res2.data.data
          this.excel_flag = true
        })
      })
    },
    downloadExcel(info: any) {
      if (info.status === 2) {
        window.open(info.url)
      } else if (info.status === 1) {
        this.$message.warning('请等待3-5分钟刷新页面查询结果')
      } else {
        this.$message.warning('导出失败，请重新导出')
      }
    },
    changePriceType(item: any, type: 1 | -1) {
      const nowIndex = item.priceArr.findIndex((itemF: any) => itemF.type === item.price_type)
      if (nowIndex === -1) {
        item.price = 0
        item.price_type = ''
        this.$message.warning('未知错误，当前价格类型不存在')
        return
      }
      let nextIndex = nowIndex + type
      if (nextIndex >= 0) {
        nextIndex = nextIndex % item.priceArr.length
      } else {
        nextIndex = item.priceArr.length - 1
      }
      item.price = item.priceArr[nextIndex].price
      item.price_type = item.priceArr[nextIndex].type
    },
    getPriceArr(item: any) {
      return [
        // { name: '成本价', price: (item && item.cost_price) || 0 },
        { name: '零售价', type: 1, price: (item && item.price) || 0 },
        { name: '线上价', type: 2, price: (item && item.price_online) || 0 },
        { name: '线下价', type: 3, price: (item && item.price_offline) || 0 }
      ]
    },
    openPrint(type: 1 | 2, itemInfo: any) {
      window.open(
        `/print/printSkuByPro/${itemInfo.sku_id}/${itemInfo.number || 1}/${itemInfo.product_id}?printType=${type}`
      )
    },
    getStoreNumber(item: SkuStoreSave, flag: boolean = false, storeInfo: any) {
      if (flag) {
        // 选择sku产品自动填充价格
        const finded = storeInfo.skuArr.find((itemF: any) => itemF.sku_code === item.sku_code)
        if (finded && storeInfo.type === 1) {
          item.price = finded.cost_price
        } else if (finded && storeInfo.type === 2) {
          item.price = finded.price
          item.price_type = 1
          item.priceArr = this.getPriceArr(finded)
        }
      }
      if (!item.sku_code) {
        item.stock_number = 0
        this.$forceUpdate()
        return
      }
      if (!item.stock_id) {
        item.stock_number = 0
        this.$forceUpdate()
        return
      }
      store
        .getSkuStoreNumber({
          sku_code: item.sku_code,
          stock_id: item.stock_id
        })
        .then((res) => {
          if (res.data.status !== false) {
            item.stock_number = res.data.data
            this.$forceUpdate()
          }
        })
    },
    addItem(data: SkuStoreSave[]) {
      data.push({
        sku_code: '',
        number: '',
        stock_id: '',
        price: '',
        client_name: '',
        type: '', // 1入库，2出库
        order_id: '',
        desc: ''
      })
    },
    deleteItem(data: SkuStoreSave[], index: number) {
      if (data.length === 1) {
        this.$message.warning('最少保留一组数据')
        return
      }
      data.splice(index, 1)
    },
    querySearchOutClient(queryString: string, callback: (returnArr: Array<{ value: string }>) => void) {
      const list = JSON.parse(window.sessionStorage.getItem('outStoreClient') || JSON.stringify([]))
      callback(queryString ? list.filter((itemF: { value: string }) => itemF.value.indexOf(queryString)) : list)
    },
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
        return 140
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
    getStoreInfo(skus: SkuInfo[], sku: SkuInfo, type: 1 | 2, productId?: number | string): void {
      let obj = {}
      if (type === 2) {
        obj = {
          price_type: 1,
          priceArr: this.getPriceArr(sku)
        }
      }
      this.store_info = {
        skuArr: skus,
        product_id: productId,
        desc: '',
        go_store_id: '',
        out_client_name: '',
        type,
        data: [
          {
            sku_code: sku.sku_code,
            number: '',
            stock_id: '',
            price: type === 1 ? sku.cost_price : sku.price,
            client_name: '',
            type: '', // 1入库，2出库
            order_id: '',
            desc: '',
            ...obj
          }
        ]
      }
      this.store_flag = true
    },
    saveStore(): void {
      const flag = {
        go_store_id: true,
        out_client_name: true,
        sku_code: true,
        number: true,
        out_store_id: true,
        price: true
      }
      if (this.store_info.type === 1) {
        flag.go_store_id = !!this.store_info.go_store_id
      } else {
        flag.out_client_name = !!this.store_info.out_client_name
      }
      const data = this.store_info.data.map((itemM) => {
        if (!itemM.sku_code) {
          flag.sku_code = false
        }
        if (!itemM.number) {
          flag.number = false
        }
        if (!itemM.stock_id && this.store_info.type === 2) {
          flag.out_store_id = false
        }
        if (!itemM.price) {
          flag.price = false
        }
        let obj = {}
        if (this.store_info.type === 2) {
          // 是否存在price_type
          obj = {
            price_type: itemM.price_type
          }
        }
        return {
          sku_code: itemM.sku_code,
          number: itemM.number,
          stock_id: this.store_info.type === 1 ? this.store_info.go_store_id : itemM.stock_id,
          price: itemM.price,
          price_type: itemM.price_type,
          client_name: this.store_info.out_client_name || '',
          type: this.store_info.type,
          order_id: '',
          desc: this.store_info.desc,
          ...obj
        }
      })
      if (this.store_info.type === 1) {
        this.goStoreAfterInfo = this.store_info.data.map((itemM) => {
          const skuInfo = this.store_info.skuArr.find((itemF) => itemF.sku_code === itemM.sku_code)
          const storeInfo = this.store_arr.find((itemF: any) => itemF.id === this.store_info.go_store_id)
          return {
            product_id: this.store_info.product_id,
            sku_id: skuInfo && skuInfo.id,
            sku_code: itemM.sku_code,
            number: itemM.number,
            stock_id: this.store_info.go_store_id,
            store_name: storeInfo && storeInfo.name
          }
        })
      }
      if (!flag.go_store_id) {
        this.$message.warning(`请选择入库仓库`)
        return
      }
      if (!flag.out_client_name) {
        this.$message.warning('请输入出库单位')
        return
      }
      if (!flag.sku_code) {
        this.$message.warning(`请选择${this.store_info.type === 1 ? '入' : '出'}库的sku产品`)
        return
      }
      if (!flag.number) {
        this.$message.warning(`请输入${this.store_info.type === 1 ? '入' : '出'}库数量`)
        return
      }
      if (!flag.out_store_id) {
        this.$message.warning('请选择出库仓库')
        return
      }
      if (!flag.price) {
        this.$message.warning(`请输入${this.store_info.type === 1 ? '入' : '出'}库单价`)
        return
      }
      store.skuSave({ data }).then((res) => {
        if (res.data.status !== false) {
          this.$message.success(Number(this.store_info.type) === 1 ? '入库成功' : '出库成功')
          if (this.store_info.type === 1) {
            this.store_flag = 1
          } else {
            this.store_flag = false
          }
          if (this.store_info.type !== 1) {
            // 添加出库单位本地缓存
            const list = JSON.parse(window.sessionStorage.getItem('outStoreClient') || JSON.stringify([]))
            list.push({
              value: this.store_info.out_client_name
            })
            window.sessionStorage.setItem('outStoreClient', JSON.stringify(list))
          }
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
          end_time: this.date && this.date.length > 0 ? this.date[1] : '',
          filter_client: true
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
            if (res.data.data.length > 0) {
              this.sku_list = this.$mergeData(res.data.data, {
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
    Promise.all([store.list(), client.list(), user.list(), store.exportStore()]).then((res) => {
      this.store_arr = res[0].data.data
      this.client_list = res[1].data.data
      this.user_list = res[2].data.data
      this.excel_list = res[3].data.data
    })
  },
  filters: {
    filterPriceType(item: number) {
      switch (item) {
        case 1:
          return '零售价'
        case 2:
          return '线上价'
        case 3:
          return '线下价'
        default:
          return '-'
      }
    }
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