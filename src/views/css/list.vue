<template>
  <div class="listCtnNoRepeat">
    <div class="header">
      <div class="title">库存列表</div>
      <div class="btnCtn">
        <div class="btn btnBlue"
          @click="addOrderFlag=true">打开悬浮窗</div>
      </div>
    </div>
    <div class="filterCtn">
      <span class="label">筛选</span>
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
              <div class="tcolumn">产品名称</div>
              <div class="tcolumn">产品名称</div>
              <div class="tcolumn">产品名称</div>
              <div class="tcolumn">产品名称</div>
              <div class="tcolumn">产品名称</div>
              <div class="tcolumn">产品名称</div>
              <div class="tcolumn">操作</div>
            </div>
          </div>
        </div>
        <div class="tbody">
          <div class="trowCtn">
            <div class="trow">
              <div class="tcolumn">产品名称</div>
              <div class="tcolumn">产品名称</div>
              <div class="tcolumn">产品名称</div>
              <div class="tcolumn">产品名称</div>
              <div class="tcolumn">产品名称</div>
              <div class="tcolumn">产品名称</div>
              <div class="tcolumn flexRow">
                <span class="opr">添加</span>
                <span class="opr orange">修改</span>
                <span class="opr red">删除</span>
              </div>
            </div>
            <div class="detailInfo">
              <div class="tableInfo">
                <div class="th">
                  <div class="tr">
                    <div class="tl"><span class="text">配色组</span></div>
                    <div class="tl"><span class="text">配色组</span></div>
                    <div class="tl"><span class="text">配色组</span></div>
                    <div class="tl"><span class="text">配色组</span></div>
                    <div class="tl"><span class="text">配色组</span></div>
                  </div>
                </div>
                <div class="tb">
                  <div class="tr">
                    <div class="tl"><span class="text">配色组</span></div>
                    <div class="tl"><span class="text">配色组</span></div>
                    <div class="tl"><span class="text">配色组</span></div>
                    <div class="tl"><span class="text">配色组</span></div>
                    <div class="tl"><span class="text">配色组</span></div>
                  </div>
                  <div class="tr">
                    <div class="tl"><span class="text">配色组</span></div>
                    <div class="tl"><span class="text">配色组</span></div>
                    <div class="tl"><span class="text">配色组</span></div>
                    <div class="tl"><span class="text">配色组</span></div>
                    <div class="tl"><span class="text">配色组</span></div>
                  </div>
                  <div class="tr">
                    <div class="tl"><span class="text">配色组</span></div>
                    <div class="tl"><span class="text">配色组</span></div>
                    <div class="tl"><span class="text">配色组</span></div>
                    <div class="tl"><span class="text">配色组</span></div>
                    <div class="tl"><span class="text">配色组</span></div>
                  </div>
                  <div class="tr">
                    <div class="tl"><span class="text">配色组</span></div>
                    <div class="tl"><span class="text">配色组</span></div>
                    <div class="tl"><span class="text">配色组</span></div>
                    <div class="tl"><span class="text">配色组</span></div>
                    <div class="tl"><span class="text">配色组</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="trowCtn">
            <div class="trow">
              <div class="tcolumn">产品名称</div>
              <div class="tcolumn">产品名称</div>
              <div class="tcolumn">产品名称</div>
              <div class="tcolumn">产品名称</div>
              <div class="tcolumn">产品名称</div>
              <div class="tcolumn">产品名称</div>
              <div class="tcolumn flexRow">
                <span class="opr">添加</span>
                <span class="opr orange">修改</span>
                <span class="opr red">删除</span>
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
    <div class="sidePopup"
      v-if="addOrderFlag">
      <div class="main">
        <div class="title">
          <div class="text">添加订单信息</div>
          <i class="el-icon-close"
            @click="addOrderFlag = false"></i>
        </div>
        <div class="content">
          <div class="editCtn">
            <div class="label">订单号
              <span class="explanation">(必填)</span>
            </div>
            <div class="inputCtn">
              <el-input v-model="msg"
                placeholder="输入订单号"></el-input>
            </div>
          </div>
          <div class="editCtn">
            <div class="label">下单公司
              <span class="explanation">(必填)</span>
            </div>
            <div class="inputCtn">
              <el-cascader v-model="msg"
                placeholder="请选择订单公司"
                clearable
                filterable></el-cascader>
            </div>
          </div>
          <div class="editCtn">
            <div class="label">结算单位
              <span class="explanation">(必填)</span>
            </div>
            <div class="inputCtn">
              <el-select v-model="msg"
                placeholder="选择结算单位">
              </el-select>
            </div>
          </div>
          <div class="editCtn">
            <div class="label">汇率
              <span class="explanation">(必填)</span>
            </div>
            <div class="inputCtn">
              <el-input placeholder="请输入汇率"
                v-model="msg">
              </el-input>
            </div>
          </div>
          <div class="editCtn">
            <div class="label">下单日期
              <span class="explanation">(必填)</span>
            </div>
            <div class="inputCtn">
              <el-date-picker v-model="msg"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="请选择下单日期">
              </el-date-picker>
            </div>
          </div>
          <div class="editCtn">
            <div class="label">发货日期
              <span class="explanation">(必填)</span>
            </div>
            <div class="inputCtn">
              <el-date-picker v-model="msg"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="请选择发货日期">
              </el-date-picker>
            </div>
          </div>
          <div class="editCtn">
            <div class="label">备注信息
            </div>
            <div class="inputCtn">
              <el-input v-model="msg"
                placeholder="请输入备注信息"></el-input>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="btnCtn">
            <div class="btn btnBlue">取消</div>
            <div class="btn">添加</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component
export default class List extends Vue {
  msg: string = ''
  addOrderFlag: boolean = false
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/common.less';
</style>