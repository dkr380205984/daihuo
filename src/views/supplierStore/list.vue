<template>
  <div id="supplierStoreList"
    class="listCtnNoRepeat"
    v-loading="loading">
    <div class="header">
      <div class="title">供货商仓库列表</div>
      <div class="btnCtn">
        <div class="btn btnBlue"
          v-if="accountType === 4"
          @click="addStoreFlag = true;addStoreInfo.id = null;addStoreInfo.name = ''">添加仓库</div>
      </div>
    </div>
    <div class="filterCtn">
      <span class="label">筛选</span>
      <div class="elCtn">
        <el-input v-model="keyword"
          placeholder="输入仓库名称按回车搜索"
          @change="changeRouter(1)"></el-input>
      </div>
      <div class="elCtn">
        <el-select v-model="client_id"
          v-if="accountType !== 4"
          placeholder="供货商筛选"
          @change="accountType !== 4 && changeRouter(1)"
          clearable>
          <el-option v-for="item in clientArr"
            :key="item.id"
            :value="item.id"
            :label="item.name"></el-option>
        </el-select>
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
              <div class="tcolumn">仓库名称</div>
              <div class="tcolumn">所属供货商</div>
              <div class="tcolumn">当前总库存数</div>
              <!-- <div class="tcolumn">管理员</div> -->
              <div class="tcolumn">操作时间</div>
              <div class="tcolumn">操作</div>
            </div>
          </div>
        </div>
        <div class="tbody">
          <div class="trowCtn"
            v-for="item in list"
            :key="item.id">
            <div class="trow">
              <div class="tcolumn">{{item.name}}</div>
              <div class="tcolumn">{{item.client_name}}</div>
              <div class="tcolumn">{{item.total_number || 0}}</div>
              <!-- <div class="tcolumn">{{item.admins.join('/')}}</div> -->
              <div class="tcolumn">{{$getDate(item.created_at,true)}}</div>
              <div class="tcolumn flexRow">
                <span class="opr blue"
                  @click="$router.push(`/supplierStore/detail/${item.id}`)">详情</span>
                <span class="opr orange"
                  v-if="accountType === 4"
                  @click="changeStore(item)">修改</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pageCtn">
      <el-pagination background
        :current-page.sync="pages"
        :page-size="limit"
        layout="prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
    <div class="popup"
      v-show="addStoreFlag">
      <div class="main"
        style="width:500px">
        <div class="title">
          <div class="text">添加供货商仓库</div>
          <i class="el-icon-close"
            @click="addStoreFlag=false"></i>
        </div>
        <div class="content">
          <div class="row">
            <div class="label">仓库名称：</div>
            <div class="info">
              <el-input v-model="addStoreInfo.name"
                placeholder="请输入仓库名称"></el-input>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="addStoreFlag=false">取消</div>
          <div class="btn btnBlue"
            @click="addStoreSave">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { client, store } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    limit: number
    [key: string]: any
  } {
    return {
      loading: true,
      keyword: '',
      client_id: '',
      clientArr: [],
      list: [],
      pages: 1,
      limit: 10,
      total: 20,
      addStoreFlag: false,
      addStoreInfo: {
        id: null,
        name: ''
      }
    }
  },
  methods: {
    changeStore(item: any) {
      if (this.accountType !== 4) {
        this.$message.warning('仅允许供货商自己修改')
        return
      }
      this.addStoreFlag = true
      this.addStoreInfo.id = item.id
      this.addStoreInfo.name = item.name
    },
    addStoreSave() {
      if (this.accountType !== 4) {
        // 只允许供货商自己添加
        return
      }
      if (!this.addStoreSave.name) {
        this.$message.warning('请输入仓库名称')
        return
      }
      store
        .storeSave({
          id: this.addStoreInfo.id || null,
          name: this.addStoreInfo.name,
          type: 2,
          client_id: this.clientId
        })
        .then((res: any) => {
          if (res.data.status !== false) {
            this.$message.success('添加成功')
            this.addStoreInfo.name = ''
            this.addStoreFlag = false
            this.getList(this.pages)
          }
        })
    },
    reset() {
      this.$router.push('/supplierStore/list')
    },
    changeRouter(page: number | string) {
      this.$router.push(
        `/supplierStore/list?pages=${page}&keyword=${this.keyword || ''}&clientId=${this.client_id || ''}`
      )
    },
    // 更新筛选条件
    getFilters() {
      const params = this.$route.query
      this.page = Number(params.page) || 1
      this.keyword = params.keyword || ''
      this.client_id = (params.clientId && Number(params.clientId)) || ''
    },
    getList(pages: number = 1) {
      this.loading = true
      store
        .list({
          page: pages,
          limit: this.limit,
          name: this.keyword,
          client_id: this.client_id,
          type: 2
        })
        .then((res) => {
          if (res.data.status !== false) {
            this.list = res.data.data.items
            this.total = res.data.data.total
          }
        })
      this.loading = false
    }
  },
  watch: {
    page(newVal) {
      this.changeRouter(newVal)
    },
    $route() {
      // 点击返回的时候更新下筛选条件
      this.getFilters()
      this.getList()
    }
  },
  computed: {
    accountType(): 1 | 2 | 3 | 4 {
      return JSON.parse(window.localStorage.getItem('userInfo') as string).type
    },
    clientId(): number {
      return this.accountType === 4
        ? JSON.parse(window.localStorage.getItem('userInfo') as string).client_id
        : this.client_id
    }
  },
  created() {
    this.getFilters()
    this.getList()
    if (this.accountType !== 4) {
      client.list().then((res) => {
        this.clientArr = res.data.data
      })
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/supplierStore/list.less';
</style>