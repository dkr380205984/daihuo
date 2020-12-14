<template>
  <div class="zh_img_list"
    @click.stop="(type === 'show' ? showBig() : goRouter())">
    <div class="hover_bg">
      <div class="handle_btn_context">
        <span class="left el-icon-arrow-left handle_btn_item"
          @click.stop="firstFlag ? false : index--"></span>
        <span class="right el-icon-arrow-right handle_btn_item"
          @click.stop="lastFlag ? false : index++"></span>
      </div>
      <div class="index_info">
        {{(index+1) + ' / ' + selfList.length}}<br />{{type === 'show' ? '点击查看' : '查看详情'}}
      </div>
    </div>
    <img :src="selfList[index][showThumb] || defaultImage"
      class="img"
      :onerror="defaultImg">
    <div class="zh_img_screen"
      v-show="isClickFlag">
      <!--此处click事件是为了防止冒泡，prevent修饰符不知为何没用了-->
      <div class="close"
        @click.stop="isClickFlag = !isClickFlag">点此退出预览</div>
      <div class="zh_img_box">
        <img :src="selfList[index][showImg] || selfList[index].file_url || defaultImage"
          :onerror="defaultImg"
          class="screen_img">
        <div class="left handle_btn_item el-icon-arrow-left"
          @click.stop="firstFlag ? false : index--"></div>
        <div class="right handle_btn_item el-icon-arrow-right"
          @click.stop="lastFlag ? false : index++"></div>
        <ul class="handle_indicator">
          <li v-for="(item,key) in selfList"
            :class="index === key ? 'active' : ''"
            :key="key"
            @click="index = key"></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue, Emit, Watch } from 'vue-property-decorator'
@Component
export default class ZhImgList extends Vue {
  @Prop(Array) list!: any[]
  @Prop([String, Number]) proId?: string | number
  @Prop({ default: 'thumb' }) showThumb?: string
  @Prop({ default: 'image_url' }) showImg?: string
  @Prop({ default: 'product_id' }) showId?: string
  @Prop({ default: 'show' }) type?: string // show or open
  @Prop({ default: 'product' }) orderType?: string // product or sample
  index: number = 0
  lastFlag: boolean = false
  firstFlag: boolean = true
  isClickFlag: boolean = false
  defaultImage: string = require('@/assets/image/noPic.jpg')
  defaultImg: string = require('@/assets/image/noPic.jpg') + '"'

  showBig(): void {
    this.isClickFlag = true
  }
  goRouter(): void {
    if (!this.list[this.index] || !this.list[this.index].product_id) {
      this.$message.error('该图片暂无产品信息,将为您打开大图预览模式')
      this.showBig()
      return
    }
    if (this.orderType === 'sample' || +this.list[this.index].product_type === 2) {
      window.open('/sample/sampleDetail/' + this.list[this.index].product_id)
    } else if (this.orderType === 'product' || +this.list[this.index].product_type === 1) {
      window.open('/product/productDetail/' + this.list[this.index].product_id)
    }
  }

  @Watch('index')
  indexChange(newVal: number, oldVal: number) {
    if (newVal === this.selfList.length - 1) {
      this.lastFlag = true
    } else {
      this.lastFlag = false
    }
    if (newVal === 0) {
      this.firstFlag = true
    } else {
      this.firstFlag = false
    }
  }

  @Watch('list', { deep: true })
  listChange(newVal: number, oldVal: number) {
    if (this.index > 0) {
      this.firstFlag = false
    } else {
      this.firstFlag = true
    }
    if (this.index === this.selfList.length - 1) {
      this.lastFlag = true
    } else {
      this.lastFlag = false
    }
  }

  private get selfList() {
    // 计算属性,相当于getter
    return !this.list || this.list.length === 0
      ? [
          {
            image_url: '',
            thumb: '',
            product_id: ''
          }
        ]
      : this.list
  }

  mounted() {
    if (this.list.length === 1 || this.list.length === 0) {
      this.firstFlag = true
      this.lastFlag = true
    }
  }
}
</script>>
<style scoped lang="less">
@import './zhImgList.less';
</style>
