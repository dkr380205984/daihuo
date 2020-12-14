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
            <el-tab-pane label="用户管理"
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
                      @click="add_user_flag=true">添加用户</div>
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
                      <div class="trow">
                        <div class="tcolumn">用户帐号</div>
                        <div class="tcolumn">手机号</div>
                        <div class="tcolumn">姓名</div>
                        <div class="tcolumn">权限</div>
                        <div class="tcolumn">状态</div>
                        <div class="tcolumn">创建日期</div>
                        <div class="tcolumn flexRow">
                          <span class="opr orange">修改</span>
                          <span class="opr red">禁用</span>
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
                      @click="add_store_flag=true">添加仓库</div>
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
                          <span class="opr orange">修改</span>
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
                      @click="add_client_flag=true">添加供应商</div>
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
                          <span class="opr orange">修改</span>
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
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <div class="sidePopup"
      v-if="add_user_flag">
      <div class="main">
        <div class="title">
          <div class="text">添加用户</div>
          <i class="el-icon-close"
            @click="add_user_flag = false"></i>
        </div>
        <div class="content">
          <div class="editCtn">
            <div class="label">手机号
              <span class="explanation">(必填)</span>
            </div>
            <div class="inputCtn">
              <el-input v-model="user_info.telephone"
                placeholder="请输入手机号"></el-input>
            </div>
          </div>
          <div class="editCtn">
            <div class="label">登录账号
              <span class="explanation">(不填默认为手机号)</span>
            </div>
            <div class="inputCtn">
              <el-input v-model="user_info.telephone"
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
          <div class="editCtn">
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
          </div>
          <div class="editCtn">
            <div class="label">备注信息
            </div>
            <div class="inputCtn">
              <el-input v-model="user_info.msg"
                placeholder="请输入备注信息"></el-input>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="btnCtn">
            <div class="btn btnGray"
              @click="add_user_flag = false">取消</div>
            <div class="btn btnBlue"
              @click="saveUser">添加</div>
          </div>
        </div>
      </div>
    </div>
    <div class="sidePopup"
      v-if="add_client_flag">
      <div class="main">
        <div class="title">
          <div class="text">添加供应商</div>
          <i class="el-icon-close"
            @click="add_client_flag = false"></i>
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
              @click="add_client_flag = false">取消</div>
            <div class="btn btnBlue"
              @click="saveClient">添加</div>
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
import { UserInfo } from '@/types/setting'
import { store, client } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    user_info: UserInfo
    store_info: StoreInfo
    user_list: UserInfo[]
    store_list: StoreInfo[]
    client_info: ClientInfo
    client_list: ClientInfo[]
    [propName: string]: any
  } {
    return {
      msg: '',
      activeName: 'user',
      add_user_flag: false,
      user_info: {
        username: '',
        telephone: '',
        name: '',
        desc: '',
        state: true, // 状态
        type: '' // 权限
      },
      user_list: [],
      power_arr: [
        {
          value: 1,
          label: '主播'
        },
        {
          value: 2,
          label: '超管'
        },
        {
          value: 3,
          label: '工作人员'
        }
      ],
      add_store_flag: false,
      store_info: {
        name: ''
      },
      store_list: [],
      add_client_flag: false,
      client_info: {
        name: '',
        contact: '',
        phone: '',
        address: '',
        prefix: '',
        type: ''
      },
      client_list: []
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
          }
        })
    },
    saveUser(): void {
      console.log(this.user_info)
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
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/setting/main.less';
</style>