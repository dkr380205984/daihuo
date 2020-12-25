<template>
  <div id="settingMain"
    class="detailCtnNoRepeat listCtnNoRepeat">
    <div class="header">
      <div class="title">系统设置</div>
    </div>
    <div class="moduleCtn">
      <div class="module">
        <div class="contentCtn"
          style="padding-left:20px;padding-right:20px">
          <el-tabs v-model="activeName"
            @tab-click="handleClick">
            <el-tab-pane label="人员管理"
              name="user">
              <div class="content">
                <div class="filterCtn">
                  <span class="label">筛选</span>
                  <div class="elCtn">
                    <el-input v-model="msg"
                      placeholder="搜索用户姓名"></el-input>
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
                        <div class="tcolumn">权限</div>
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
                        <div class="tcolumn">{{item.type|filterType}}</div>
                        <div class="tcolumn"
                          :class="{'green':item.status===1,'red':item.status!==1}">{{item.status===1?'启用':'禁用'}}</div>
                        <div class="tcolumn">{{item.created_at.substring(0,10)}}</div>
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
            <el-tab-pane label="仓库管理"
              name="store">
              <div class="content">
                <div class="filterCtn">
                  <span class="label">筛选</span>
                  <div class="elCtn">
                    <el-input v-model="msg"
                      placeholder="搜索用户姓名"></el-input>
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
            <el-tab-pane label="供应商管理"
              name="client">
              <div class="content">
                <div class="filterCtn">
                  <span class="label">筛选</span>
                  <div class="elCtn">
                    <el-input v-model="msg"
                      placeholder="搜索用户姓名"></el-input>
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
            <el-tab-pane label="运营商管理"
              name="service">
              <div class="content">
                <div class="filterCtn">
                  <span class="label">筛选</span>
                  <div class="elCtn">
                    <el-input v-model="msg"
                      placeholder="搜索运营商名称"></el-input>
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
                        <div class="tcolumn">{{item.contact}}</div>
                        <div class="tcolumn">{{item.phone}}</div>
                        <div class="tcolumn">{{item.desc}}</div>
                        <div class="tcolumn flexRow">
                          <span class="opr blue">详情</span>
                          <span class="opr orange">修改</span>
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
            <div class="label">用户身份
              <span class="explanation">(必填)</span>
            </div>
            <div class="inputCtn">
              <el-select v-model="user_info.type"
                placeholder="请选择用户身份">
                <el-option v-for="item in power_arr"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"></el-option>
              </el-select>
            </div>
          </div>
          <!-- <div class="editCtn">
            <div class="label">用户状态
              <span class="explanation">(必选)</span>
            </div>
            <div class="inputCtn"
              style="line-height:32px">
              <el-switch v-model="user_info.state"
                active-color="#01B48C"
                inactive-color="#F5222D"
                active-text="启用"
                inactive-text="禁用">
              </el-switch>
            </div>
          </div> -->
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
      v-if="add_service_flag">
      <div class="main">
        <div class="title">
          <div class="text">添加运营商</div>
          <i class="el-icon-close"
            @click="add_service_flag = false"></i>
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
            </div>
            <div class="inputCtn">
              <el-input v-model="service_info.contact"
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
              @click="add_service_flag = false">取消</div>
            <div class="btn btnBlue"
              @click="saveService">添加</div>
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
import { store, client, user } from '@/assets/js/api'
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
      msg: '',
      activeName: 'user',
      add_user_flag: false,
      update_user_flag: false,
      user_info: {
        user_name: '',
        phone: '',
        name: '',
        desc: '',
        type: '' // 权限
      },
      user_list: [],
      power_arr: [
        {
          value: 1,
          label: '平台'
        },
        {
          value: 2,
          label: '运营'
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
        contact: '',
        phone: '',
        desc: ''
      },
      total: 0
    }
  },
  methods: {
    handleClick() {
      if (this.activeName === 'store') {
        this.getStoreList()
      } else if (this.activeName === 'client') {
        this.getClientList()
      }
    },
    getStoreList(): void {
      store
        .list({
          page: 1,
          limit: 10
        })
        .then((res) => {
          if (res.data.status) {
            this.store_list = res.data.data
          }
        })
    },
    getClientList(): void {
      client
        .list({
          page: 1,
          limit: 10
        })
        .then((res) => {
          if (res.data.status) {
            this.client_list = res.data.data.items
            this.total = res.data.data.total
          }
        })
    },
    getUserList(): void {
      user
        .list({
          page: 1,
          limit: 10
        })
        .then((res) => {
          if (res.data.status) {
            this.user_list = res.data.data.items
            this.total = res.data.data.total
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
        type: '' // 权限
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
        contact: '',
        phone: '',
        desc: ''
      }
    },
    saveUser(): void {
      user.save(this.user_info).then((res) => {
        if (res.data.status) {
          this.$message.success('添加成功')
          this.add_user_flag = false
        }
      })
    },
    saveStore(): void {
      store.storeSave(this.store_info).then((res) => {
        if (res.data.status) {
          this.$message.success('添加成功')
          this.add_store_flag = false
        }
      })
    },
    saveClient(): void {
      client.save(this.client_info).then((res) => {
        if (res.data.status) {
          this.$message.success('添加成功')
          this.add_client_flag = false
        }
      })
    },
    saveService(): void {
      console.log('hjaa')
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
            message: '已取消删除'
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
    }
  },
  filters: {
    filterType(type: string | number) {
      if (Number(type) === 1) {
        return '平台'
      } else if (Number(type) === 2) {
        return '运营'
      } else {
        return '主播'
      }
    }
  },
  mounted() {
    this.getUserList()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/setting/main.less';
</style>