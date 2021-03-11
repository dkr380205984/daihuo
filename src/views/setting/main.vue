<template>
  <div id="settingMain"
    class="detailCtnNoRepeat listCtnNoRepeat"
    v-loading="loading">
    <div class="header">
      <div class="title">系统设置</div>
    </div>
    <div class="moduleCtn">
      <div class="module">
        <div class="contentCtn"
          style="padding-left:20px;padding-right:20px">
          <el-tabs v-model="activeName"
            @tab-click="changeRouter(1,true)">
            <el-tab-pane label="人员管理"
              name="user">
              <div class="content">
                <div class="filterCtn">
                  <span class="label">筛选</span>
                  <div class="elCtn">
                    <el-input v-model="keyword"
                      placeholder="搜索用户姓名"
                      @change="changeRouter(1)"></el-input>
                  </div>
                  <div class="btnCtn">
                    <div class="btn btnBlue"
                      @click="addUser">添加用户</div>
                  </div>
                </div>
                <div class="tableCtn">
                  <div class="thead">
                    <div class="trowCtn">
                      <div class="trow">
                        <div class="tcolumn">用户帐号</div>
                        <div class="tcolumn">手机号</div>
                        <div class="tcolumn">姓名</div>
                        <div class="tcolumn">身份</div>
                        <div class="tcolumn">状态</div>
                        <div class="tcolumn">创建日期</div>
                        <div class="tcolumn">操作</div>
                      </div>
                    </div>
                  </div>
                  <div class="tbody">
                    <div class="trowCtn">
                      <div class="trow"
                        v-for="item in user_list"
                        :key="item.id">
                        <div class="tcolumn">{{item.user_name}}</div>
                        <div class="tcolumn">{{item.phone}}</div>
                        <div class="tcolumn">{{item.name}}</div>
                        <div class="tcolumn">{{item.type===1?'平台人员':item.type===2?'运营商':item.type===3?'主播':'供货商'}}</div>
                        <div class="tcolumn"
                          :class="{'green':item.status===1,'red':item.status!==1}">{{item.status===1?'已启用':'已禁用'}}</div>
                        <div class="tcolumn">{{item.created_at?item.created_at.substring(0,10):''}}</div>
                        <div class="tcolumn flexRow">
                          <span class="opr orange"
                            @click="updateUser(item)">修改</span>
                          <span class="opr red"
                            @click="banUser(item.id,item.status)"
                            :class="{'red':item.status===1,'green':item.status!==1}">{{item.status===1?'禁用':'启用'}}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane v-if="user_type===1"
              label="仓库管理"
              name="store">
              <div class="content">
                <div class="filterCtn">
                  <span class="label">筛选</span>
                  <div class="elCtn">
                    <el-input v-model="keyword"
                      placeholder="搜索用户姓名"
                      @change="changeRouter(1)"></el-input>
                  </div>
                  <div class="btnCtn">
                    <div class="btn btnBlue"
                      @click="addStore">添加仓库</div>
                  </div>
                </div>
                <div class="tableCtn">
                  <div class="thead">
                    <div class="trowCtn">
                      <div class="trow">
                        <div class="tcolumn">仓库名称</div>
                        <div class="tcolumn">库存信息</div>
                        <div class="tcolumn">创建日期</div>
                        <div class="tcolumn">操作</div>
                      </div>
                    </div>
                  </div>
                  <div class="tbody">
                    <div class="trowCtn">
                      <div class="trow"
                        v-for="item in store_list"
                        :key="item.id">
                        <div class="tcolumn">{{item.name}}</div>
                        <div class="tcolumn">库存信息</div>
                        <div class="tcolumn">{{item.created_at.substring(0,10)}}</div>
                        <div class="tcolumn flexRow">
                          <span class="opr blue">详情</span>
                          <span class="opr orange"
                            @click="updateStore(item)">修改</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane v-if="user_type===1"
              label="供应商管理"
              name="client">
              <div class="content">
                <div class="filterCtn">
                  <span class="label">筛选</span>
                  <div class="elCtn">
                    <el-input v-model="keyword"
                      placeholder="搜索用户姓名"
                      @change="changeRouter(1)"></el-input>
                  </div>
                  <div class="btnCtn">
                    <div class="btn btnBlue"
                      @click="addClient">添加供应商</div>
                  </div>
                </div>
                <div class="tableCtn">
                  <div class="thead">
                    <div class="trowCtn">
                      <div class="trow">
                        <div class="tcolumn">供应商名称</div>
                        <div class="tcolumn">联系人</div>
                        <div class="tcolumn">联系方式</div>
                        <div class="tcolumn">地址</div>
                        <div class="tcolumn">简称</div>
                        <div class="tcolumn">供货类型</div>
                        <div class="tcolumn">操作</div>
                      </div>
                    </div>
                  </div>
                  <div class="tbody">
                    <div class="trowCtn">
                      <div class="trow"
                        v-for="item in client_list"
                        :key="item.id">
                        <div class="tcolumn">{{item.name}}</div>
                        <div class="tcolumn">{{item.contact}}</div>
                        <div class="tcolumn">{{item.phone}}</div>
                        <div class="tcolumn">{{item.address}}</div>
                        <div class="tcolumn">{{item.prefix}}</div>
                        <div class="tcolumn">{{item.type}}</div>
                        <div class="tcolumn flexRow">
                          <span class="opr blue">详情</span>
                          <span class="opr orange"
                            @click="updateClient(item)">修改</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane v-if="user_type===1"
              label="运营商管理"
              name="service">
              <div class="content">
                <div class="filterCtn">
                  <span class="label">筛选</span>
                  <div class="elCtn">
                    <el-input v-model="keyword"
                      placeholder="搜索用户姓名"
                      @change="changeRouter(1)"></el-input>
                  </div>
                  <div class="btnCtn">
                    <div class="btn btnBlue"
                      @click="addService">添加运营商</div>
                  </div>
                </div>
                <div class="tableCtn">
                  <div class="thead">
                    <div class="trowCtn">
                      <div class="trow">
                        <div class="tcolumn">运营商名称</div>
                        <div class="tcolumn">负责人</div>
                        <div class="tcolumn">联系方式</div>
                        <div class="tcolumn">状态</div>
                        <div class="tcolumn">备注信息</div>
                        <div class="tcolumn">操作</div>
                      </div>
                    </div>
                  </div>
                  <div class="tbody">
                    <div class="trowCtn">
                      <div class="trow"
                        v-for="item in service_list"
                        :key="item.id">
                        <div class="tcolumn">{{item.name}}</div>
                        <div class="tcolumn">{{item.user_name}}</div>
                        <div class="tcolumn">{{item.phone}}</div>
                        <div class="tcolumn"
                          :class="{'green':item.status===1,'red':item.status!==1}">{{item.status===1?'已启用':'已禁用'}}</div>
                        <div class="tcolumn">{{item.desc}}</div>
                        <div class="tcolumn flexRow">
                          <span class="opr orange"
                            @click="updateService(item)">修改</span>
                          <span class="opr red"
                            @click="banService(item.id,item.status)"
                            :class="{'red':item.status===1,'green':item.status!==1}">{{item.status===1?'禁用':'启用'}}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
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
    <div class="sidePopup"
      v-if="add_user_flag || update_user_flag">
      <div class="main">
        <div class="title">
          <div class="text">{{add_user_flag?'添加':'修改'}}用户</div>
          <i class="el-icon-close"
            @click="add_user_flag = false;update_user_flag = false"></i>
        </div>
        <div class="content">
          <div class="editCtn">
            <div class="label">手机号
              <span class="explanation">(必填)</span>
            </div>
            <div class="inputCtn">
              <el-input v-model="user_info.phone"
                placeholder="请输入手机号"></el-input>
            </div>
          </div>
          <div class="editCtn">
            <div class="label">登录账号
              <span class="explanation">(不填默认为手机号)</span>
            </div>
            <div class="inputCtn">
              <el-input v-model="user_info.user_name"
                placeholder="请输入登录帐号"></el-input>
            </div>
          </div>
          <div class="editCtn">
            <div class="label">用户姓名
              <span class="explanation">(必填)</span>
            </div>
            <div class="inputCtn">
              <el-input v-model="user_info.name"
                placeholder="请输入姓名"></el-input>
            </div>
          </div>
          <div class="editCtn">
            <div class="label">用户类型
              <span class="explanation">(必选)</span>
            </div>
            <div class="inputCtn">
              <el-select v-model="user_info.type"
                placeholder="请选择用户类型">
                <el-option v-for="item in power_arr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </div>
          </div>
          <div class="editCtn"
            v-if="user_info.type===4">
            <div class="label">所属工厂
              <span class="explanation">(必选)</span>
            </div>
            <div class="inputCtn">
              <el-select v-model="user_info.client_id"
                placeholder="请选择所属工厂">
                <el-option v-for="item in client_list"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"></el-option>
              </el-select>
            </div>
          </div>
          <div class="editCtn">
            <div class="label">备注信息
            </div>
            <div class="inputCtn">
              <el-input v-model="user_info.desc"
                placeholder="请输入备注信息"></el-input>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="btnCtn">
            <div class="btn btnGray"
              @click="add_user_flag = false;update_user_flag = false">取消</div>
            <div class="btn"
              :class="{'btnBlue':add_user_flag,'btnOrange':update_user_flag}"
              @click="saveUser">{{add_user_flag?'添加':'修改'}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="sidePopup"
      v-if="add_client_flag || update_client_flag">
      <div class="main">
        <div class="title">
          <div class="text">{{add_client_flag?'添加':'修改'}}供应商</div>
          <i class="el-icon-close"
            @click="add_client_flag = false; update_client_flag = false"></i>
        </div>
        <div class="content">
          <div class="editCtn">
            <div class="label">供应商名称
              <span class="explanation">(必填)</span>
            </div>
            <div class="inputCtn">
              <el-input v-model="client_info.name"
                placeholder="请输入供应商名称"></el-input>
            </div>
          </div>
          <div class="editCtn">
            <div class="label">联系人
            </div>
            <div class="inputCtn">
              <el-input v-model="client_info.contact"
                placeholder="请输入联系人姓名"></el-input>
            </div>
          </div>
          <div class="editCtn">
            <div class="label">联系方式
              <span class="explanation">(必填)</span>
            </div>
            <div class="inputCtn">
              <el-input v-model="client_info.phone"
                placeholder="请输入供应商/联系人手机号"></el-input>
            </div>
          </div>
          <div class="editCtn">
            <div class="label">单位地址
            </div>
            <div class="inputCtn">
              <el-input v-model="client_info.address"
                placeholder="请输入单位地址"></el-input>
            </div>
          </div>
          <div class="editCtn">
            <div class="label">供应商简称
              <span class="explanation">(必填)</span>
            </div>
            <div class="inputCtn">
              <el-input v-model="client_info.prefix"
                @input="filterPrefix"
                placeholder="请输入供应商首字母简称，如桐庐凯瑞，输入TLKR或KR"></el-input>
            </div>
          </div>
          <div class="editCtn">
            <div class="label">服务类型
              <span class="explanation">(必填)</span>
            </div>
            <div class="inputCtn">
              <el-input v-model="client_info.type"
                placeholder="例如围巾，手套，帽子等，可以统称为小商品或服装"></el-input>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="btnCtn">
            <div class="btn btnGray"
              @click="add_client_flag = false;update_client_flag = false">取消</div>
            <div class="btn"
              :class="{'btnBlue':add_client_flag,'btnOrange':update_client_flag}"
              @click="saveClient">{{add_client_flag?'添加':'修改'}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="sidePopup"
      v-if="add_store_flag || update_store_flag">
      <div class="main">
        <div class="title">
          <div class="text">{{add_store_flag?'添加':'修改'}}仓库</div>
          <i class="el-icon-close"
            @click="add_store_flag = false;update_store_flag = false"></i>
        </div>
        <div class="content">
          <div class="editCtn">
            <div class="label">仓库名称
              <span class="explanation">(必填)</span>
            </div>
            <div class="inputCtn">
              <el-input v-model="store_info.name"
                placeholder="请输入名称"></el-input>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="btnCtn">
            <div class="btn btnGray"
              @click="add_store_flag = false;update_store_flag = false">取消</div>
            <div class="btn"
              :class="{'btnBlue':add_store_flag,'btnOrange':update_store_flag}"
              @click="saveStore">{{add_store_flag?'添加':'修改'}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="sidePopup"
      v-if="add_service_flag || update_service_flag">
      <div class="main">
        <div class="title">
          <div class="text">{{add_service_flag?'添加':'修改'}}运营商</div>
          <i class="el-icon-close"
            @click="add_service_flag = false;update_service_flag = false"></i>
        </div>
        <div class="content">
          <div class="editCtn">
            <div class="label">运营商名称
              <span class="explanation">(必填)</span>
            </div>
            <div class="inputCtn">
              <el-input v-model="service_info.name"
                placeholder="请输入运营商名称"></el-input>
            </div>
          </div>
          <div class="editCtn">
            <div class="label">负责人
              <span class="explanation">(必填)</span>
            </div>
            <div class="inputCtn">
              <el-input v-model="service_info.user_name"
                placeholder="请输入联系人姓名"></el-input>
            </div>
          </div>
          <div class="editCtn">
            <div class="label">联系方式
              <span class="explanation">(必填)</span>
            </div>
            <div class="inputCtn">
              <el-input v-model="service_info.phone"
                placeholder="请输入供应商/联系人手机号"></el-input>
            </div>
          </div>
          <div class="editCtn">
            <div class="label">备注信息
            </div>
            <div class="inputCtn">
              <el-input v-model="service_info.desc"
                placeholder="请输入备注信息"></el-input>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="btnCtn">
            <div class="btn btnGray"
              @click="add_service_flag = false;update_service_flag = false">取消</div>
            <div class="btn"
              :class="{'btnBlue':add_service_flag,'btnOrange':update_service_flag}"
              @click="saveService">{{add_service_flag?'添加':'修改'}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { StoreInfo } from '@/types/store'
import { ClientInfo } from '@/types/client'
import { UserInfo, ServiceInfo } from '@/types/setting'
import { store, client, user, service } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    user_info: UserInfo
    store_info: StoreInfo
    user_list: UserInfo[]
    store_list: StoreInfo[]
    client_info: ClientInfo
    client_list: ClientInfo[]
    service_info: ServiceInfo
    service_list: ServiceInfo[]
    [propName: string]: any
  } {
    return {
      loading: true,
      keyword: '',
      activeName: 'user',
      add_user_flag: false,
      update_user_flag: false,
      user_info: {
        user_name: '',
        phone: '',
        name: '',
        desc: '',
        type: '',
        client_id: ''
      },
      user_type: 1,
      user_list: [],
      power_arr: [
        {
          value: 1,
          label: '平台帐号'
        },
        {
          value: 2,
          label: '运营帐号'
        },
        {
          value: 3,
          label: '主播'
        }
      ],
      add_store_flag: false,
      update_store_flag: false,
      store_info: {
        name: ''
      },
      store_list: [],
      add_client_flag: false,
      update_client_flag: false,
      client_info: {
        name: '',
        contact: '',
        phone: '',
        address: '',
        prefix: '',
        type: ''
      },
      client_list: [],
      add_service_flag: false,
      update_service_flag: false,
      service_list: [],
      service_info: {
        name: '',
        user_name: '',
        phone: '',
        desc: ''
      },
      total: 0,
      page: 1
    }
  },
  watch: {
    page(newVal) {
      this.changeRouter(newVal)
    },
    $route(newVal) {
      // 点击返回的时候更新下筛选条件
      this.getFilters()
      this.getNowList()
    }
  },
  methods: {
    filterPrefix(value: string) {
      const reg = /^\w{0,6}$/
      if (!reg.test(value)) {
        this.client_info.prefix = value.slice(0, value.length - 1)
        this.$message.warning('简称只能有字母、数字或下划线组成，且不可超出6位')
      }
    },
    changeRouter(page: number | string, reset?: boolean) {
      if (reset) {
        this.keyword = ''
      }
      this.$router.push('/setting/main/page=' + (page || 1) + '&&keyword=' + this.keyword + '&&type=' + this.activeName)
    },
    // 更新筛选条件
    getFilters() {
      const params = this.$getHash(this.$route.params.params)
      this.page = Number(params.page)
      this.keyword = params.keyword
      this.activeName = params.type
    },
    getNowList() {
      if (this.activeName === 'store') {
        this.getStoreList()
      } else if (this.activeName === 'client') {
        this.getClientList()
      } else if (this.activeName === 'service') {
        this.getServiceList()
      } else if (this.activeName === 'user') {
        this.getUserList()
      }
    },
    getStoreList(): void {
      this.loading = true
      store
        .list({
          name: this.keyword,
          page: this.page,
          limit: 10
        })
        .then((res) => {
          if (res.data.status) {
            this.store_list = res.data.data.items
            this.total = res.data.data.total
            this.loading = false
          }
        })
    },
    getClientList(): void {
      this.loading = true
      client
        .list({
          name: this.keyword,
          page: this.page,
          limit: 10
        })
        .then((res) => {
          if (res.data.status) {
            this.client_list = res.data.data.items
            this.total = res.data.data.total
            this.loading = false
          }
        })
    },
    getUserList(): void {
      this.loading = true
      user
        .list({
          name: this.keyword,
          page: this.page,
          limit: 10
        })
        .then((res) => {
          if (res.data.status) {
            this.user_list = res.data.data.items
            this.total = res.data.data.total
            this.loading = false
          }
        })
    },
    getServiceList(): void {
      this.loading = true
      service
        .list({
          name: this.keyword,
          page: this.page,
          limit: 10
        })
        .then((res) => {
          if (res.data.status) {
            this.service_list = res.data.data.items
            this.total = res.data.data.total
            this.loading = false
          }
        })
    },
    addUser(): void {
      this.add_user_flag = true
      this.user_info = {
        user_name: '',
        phone: '',
        name: '',
        desc: '',
        type: '' // 类型拿用户信息
      }
    },
    addStore(): void {
      this.add_store_flag = true
      this.store_info = {
        name: ''
      }
    },
    addClient(): void {
      this.add_client_flag = true
      this.client_info = {
        name: '',
        contact: '',
        phone: '',
        address: '',
        prefix: '',
        type: ''
      }
    },
    addService(): void {
      this.add_service_flag = true
      this.service_info = {
        name: '',
        user_name: '',
        phone: '',
        desc: ''
      }
    },
    saveUser(): void {
      if (!this.userCheck()) {
        return
      }
      user.save(this.user_info).then((res) => {
        if (res.data.status) {
          this.$message.success('添加成功')
          this.add_user_flag = false
          this.getUserList()
        }
      })
    },
    saveStore(): void {
      if (!this.storeCheck()) {
        return
      }
      store.storeSave(this.store_info).then((res) => {
        if (res.data.status) {
          this.$message.success('添加成功')
          this.add_store_flag = false
          this.getStoreList()
        }
      })
    },
    saveClient(): void {
      if (!this.clientCheck()) {
        return
      }
      client.save(this.client_info).then((res) => {
        if (res.data.status) {
          this.$message.success('添加成功')
          this.add_client_flag = false
          this.getClientList()
        }
      })
    },
    saveService(): void {
      if (!this.serviceCheck()) {
        return
      }
      service.save(this.service_info).then((res) => {
        if (res.data.status) {
          this.$message.success('添加成功')
          this.add_service_flag = false
          this.getServiceList()
        }
      })
    },
    banUser(id: number, status: number) {
      this.$confirm(status === 1 ? '禁用该帐号会导致帐号不能登录, 是否继续?' : '是否重新启用该账号', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          user.ban({ id }).then((res) => {
            if (res.data.status) {
              this.$message.success('操作成功')
              this.getUserList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消禁用'
          })
        })
    },
    banService(id: number, status: number) {
      this.$confirm(status === 1 ? '禁用该帐号会导致帐号不能登录, 是否继续?' : '是否重新启用该账号', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          service.ban({ id }).then((res) => {
            if (res.data.status) {
              this.$message.success('操作成功')
              this.getServiceList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消禁用'
          })
        })
    },
    updateUser(userInfo: UserInfo) {
      this.update_user_flag = true
      this.user_info = userInfo
    },
    updateClient(clientInfo: ClientInfo) {
      this.update_client_flag = true
      this.client_info = clientInfo
    },
    updateStore(storeInfo: StoreInfo) {
      this.update_store_flag = true
      this.store_info = storeInfo
    },
    updateService(serviceInfo: ServiceInfo) {
      this.update_service_flag = true
      this.service_info = serviceInfo
    },
    userCheck(): boolean {
      if (!this.user_info.phone) {
        this.$message.error('请输入手机号')
        return false
      }
      if (!this.user_info.user_name) {
        this.user_info.user_name = this.user_info.phone
      }
      if (!this.user_info.name) {
        this.$message.error('请输入姓名')
        return false
      }
      return true
    },
    storeCheck(): boolean {
      if (!this.store_info.name) {
        this.$message.error('请输入仓库名称')
        return false
      }
      return true
    },
    clientCheck(): boolean {
      if (!this.client_info.name) {
        this.$message.error('请输入供应商名称')
        return false
      }
      if (!this.client_info.phone) {
        this.$message.error('请输入联系方式')
        return false
      }
      if (!this.client_info.prefix) {
        this.$message.error('请输入供应商简称')
        return false
      }
      if (!this.client_info.type) {
        this.$message.error('请输入供应商类型')
        return false
      }
      return true
    },
    serviceCheck(): boolean {
      if (!this.service_info.name) {
        this.$message.error('请输入运营商名称')
        return false
      }
      if (!this.service_info.phone) {
        this.$message.error('请输入联系方式')
        return false
      }
      return true
    }
  },
  filters: {
    filterType(type: string | number) {
      if (Number(type) === 1) {
        return '平台帐号'
      } else if (Number(type) === 2) {
        return '运营帐号'
      } else {
        return '主播'
      }
    }
  },
  mounted() {
    this.getFilters()
    this.getNowList()
    const userInfo = JSON.parse(window.localStorage.getItem('userInfo') as string)
    if (userInfo.type === 1) {
      this.power_arr = [
        {
          value: 1,
          label: '平台帐号'
        },
        {
          value: 2,
          label: '运营帐号'
        },
        {
          value: 4,
          label: '供货商帐号'
        }
      ]
    } else if (userInfo.type === 2) {
      this.power_arr = [
        {
          value: 2,
          label: '运营'
        },
        {
          value: 3,
          label: '主播'
        }
      ]
    }
    this.user_type = userInfo.type
    client.list().then((res) => {
      this.client_list = res.data.data
    })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/setting/main.less';
</style>