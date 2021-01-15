<template>
  <div id="productList"
    class="listCtnNoRepeat"
    v-loading="loading">
    <div class="header">
      <div class="title">产品列表</div>
      <div class="btnCtn">
        <div class="btn btnBlue"
          @click="$router.push('/product/create')">添加产品</div>
      </div>
    </div>
    <div class="filterCtn">
      <span class="label">筛选</span>
      <div class="elCtn"
        style="width:120px">
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
        style="width:120px">
        <el-select v-model="type"
          placeholder="期货/现货"
          @change="changeRouter(1)">
          <el-option value="null"
            label="全部"></el-option>
          <el-option value="现货"
            label="现货"></el-option>
          <el-option value="期货"
            label="期货"></el-option>
        </el-select>
      </div>
      <div class="elCtn"
        style="width:120px"
        v-if="show_client">
        <el-select v-model="client_id"
          placeholder="供货单位"
          @change="changeRouter(1)"
          clearable>
          <el-option v-for="item in client_list"
            :key="item.id"
            :value="item.id"
            :label="item.name"></el-option>
        </el-select>
      </div>
      <div class="elCtn"
        style="width:120px">
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
              <div class="tcolumn"
                style="flex:1.3">产品编号</div>
              <div class="tcolumn"
                style="flex:1.2">产品名称</div>
              <div class="tcolumn"
                style="text-align:center">产品图片</div>
              <div class="tcolumn">供货单位</div>
              <div class="tcolumn">产品价格</div>
              <div class="tcolumn">创建人</div>
              <div class="tcolumn">创建时间</div>
              <div class="tcolumn"
                style="flex:1.5">操作</div>
            </div>
          </div>
        </div>
        <div class="tbody">
          <div class="trowCtn"
            v-for="item in list"
            :key="item.id">
            <div class="trow">
              <div class="tcolumn flexRow"
                style="justify-content:space-between;flex:1.3">
                <span>
                  <span class="circle"
                    :class="{'green':item.type==='现货','orange':item.type==='期货'}">{{item.type==='现货'?'现':'期'}}</span>
                  {{item.product_code}}
                </span>
                <el-tooltip v-if="item.is_recommend===1"
                  class="item"
                  effect="dark"
                  content="取消推荐"
                  placement="top">
                  <i class="el-icon-open open"
                    @click="recommendPro(item.id)"></i>
                </el-tooltip>
                <el-tooltip v-else
                  class="item"
                  effect="dark"
                  content="点击推荐"
                  placement="top">
                  <i class="el-icon-turn-off off"
                    @click="recommendPro(item.id)"></i>
                </el-tooltip>
              </div>
              <div class="tcolumn"
                style="flex:1.2">{{item.name}}</div>
              <div class="tcolumn">
                <zh-img-list :list="item.images"></zh-img-list>
              </div>
              <div class="tcolumn">{{item.client_name || '暂无'}}</div>
              <div class="tcolumn">
                <span class="blue">{{item.min_price + '元 ~ ' + item.max_price + '元'}}</span>
              </div>
              <div class="tcolumn">{{item.user_name}}</div>
              <div class="tcolumn">{{item.create_time.substring(0,10)}}</div>
              <div class="tcolumn flexRow"
                style="flex:1.5">
                <span class="opr"
                  @click="$router.push('/product/detail/' + item.id)">详情</span>
                <span class="opr orange"
                  @click="$router.push('/product/update/' + item.id)">修改</span>
                <span class="opr red"
                  @click="deletePro(item.id)">删除</span>
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
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'
import { product, client, user } from '@/assets/js/api'
export default Vue.extend({
  data(): { client_id: string | number; [propName: string]: any } {
    return {
      loading: true,
      search_type: 0,
      show_client: true,
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
      list: [],
      date: [],
      type: 'null'
    }
  },
  methods: {
    getList() {
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
          type: this.type === 'null' ? '' : this.type,
          start_time: this.date && this.date.length > 0 ? this.date[0] : '',
          end_time: this.date && this.date.length > 0 ? this.date[1] : ''
        })
        .then((res) => {
          this.list = res.data.data.items
          this.total = res.data.data.total
          this.loading = false
        })
    },
    reset() {
      this.$router.push('/product/list/page=1&&keyword=&&date=&&client_id=&&user_id=&&type=0&&types=null')
    },
    changeRouter(page: number | string) {
      this.$router.push(
        '/product/list/page=' +
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
          this.search_type +
          '&&types=' +
          this.type
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
      this.type = params.types
      if (params.date !== 'null' && params.date !== '') {
        this.date = params.date.split(',')
      } else {
        this.date = []
      }
    },
    deletePro(id: string | number): void {
      this.$confirm('是否要删除该产品，删除产品会删除其对应的库存?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          product
            .delete({
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
    recommendPro(id: string | number): void {
      product
        .recommendPro({
          id
        })
        .then((res) => {
          if (res.data.status) {
            this.$message.success('操作成功')
            this.getList()
          }
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
    Promise.all([client.list(), user.list()]).then((res) => {
      this.client_list = res[0].data.data
      this.user_list = res[1].data.data
    })
    if (JSON.parse(window.localStorage.getItem('userInfo') as string).type === 4) {
      this.show_client = false
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/product/list.less';
</style>