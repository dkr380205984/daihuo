<template>
  <div class='printHtml'>
    <div class="printTable"
      v-if="$route.query.printType !== '1'">
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
            <div class="line">
              <span>零售价：{{price || 'NAN'}}元</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else
      style="display:inline-block;padding:30px 20px 30px 50px">
      <div class="codeCtn"
        style="page-break-after: always;"
        v-for="itemChild in number"
        :key="itemChild">
        <svg class="barcode"
          :jsbarcode-value="'WJC' + filterNumber($route.params.id)">
        </svg>
        <div class="otherInfo"
          style="text-align:center">
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
          <div class="line">
            <span>价格：{{price || 'NAN'}}元</span>
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
    price: null | number
  } {
    return {
      sku_info: [],
      sku_code: '',
      product_name: '',
      number: 0,
      price: null
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
      const onlinePrice = '线上价'
      const offlinePrice = '线下价'
      delete skuInfoSelf[costPrice]
      delete skuInfoSelf[price]
      delete skuInfoSelf[storeNum]
      delete skuInfoSelf[image]
      delete skuInfoSelf[sku]
      delete skuInfoSelf[onlinePrice]
      delete skuInfoSelf[offlinePrice]
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
        this.price = finded.price
        console.log(this.$route.params.number)
        this.$nextTick(() => {
          jsbarcode('.barcode')
            .options({
              displayValue: false,
              height: 50,
              width: this.$route.query.printType !== ' 2' ? 1.8 : 2
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