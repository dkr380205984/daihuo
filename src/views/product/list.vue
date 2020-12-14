<template>
  <div class="listCtnNoRepeat">
    <div class="header">
      <div class="title">产品列表</div>
      <div class="btnCtn">
        <div class="btn btnBlue"
          @click="$router.push('/product/create')">添加产品</div>
      </div>
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
              <div class="tcolumn">{{item.product_code}}</div>
              <div class="tcolumn">{{item.name}}</div>
              <div class="tcolumn">
                <zh-img-list :list="item.images"></zh-img-list>
              </div>
              <div class="tcolumn">{{item.client_name || '暂无'}}</div>
              <div class="tcolumn">
                <span class="blue">{{item.min_price + '元 ~ ' + item.max_price + '元'}}</span>
              </div>
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
import { product } from '@/assets/js/api'
export default Vue.extend({
  data() {
    return {
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
    getList() {
      product
        .list({
          page: 1,
          limit: 10
        })
        .then((res) => {
          this.list = res.data.data.items
          this.total = res.data.data.total
        })
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