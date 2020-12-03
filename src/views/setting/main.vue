<template>
  <div id="settingMain">
    <div class="listCtnNoRepeat">
      <div class="header">
        <div class="title">系统设置</div>
        <div class="btnCtn">
          <div class="btn btnBlue"
            @click="addTypeFlag=true;typeInfo.id=''">添加品类</div>
        </div>
      </div>
      <div class="filterCtn">
        <span class="label">筛选</span>
        <div class="elCtn">
          <el-input v-model="msg"
            placeholder="搜索品类名称"></el-input>
        </div>
        <div class="btnCtn">
          <div class="btn btnGray">重置</div>
        </div>
      </div>
      <div class="content">
        <div class="tableCtn">
          <div class="thead">
            <div class="trowCtn">
              <div class="trow">
                <div class="tcolumn">品类名称</div>
                <div class="tcolumn">操作</div>
              </div>
            </div>
          </div>
          <div class="tbody">
            <div class="trowCtn"
              v-for="(item,index) in list"
              :key="index">
              <div class="trow">
                <div class="tcolumn">
                  <span class="text">
                    <span class="showMore">
                      <i class="el-icon-arrow-right"></i>
                    </span>
                    {{item.name}}
                  </span>
                </div>
                <div class="tcolumn flexRow">
                  <span class="opr">详情</span>
                  <span class="opr orange"
                    @click="updateForm(item)">修改</span>
                  <span class="opr red">删除</span>
                </div>
              </div>
              <div class="detailInfo">
                <div class="tableInfo">
                  <div class="th">
                    <div class="tr">
                      <div class="tl"><span class="text">一级分类</span></div>
                      <div class="tl"><span class="text">一级常用项</span></div>
                      <div class="tl"
                        style="flex:2">
                        <div class="tr">
                          <div class="tl"><span class="text">二级分类</span></div>
                          <div class="tl"><span class="text">二级常用项</span></div>
                        </div>
                      </div>
                      <div class="tl"><span class="text">是否必填项</span></div>
                      <div class="tl"><span class="text">是否必填项</span></div>
                    </div>
                  </div>
                  <div class="tb">
                    <div class="tr"
                      v-for="(itemChild,indexChild) in item.category_menu"
                      :key="indexChild">
                      <div class="tl"><span class="text">{{itemChild.name}}</span></div>
                      <div class="tl"><span class="text"
                          :style="{'color':itemChild.commonUse.length>0?'':'#ccc'}">{{itemChild.commonUse.length>0?itemChild.commonUse.join(','):'无常用项'}}</span></div>
                      <div class="tl"
                        style="flex:2">
                        <div class="tr"
                          v-if="itemChild.category_menu.length===0"><span class="text"
                            style="color:#ccc">无二级分类</span></div>
                        <div class="tr"
                          v-for="(itemSecond,indexSecond) in itemChild.category_menu"
                          :key="indexSecond">
                          <div class="tl"><span class="text">{{itemSecond.name}}</span></div>
                          <div class="tl"><span class="text"
                              :style="{'color':itemSecond.commonUse.length>0?'':'#ccc'}">{{itemSecond.commonUse.length>0?itemSecond.commonUse.join(','):'无常用项'}}</span></div>
                        </div>
                      </div>
                      <div class="tl"><span class="text"
                          :style="{'color':itemChild.ifCompose?'#1a95ff':'#ccc'}">{{itemChild.ifCompose?'是':'否'}}</span></div>
                      <div class="tl"><span class="text"
                          :style="{'color':itemChild.ifMust?'#1a95ff':'#ccc'}">{{itemChild.ifMust?'是':'否'}}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sidePopup"
      v-if="addTypeFlag || updateTypeFlag">
      <div class="main">
        <div class="title">
          <div class="text">{{addTypeFlag?'添加':'修改'}}品类</div>
          <i class="el-icon-close"
            @click="addTypeFlag = false ; updateTypeFlag = false ; "></i>
        </div>
        <div class="content">
          <div class="editCtn">
            <div class="label must">品类名称
              <span class="explanation">(必填)</span>
            </div>
            <div class="inputCtn">
              <el-input v-model="typeInfo.name"
                placeholder="输入品类名称"></el-input>
            </div>
            <div class="btn btnWhiteBlue sepcialBtn"
              @click="addFirst">添加一级分类</div>
            <div class="firstModuleCtn">
              <div class="moduleCtn"
                v-for="(item,index) in typeInfo.category_menu"
                :key="index">
                <i class="deleteIcon el-icon-close"
                  @click="deleteItem(typeInfo.category_menu,index)"></i>
                <div class="editCtn">
                  <div class="label must">分类名称
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="inputCtn">
                    <el-input v-model="item.name"
                      placeholder="输入一级分类的名称"></el-input>
                  </div>
                </div>
                <div class="editCtn"
                  style="display:flex">
                  <div style="flex:1">
                    <div class="inputCtn"
                      style="line-height:32px">
                      <el-switch v-model="item.ifCompose"
                        active-text="组合项"
                        inactive-text="非组合项"
                        @change="composeIsMust($event,item)">
                      </el-switch>
                      <el-tooltip class="item"
                        effect="dark"
                        content="组合项必为必填项"
                        placement="top">
                        <i class="el-icon-question"
                          style="vertical-align: middle;color: #ccc;margin-left: 8px;"></i>
                      </el-tooltip>
                    </div>
                  </div>
                  <div style="flex:1">
                    <div class="inputCtn"
                      style="line-height:32px">
                      <el-switch v-model="item.ifMust"
                        active-text="必填项"
                        inactive-text="非必填项">
                      </el-switch>
                    </div>
                  </div>
                </div>
                <div class="editCtn"
                  v-if="!item.hasChild">
                  <div class="inputCtn">
                    <div class="onceTag tag"
                      v-for="(itemTag,indexTag) in item.commonUseOld"
                      :key="indexTag + 'old'">
                      {{itemTag}}
                      <div class="deleteIcon"
                        @click="deleteItem(item.commonUseOld,indexTag,'firstType')">
                        <i class="el-icon-close"></i>
                      </div>
                    </div>
                    <div class="onceTag"
                      v-for="(itemNew,indexNew) in item.commonUseNew"
                      :key="indexNew + 'new'">
                      <el-input style="height:32px;width:100px"
                        v-model="item.commonUseNew[indexNew]"
                        placeholder="建议项">
                      </el-input>
                      <div class="deleteIcon"
                        @click="deleteItem(item.commonUseNew,indexNew)">
                        <i class="el-icon-close"></i>
                      </div>
                    </div>
                    <div class="plusBtn"
                      @click="item.commonUseNew.push('')"><i class="el-icon-plus"></i></div>
                  </div>
                </div>
                <div class="editCtn">
                  <div class="inputCtn"
                    style="line-height:32px">
                    <el-switch v-model="item.hasChild"
                      active-text="含二级分类"
                      inactive-text="不含二级分类">
                    </el-switch>
                    <div class="btn btnWhiteBlue sepcialBtn2"
                      v-if="item.hasChild"
                      @click="addSecond(item.category_menu)">添加二级分类</div>
                    <div class="secondModuleCtn"
                      v-if="item.hasChild">
                      <div class="moduleCtn"
                        v-for="(itemChild,indexChild) in item.category_menu"
                        :key="indexChild">
                        <i class="deleteIcon el-icon-close"
                          @click="deleteItem(item.category_menu,indexChild)"></i>
                        <div class="editCtn">
                          <div class="label must">分类名称
                            <span class="explanation">(必填)</span>
                          </div>
                          <div class="inputCtn">
                            <el-input v-model="itemChild.name"
                              placeholder="输入二级分类的名称"></el-input>
                          </div>
                        </div>
                        <div class="editCtn">
                          <div class="inputCtn">
                            <div class="onceTag tag"
                              v-for="(itemTag,indexTag) in itemChild.commonUseOld"
                              :key="indexTag + 'old'">
                              {{itemTag}}
                              <div class="deleteIcon"
                                @click="deleteItem(item.commonUseOld,indexTag,'firstType')">
                                <i class="el-icon-close"></i>
                              </div>
                            </div>
                            <div class="onceTag"
                              v-for="(itemNew,indexNew) in itemChild.commonUseNew"
                              :key="indexNew + 'new'">
                              <el-input style="height:32px;width:100px"
                                v-model="itemChild.commonUseNew[indexNew]"
                                placeholder="建议项">
                              </el-input>
                              <div class="deleteIcon"
                                @click="deleteItem(itemChild.commonUseNew,indexNew)">
                                <i class="el-icon-close"></i>
                              </div>
                            </div>
                            <div class="plusBtn"
                              @click="itemChild.commonUseNew.push('')"><i class="el-icon-plus"></i></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="btnCtn">
            <div class="btn btnGray"
              @click="addTypeFlag = false ; updateTypeFlag = false">取消</div>
            <div class="btn"
              @click="saveType"
              :class="{'btnBlue':addTypeFlag,'btnOrange':updateTypeFlag}">{{addTypeFlag?'添加':'修改'}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { proType } from '@/assets/js/api'
import Vue from 'vue'
interface TypeForm {
  id?: number | null | string
  name: string
  is_required?: boolean
  is_combine?: boolean
  commonUse?: any[]
  category_menu?: TypeForm[] | string | undefined
}
export default Vue.extend({
  data() {
    return {
      msg: '',
      list: [],
      addTypeFlag: false,
      updateTypeFlag: false,
      typeInfo: {
        id: '',
        name: '',
        category_menu: [
          {
            name: '',
            ifMust: false, // 是否必填
            ifCompose: false, // 是否组合
            hasChild: false, // 有无二级分类
            category_menu: [
              {
                name: '',
                commonUseOld: [] as string[],
                commonUseNew: ['']
              }
            ],
            commonUseOld: [] as string[],
            commonUseNew: ['']
          }
        ]
      }
    }
  },
  methods: {
    addFirst(): void {
      this.typeInfo.category_menu.push({
        name: '',
        ifMust: false, // 是否必填
        ifCompose: false, // 是否组合
        hasChild: false, // 有无二级分类
        category_menu: [
          {
            name: '',
            commonUseOld: [],
            commonUseNew: ['']
          }
        ],
        commonUseOld: [],
        commonUseNew: ['']
      })
    },
    addSecond(father: any[]): void {
      father.push({
        name: '',
        commonUseOld: [],
        commonUseNew: ['']
      })
    },
    deleteItem(array: any[], index: number, type?: string): void {
      if (type === 'firstType') {
        this.$confirm('是否删除该建议项?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            array.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        return
      }
      // 建议项可以删干净，其他的不行
      if (array.length === 1) {
        this.$message.error('至少有一项')
        return
      }
      array.splice(index, 1)
    },
    // 需要组合的分类必须是必填项
    composeIsMust(ev: boolean, item: any): void {
      if (ev) {
        item.ifMust = true
      }
    },
    // 适配器
    formAdapter(): TypeForm {
      const formData: TypeForm = {
        id: this.updateTypeFlag ? this.typeInfo.id : null,
        name: this.typeInfo.name,
        category_menu: JSON.stringify(
          this.typeInfo.category_menu.map((item) => {
            return {
              name: item.name,
              is_required: item.ifMust,
              is_combine: item.ifCompose,
              commonUse: item.commonUseOld.filter((itemA) => itemA).concat(item.commonUseNew.filter((itemB) => itemB)),
              category_menu: item.hasChild
                ? item.category_menu.map((itemChild) => {
                    return {
                      commonUse: itemChild.commonUseOld
                        .filter((itemA) => itemA)
                        .concat(itemChild.commonUseNew.filter((itemB) => itemB)),
                      name: itemChild.name
                    }
                  })
                : []
            }
          })
        )
      }
      return formData
    },
    // 检查表单
    formCheck(): boolean {
      let errMsg = ''
      if (!this.typeInfo.name) {
        errMsg = '请输入品类名称'
      }
      this.typeInfo.category_menu.forEach((item) => {
        if (!item.name) {
          errMsg = '请输入一级分类名称'
        }
        if (item.hasChild) {
          item.category_menu.forEach((itemChild) => {
            if (!itemChild.name) {
              errMsg = '请输入二级分类名称'
            }
          })
        }
      })
      if (errMsg) {
        this.$message.error(errMsg)
        return false
      } else {
        return true
      }
    },
    resetForm(): void {
      this.typeInfo = {
        id: '',
        name: '',
        category_menu: [
          {
            name: '',
            ifMust: false, // 是否必填
            ifCompose: false, // 是否组合
            hasChild: false, // 有无二级分类
            category_menu: [
              {
                name: '',
                commonUseOld: [] as string[],
                commonUseNew: ['']
              }
            ],
            commonUseOld: [] as string[],
            commonUseNew: ['']
          }
        ]
      }
    },
    // 保存/修改品类
    saveType(): void {
      if (this.formCheck()) {
        const formData = this.formAdapter()
        console.log(formData)
        proType.save(formData as any).then((res) => {
          if (res.data.status) {
            this.$message.success(this.addTypeFlag ? '添加成功' : '修改成功')
            this.addTypeFlag = false
            this.updateTypeFlag = false
            this.resetForm()
          }
        })
      }
    },
    // 修改品类
    updateForm(object: TypeForm) {
      const cloneData = this.$clone(object)
      this.typeInfo = cloneData
      this.updateTypeFlag = true
    }
  },
  mounted() {
    proType
      .list({
        page: 1,
        limit: 5
      })
      .then((res) => {
        if (res.data.status) {
          this.list = res.data.data.map((item: { name: string; id: number; category_menu: any }) => {
            return {
              showMore: false,
              name: item.name,
              id: item.id,
              category_menu: JSON.parse(item.category_menu).map(
                (itemChild: { name: any; is_required: any; is_combine: any; category_menu: any[]; commonUse: any }) => {
                  return {
                    name: itemChild.name,
                    ifMust: itemChild.is_required, // 是否必填
                    ifCompose: itemChild.is_combine, // 是否组合
                    hasChild: itemChild.category_menu.length > 0, // 有无二级分类
                    category_menu: itemChild.category_menu.map((itemSecond: { name: any; commonUse: any }) => {
                      return {
                        name: itemSecond.name,
                        commonUse: itemSecond.commonUse,
                        commonUseOld: itemSecond.commonUse,
                        commonUseNew: ['']
                      }
                    }),
                    commonUse: itemChild.commonUse,
                    commonUseOld: itemChild.commonUse,
                    commonUseNew: ['']
                  }
                }
              )
            }
          })
          console.log(this.list)
        }
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/setting/main.less';
</style>