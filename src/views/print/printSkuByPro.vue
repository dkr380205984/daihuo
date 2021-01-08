<template>
  <div class='printHtml'>
    <div class="printTable">
      <div style="text-align:center;line-height:40px">产品sku编码打印</div>
      <div class="once">
        <div class="codeCtn"
          v-for="itemChild in number"
          :key="itemChild">
          <svg class="barcode"
            :jsbarcode-value="'WJC' + filterNumber($route.params.id)">
          </svg>
          <div class="otherInfo">
            <div class="line">
              <span style="margin-right:12px;">{{sku_code}}</span>
              <span>{{product_name}}</span>
            </div>
            <div class="line">
              <span style="margin-right:12px;"
                v-for="(itemSelf,indexSelf) in sku_info"
                :key="indexSelf">
                {{itemSelf}}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { product } from '@/assets/js/api'
import { SkuInfo } from '@/types/product'
import jsbarcode from 'jsbarcode'
export default Vue.extend({
  data(): {
    sku_info: string[]
    sku_code: string
    product_name: string
    number: number
  } {
    return {
      sku_info: [],
      sku_code: '',
      product_name: '',
      number: 0
    }
  },
  methods: {
    filterNumber(skuId: number) {
      const num = new Array(8 - skuId.toString().length).fill('0')
      num.push(skuId)
      return num.join('')
    },
    // 把非组合项找出来
    getUnCombine(categoryInfo: string): string[] {
      const categoryInfoArray = JSON.parse(categoryInfo)
      const returnObj = [] as string[]
      categoryInfoArray.forEach((item: any) => {
        if (!item.is_combine) {
          if (!item.keyArr) {
            returnObj.push(item.name)
          } else {
            if (item.keyArr instanceof Array) {
              returnObj.push(item.keyArr.join(','))
            } else {
              returnObj.push(Object.keys(item.keyArr).join(','))
            }
          }
        }
      })
      return returnObj
    },
    getSkuName(skuInfo: string, categoryInfo: string): string[] {
      const returnArr = [] as string[]
      const skuInfoSelf = JSON.parse(skuInfo)
      const deleteObj = this.getUnCombine(categoryInfo)
      const price = '成本价'
      const costPrice = '零售价'
      const storeNum = '库存数'
      const image = '图片'
      const sku = 'sku编码'
      delete skuInfoSelf[costPrice]
      delete skuInfoSelf[price]
      delete skuInfoSelf[storeNum]
      delete skuInfoSelf[image]
      delete skuInfoSelf[sku]
      deleteObj.forEach((item: string) => {
        delete skuInfoSelf[item]
      })
      Object.keys(skuInfoSelf).forEach((key) => {
        returnArr.push(skuInfoSelf[key])
      })
      return returnArr
    }
  },
  mounted() {
    this.number = Number(this.$route.params.number)
    product.detail({ id: this.$route.params.proId }).then((res) => {
      if (res.data.status) {
        this.product_name = res.data.data.name
        const finded = res.data.data.sku_info.find((item: SkuInfo) => Number(item.id) === Number(this.$route.params.id))
        this.sku_code = finded.sku_code
        this.sku_info = this.getSkuName(finded.sku_info, res.data.data.category_info)
        console.log(this.$route.params.number)
        this.$nextTick(() => {
          jsbarcode('.barcode')
            .options({
              displayValue: false,
              height: 50
            })
            .init()
        })
      }
    })
  }
})
</script>
<style lang="less" scoped>
@import '~@/assets/less/print/printCommon.less';
</style>