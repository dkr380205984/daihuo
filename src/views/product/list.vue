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
      <span class="label">筛选条件不能用</span>
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
      <div class="tableCtn">
        <div class="thead">
          <div class="trowCtn">
            <div class="trow">
              <div class="tcolumn">产品编号</div>
              <div class="tcolumn">产品名称</div>
              <div class="tcolumn">产品图片</div>
              <div class="tcolumn">供货单位</div>
              <div class="tcolumn">当前库存</div>
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
              <div class="tcolumn">等字段</div>
              <div class="tcolumn">{{item.name}}</div>
              <div class="tcolumn">还没加</div>
              <div class="tcolumn">没设置</div>
              <div class="tcolumn">等字段</div>
              <div class="tcolumn">
                <span class="blue">{{item.min_price + '元 ~ ' + item.max_price + '元'}}</span>
              </div>
              <div class="tcolumn">等字段</div>
              <div class="tcolumn flexRow"
                style="flex:1.5">
                <span class="opr">详情</span>
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
        layout="prev, pager, next"
        :total="1000">
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
      msg: '',
      total: 1,
      list: []
    }
  },
  methods: {
    getList() {
      product
        .list({
          page: 1,
          limit: 5
        })
        .then((res) => {
          console.log(res)
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