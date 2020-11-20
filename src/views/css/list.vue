<template>
  <div class="listCtnNoRepeat">
    <div class="header">
      <div class="title">库存列表</div>
      <div class="btnCtn">
        <div class="btn btnBlue">添加仓库</div>
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
                    <div class="tl">配色组</div>
                    <div class="tl">配色组</div>
                    <div class="tl">配色组</div>
                    <div class="tl">配色组</div>
                    <div class="tl">配色组</div>
                  </div>
                </div>
                <div class="tb">
                  <div class="tr">
                    <div class="tl">配色组</div>
                    <div class="tl">配色组</div>
                    <div class="tl">配色组</div>
                    <div class="tl">配色组</div>
                    <div class="tl">配色组</div>
                  </div>
                  <div class="tr">
                    <div class="tl">配色组</div>
                    <div class="tl">配色组</div>
                    <div class="tl">配色组</div>
                    <div class="tl">配色组</div>
                    <div class="tl">配色组</div>
                  </div>
                  <div class="tr">
                    <div class="tl">配色组</div>
                    <div class="tl">配色组</div>
                    <div class="tl">配色组</div>
                    <div class="tl">配色组</div>
                    <div class="tl">配色组</div>
                  </div>
                  <div class="tr">
                    <div class="tl">配色组</div>
                    <div class="tl">配色组</div>
                    <div class="tl">配色组</div>
                    <div class="tl">配色组</div>
                    <div class="tl">配色组</div>
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component
export default class List extends Vue {
  msg: string = ''
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/common.less';
</style>