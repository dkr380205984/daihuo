<template>
  <div class='printHtml'>
    <div class="printTable">
      <div style="text-align:center;line-height:40px">{{client_name}}供货单</div>
      <div class="once"
        v-for="item in sku_info"
        :key="item.sku_info.id">
        <div class="codeCtn"
          v-for="itemChild in item.number"
          :key="itemChild">
          <svg class="barcode"
            :jsbarcode-value="'WJC' + filterNumber(item.sku_info.id)">
          </svg>
          <div class="otherInfo">
            <div class="line">
              <span style="margin-right:12px;">{{item.sku_info.sku_code}}</span>
              <span>{{item.product_name}}</span>
            </div>
            <div class="line">
              <span style="margin-right:12px;"
                v-for="(itemSelf,indexSelf) in item.sku_info.sku_info"
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
import { order } from '@/assets/js/api'
import jsbarcode from 'jsbarcode'
export default Vue.extend({
  data(): {
    sku_info: any
    [propName: string]: any
  } {
    return {
      client_name: '',
      sku_info: {}
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
    }
  },
  mounted() {
    order
      .getPrint({
        client_id: Number(this.$route.params.id),
        start_time: this.$route.params.date.split(',')[0],
        end_time: this.$route.params.date.split(',')[1]
      })
      .then((res) => {
        this.client_name = res.data.data.client_name
        this.sku_info = res.data.data
        this.sku_info.client_name = ''
        delete this.sku_info.client_name
        for (const key of Object.keys(this.sku_info)) {
          const deleteObj = this.getUnCombine(this.sku_info[key].category_info)
          this.sku_info[key].sku_info.sku_info = JSON.parse(this.sku_info[key].sku_info.sku_info)
          const price = '零售价'
          const costPrice = '成本价'
          const store = '库存数'
          const image = '图片'
          const sku = 'sku编码'
          delete this.sku_info[key].sku_info.sku_info[costPrice]
          delete this.sku_info[key].sku_info.sku_info[price]
          delete this.sku_info[key].sku_info.sku_info[store]
          delete this.sku_info[key].sku_info.sku_info[image]
          delete this.sku_info[key].sku_info.sku_info[sku]
          deleteObj.forEach((item: string) => {
            delete this.sku_info[key].sku_info.sku_info[item]
          })
        }
        this.$nextTick(() => {
          jsbarcode('.barcode')
            .options({
              displayValue: false,
              height: 50
            })
            .init()
        })
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/print/printCommon.less';
</style>