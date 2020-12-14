<template>
  <div id="productDetail"
    class="detailCtnNoRepeat">
    <div class="header">
      <div class="title">产品详情</div>
    </div>
    <div class="moduleCtn">
      <div class="module">
        <div class="titleCtn">
          <div class="title">详情页面</div>
        </div>
        <div class="contentCtn">
          <div class="rowCtn">
            <div class="colCtn flex3">
              <div class="label">产品编号：</div>
              <div class="text blue">{{product_code}}</div>
            </div>
            <div class="colCtn flex3">
              <div class="label">产品名称：</div>
              <div class="text">{{product_name}}</div>
            </div>
          </div>
          <div class="rowCtn">
            <div class="colCtn flex3">
              <div class="label">产品品牌：</div>
              <div class="text">{{product_brand||'暂无品牌'}}</div>
            </div>
            <div class="colCtn flex3">
              <div class="label">供货商：</div>
              <div class="text">{{from_client||'暂无供货商'}}</div>
            </div>
            <div class="colCtn flex3">
              <div class="label">创建日期：</div>
              <div class="text">{{create_time}}</div>
            </div>
          </div>
          <div class="rowCtn">
            <div class="colCtn flex3">
              <div class="label">备注信息：</div>
              <div class="text blue">{{desc}}</div>
            </div>
          </div>
          <div class="rowCtn">
            <div class="colCtn">
              <span class="label">产品图片：</span>
              <div class="imgCtn">
                <el-image style="width:150px;height:150px;margin-right:16px"
                  v-for="(item,index) in product_image"
                  :key="index"
                  :src="item.image_url || ''"
                  :preview-src-list="[item.image_url]">
                </el-image>
              </div>
            </div>
          </div>
          <div class="rowCtn">
            <div class="colCtn">
              <div class="label">表格信息：</div>
              <div class="tableCtn">
                <div class="normalTb">
                  <div class="thead">
                    <div class="trow">
                      <div class="tcolumn min120"
                        v-for="(item,index) in table_data.header"
                        :key="index">{{item}}</div>
                    </div>
                  </div>
                  <div class="tbody">
                    <div class="trow"
                      v-for="(item,index) in table_data.render_content"
                      :key="index">
                      <div class="tcolumn min120"
                        v-for="(itemChild,indexChild) in table_data.header"
                        :key="indexChild"
                        :class="{'blue':indexChild===0}">
                        <span v-if="itemChild!=='图片'">{{item[itemChild]}}</span>
                        <span v-if="itemChild==='图片'&&!item[itemChild]">暂无图片</span>
                        <el-image v-if="itemChild==='图片' && item[itemChild]"
                          style="width:80px;height:80px;;padding:10px 0"
                          :src="item[itemChild]">
                        </el-image>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="cardCtn">
        <div class="card">
          <div class="title">
            <span class="left">累计收藏</span>
            <span class="right">查看全部</span>
          </div>
          <div class="content">
            <div class="label">累计收藏
              <i class="el-icon-question"></i>
            </div>
            <div class="number">7.54<em>次</em></div>
            <div class="rate">较昨日<em class="green">新增9%</em></div>
            <div class="otherInfo">
              <div class="text">最近新增</div>
              <div class="line">
                <span class="left">
                  <div class="circle"></div>
                  张三
                </span>
                <span class="right">2020-12-12 09:12</span>
              </div>
              <div class="line">
                <span class="left">
                  <div class="circle"></div>
                  张三
                </span>
                <span class="right">2020-12-12 09:12</span>
              </div>
              <div class="line">
                <span class="left">
                  <div class="circle"></div>
                  张三
                </span>
                <span class="right">2020-12-12 09:12</span>
              </div>
              <div class="line">
                <span class="left">
                  <div class="circle"></div>
                  张三
                </span>
                <span class="right">2020-12-12 09:12</span>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="title">
            <span class="left">产品订单</span>
            <span class="right">查看全部</span>
          </div>
          <div class="content">
            <div class="label">小标题:问号</div>
            <div class="number">7.54<em>次</em></div>
            <div class="rate">较昨日<em class="green">新增9%</em></div>
            <div class="otherInfo">
              <div class="text">最近新增</div>
              <div class="line">
                <span class="left">
                  <div class="circle"></div>
                  张三
                </span>
                <span class="right">2020-12-12 09:12</span>
              </div>
              <div class="line">
                <span class="left">
                  <div class="circle"></div>
                  张三
                </span>
                <span class="right">2020-12-12 09:12</span>
              </div>
              <div class="line">
                <span class="left">
                  <div class="circle"></div>
                  张三
                </span>
                <span class="right">2020-12-12 09:12</span>
              </div>
              <div class="line">
                <span class="left">
                  <div class="circle"></div>
                  张三
                </span>
                <span class="right">2020-12-12 09:12</span>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="title">
            <span class="left">库存数量</span>
            <span class="right">查看全部</span>
          </div>
          <div class="content">
            <div class="label">累计收藏
              <i class="el-icon-question"></i>
            </div>
            <div class="number">7.54<em>次</em></div>
            <div class="rate">较昨日<em class="green">新增9%</em></div>
            <div class="otherInfo">
              <div class="text">最近新增</div>
              <div class="line">
                <span class="left">
                  <div class="circle"></div>
                  张三
                </span>
                <span class="right">2020-12-12 09:12</span>
              </div>
              <div class="line">
                <span class="left">
                  <div class="circle"></div>
                  张三
                </span>
                <span class="right">2020-12-12 09:12</span>
              </div>
              <div class="line">
                <span class="left">
                  <div class="circle"></div>
                  张三
                </span>
                <span class="right">2020-12-12 09:12</span>
              </div>
              <div class="line">
                <span class="left">
                  <div class="circle"></div>
                  张三
                </span>
                <span class="right">2020-12-12 09:12</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnBlue">提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { product } from '@/assets/js/api'
interface SkuInfo {
  sku_id: string | number
  price: number
  store: string
  sku_info: string
  image_url: string
  sku_code?: string
}
interface ProductForm {
  name: string
  category_id: number | string
  category_info: string
  sku_info: SkuInfo[]
  client_id: number | string
  brand_id: number | string
  images: string[]
  description: string
  min_price: number
  max_price: number
  product_code: string
  id?: string | number
  create_time: string
}
export default Vue.extend({
  data(): {
    table_data: { header: any[]; render_content: any[] }
    [propName: string]: any
  } {
    return {
      product_code: '',
      product_name: '',
      product_type: '',
      product_brand: '',
      product_image: [],
      from_client: '',
      create_time: '',
      desc: '',
      render_data: [],
      table_data: {
        header: [], // 存放表头
        render_content: []
      }
    }
  },
  methods: {
    formAdapter(data: ProductForm): void {
      this.product_code = data.product_code
      this.product_name = data.name
      this.desc = data.description
      this.create_time = data.create_time.substring(0, 10)
      this.product_image = data.images
      this.table_data.render_content = data.sku_info.map((item) => {
        const obj = JSON.parse(item.sku_info)
        const sku = 'sku编码'
        obj[sku] = item.sku_code
        return obj
      })

      for (const key of Object.keys(this.table_data.render_content[0])) {
        if (key === 'sku编码') {
          this.table_data.header.unshift(key)
        } else {
          this.table_data.header.push(key)
        }
      }
      console.log(this.table_data.render_content)
    }
  },
  mounted() {
    product.detail({ id: this.$route.params.id }).then((res) => {
      console.log(res.data.data)
      if (res.data.status) {
        this.formAdapter(res.data.data)
      }
    })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/product/detail.less';
</style>