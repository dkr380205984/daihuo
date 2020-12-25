<template>
  <div class='printHtml'>
    <div class="printTable small"
      v-for="itemClient in list"
      :key="itemClient.id">
      <div style="text-align:center;line-height:41px;font-size:20px;font-weight:bold;letter-spacing:2px">围巾城{{$route.type==='1'?'入库':'出库'}}单</div>
      <div class="print_body">
        <div class="print_row bgGray">
          <span class="row_item center bgGray"
            style="flex:0.5">序号</span>
          <span class="row_item center">产品编号</span>
          <span class="row_item center">产品名称</span>
          <span class="row_item center">sku编码</span>
          <span class="row_item center"
            style="flex:1.5">款式</span>
          <span class="row_item center"
            style="flex:0.7">数量</span>
          <span class="row_item center"
            style="flex:0.7">总价</span>
        </div>
        <div v-for="index in 9"
          :key="index"
          class="print_row">
          <template v-if="itemClient.childrenMergeInfo.length>=index">
            <span class="row_item center bgGray"
              style="flex:0.5">{{index}}</span>
            <span class="row_item center">{{itemClient.childrenMergeInfo[index-1].product_code}}</span>
            <span class="row_item center">{{itemClient.childrenMergeInfo[index-1].product_name}}</span>
            <span class="row_item center">{{itemClient.childrenMergeInfo[index-1].sku_code}}</span>
            <span class="row_item center"
              style="flex:1.5">{{getSkuName(itemClient.childrenMergeInfo[index-1].sku_info,itemClient.childrenMergeInfo[index-1].category_info)}}</span>
            <span class="row_item center"
              style="flex:0.7">{{itemClient.childrenMergeInfo[index-1].total_number}}</span>
            <span class="row_item center"
              style="flex:0.7">{{itemClient.childrenMergeInfo[index-1].total_price}}元</span>
          </template>
          <template v-else>
            <span class="row_item center bgGray"
              style="flex:0.5">{{index}}</span>
            <span class="row_item center "></span>
            <span class="row_item center"></span>
            <span class="row_item center"></span>
            <span class="row_item center"
              style="flex:1.5"></span>
            <span class="row_item center"
              style="flex:0.7"></span>
            <span class="row_item center"
              style="flex:0.7"></span>
          </template>
        </div>
        <div class="print_row">
          <span class="row_item center bgGray">合计金额</span>
          <span class="row_item center">{{total_price}}元</span>
          <span class="row_item center bgGray">打印日期</span>
          <span class="row_item center">{{$getDate(new Date())}}</span>
          <span class="row_item center bgGray">收货人签字</span>
          <span class="row_item center"></span>
        </div>
        <div class="print_row"
          style="border-bottom:0">
          <span class="row_item center bgGray">供货单位</span>
          <span class="row_item center">{{itemClient.client_name}}</span>
          <span class="row_item center bgGray">制单员/电话</span>
          <span class="row_item center"></span>
          <span class="row_item center bgGray">客户签字</span>
          <span class="row_item center"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'
import { store } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    list: any[]
    [propName: string]: any
  } {
    return {
      list: [],
      total_price: 0
    }
  },
  methods: {
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
    getSkuName(skuInfo: string, categoryInfo: string): string {
      let returnStr = ''
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
        returnStr = returnStr + skuInfoSelf[key] + '/'
      })
      return returnStr.substring(0, returnStr.length - 1)
    },
    getList(data: any[]): any[] {
      const selfData = this.$clone(data).map((item: any) => {
        return {
          client_name: item.product_info.client_name,
          client_id: item.product_info.client_id,
          number: item.number,
          category_info: item.product_info.category_info,
          product_code: item.product_info.product_code,
          product_name: item.product_info.name,
          sku_info: item.sku.sku_info,
          sku_code: item.sku.sku_code,
          price: item.price
        }
      })
      const mergeData = this.$mergeData(selfData, {
        mainRule: 'client_id',
        otherRule: [{ name: 'client_name' }],
        childrenRule: {
          mainRule: ['sku_code', 'price'],
          otherRule: [
            { name: 'sku_info' },
            { name: 'product_code' },
            { name: 'category_info' },
            { name: 'product_name' }
          ]
        }
      })
      const returnData: any[] = []
      mergeData.forEach((itemClient: any) => {
        let start = 0
        const end = itemClient.childrenMergeInfo.length
        while (end - start > 9) {
          returnData.push({
            client_name: itemClient.client_name,
            client_id: itemClient.client_id,
            childrenMergeInfo: itemClient.childrenMergeInfo.slice(start, start + 9)
          })
          start += 9
        }
        returnData.push({
          client_name: itemClient.client_name,
          client_id: itemClient.client_id,
          childrenMergeInfo: itemClient.childrenMergeInfo.slice(start, end)
        })
      })
      returnData.forEach((itemClient: any) => {
        itemClient.childrenMergeInfo.forEach((itemSku: any) => {
          itemSku.total_number = itemSku.childrenMergeInfo.reduce((total: number, current: any) => {
            return total + current.number
          }, 0)
          itemSku.total_price = itemSku.childrenMergeInfo.reduce((total: number, current: any) => {
            return total + current.number * (Number(itemSku.price) || 0)
          }, 0)
        })
      })
      return returnData
    }
  },
  mounted() {
    store
      .getLogById({
        id: this.$route.params.id.split(',')
      })
      .then((res) => {
        console.log(res)
        this.list = this.getList(res.data.data)
        console.log(this.list)
        this.total_price = this.list.reduce((total, current) => {
          return (
            total +
            current.childrenMergeInfo.reduce((totalChild: number, currentChild: any) => {
              return totalChild + currentChild.total_price
            }, 0)
          )
        }, 0)
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/print/printCommon.less';
</style>