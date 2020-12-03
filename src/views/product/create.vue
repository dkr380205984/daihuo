<template>
  <div id="productCreate"
    class="createCtnNoRepeat">
    <div class="header">
      <div class="title">产品添加</div>
    </div>
    <div class="moduleCtn">
      <div class="module">
        <div class="titleCtn">
          <div class="title">产品基本信息
            <el-tooltip class="item"
              effect="dark"
              content="注意：带红色*号标记的都为必填项"
              placement="top">
              <i style="color:#ccc"
                class="el-icon-question"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="contentCtn">
          <div class="lineCtn">
            <div class="label must">产品编号：</div>
            <div class="line">
              <div class="eldom">
                <el-input disabled
                  placeholder="产品编号系统生成规则：供货商前缀字母+年份后两位+系统生成编号"
                  v-model="product_code"></el-input>
              </div>
            </div>
          </div>
          <div class="lineCtn">
            <div class="label must">产品名称：</div>
            <div class="line">
              <div class="eldom">
                <el-input placeholder="请输入产品名称"
                  v-model="product_name"></el-input>
              </div>
            </div>
          </div>
          <div class="lineCtn">
            <div class="label">产品品类：</div>
            <div class="line">
              <div class="eldom">
                <el-select placeholder="请选择产品品类"
                  v-model="product_type"
                  @change="renderDom">
                  <el-option v-for="item in type_list"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="lineCtn">
            <div class="label">来源单位：</div>
            <div class="line">
              <div class="eldom">
                <el-select placeholder="请选择来源单位"
                  v-model="from_client">
                  <el-option v-for="item in client_list"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="lineCtn">
            <div class="label">产品品牌：</div>
            <div class="line">
              <div class="eldom">
                <el-input placeholder="请输入产品品牌"
                  v-model="product_brand"></el-input>
              </div>
            </div>
          </div>
          <div class="lineCtn">
            <div class="label">其他信息：</div>
            <div class="line">
              <div class="eldom overHeight">
                <el-input type="textarea"
                  placeholder="请输入内容"
                  v-model="desc">
                </el-input>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="moduleCtn"
      v-if="product_type">
      <div class="module">
        <div class="titleCtn">
          <div class="title">详细信息
            <el-tooltip class="item"
              effect="dark"
              content="注意：修改非表格信息会重置表格的单价、库存信息，请务必在填写完其他信息后再填写单价和库存信息"
              placement="top">
              <i style="color:#ccc"
                class="el-icon-question"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="contentCtn">
          <div class="lineCtn"
            v-for="(item,index) in render_data"
            :key="index">
            <div class="label"
              :class="{'must':item.is_required}">{{item.name}}：</div>
            <!-- 组合项 -->
            <template v-if="item.is_combine">
              <div v-for="(itemOnce,indexOnce) in item.inputValue"
                :key="indexOnce">
                <div class="line oneLine"
                  v-if="item.category_menu.length>0">
                  <el-input v-for="(itemChild,indexChild) in item.category_menu"
                    :key="indexChild"
                    class="eldom"
                    :placeholder="'请输入'+itemChild.name"
                    v-model="itemOnce[itemChild.name]"
                    @input="$forceUpdate()"
                    @change="renderTable"></el-input>
                  <div class="oprBtn add"
                    v-if="indexOnce===0"
                    @click="addItem(item.inputValue,$clone(item.keyArr))">
                    <i class="el-icon-plus"></i>
                  </div>
                  <div class="oprBtn delete"
                    v-if="indexOnce>0"
                    @click="deleteItem(item.inputValue,indexOnce)">
                    <i class="el-icon-minus"></i>
                  </div>
                </div>
                <div class="line"
                  v-else>
                  <div class="eldom">
                    <el-input :placeholder="'请输入'+item.name"
                      v-model="item.inputValue[indexOnce]"
                      @input="$forceUpdate()"
                      @change="renderTable"></el-input>
                    <div class="oprBtn add"
                      v-if="indexOnce===0"
                      @click="addItem(item.inputValue,'')">
                      <i class="el-icon-plus"></i>
                    </div>
                    <div class="oprBtn delete"
                      v-if="indexOnce>0"
                      @click="deleteItem(item.inputValue,indexOnce)">
                      <i class="el-icon-minus"></i>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <!-- 非组合项 -->
            <template v-else>
              <div class="line oneLine"
                v-if="item.category_menu.length>0">
                <el-input v-for="(itemChild,indexChild) in item.category_menu"
                  :key="indexChild"
                  class="eldom"
                  :placeholder="'请输入'+itemChild.name"
                  v-model="item.inputValue[itemChild.name]"
                  @input="$forceUpdate()"
                  @change="renderTable"></el-input>
              </div>
              <div class="line"
                v-else>
                <div class="eldom">
                  <el-input :placeholder="'请输入'+item.name"
                    v-model="item.inputValue"
                    @input="$forceUpdate()"
                    @change="renderTable"></el-input>
                </div>
              </div>
            </template>
          </div>
          <div class="lineCtn">
            <div class="label must">表格信息：</div>
            <div class="line">
              <div class="eldom overHeight">
                <div class="normalTb">
                  <div class="thead">
                    <div class="trow">
                      <div class="tcolumn"
                        v-for="(item,index) in table_data.header"
                        :key="index">{{filterName(item.name)}}</div>
                    </div>
                  </div>
                  <div class="tbody">
                    <div class="trow"
                      v-for="(itemRow,indexRow) in table_data.render_content"
                      :key="indexRow">
                      <div class="tcolumn"
                        v-for="(item,index) in table_data.header"
                        :key="index">
                        <span v-if="item.firstName"
                          :style="{'color':item.is_required &&!itemRow[filterName(item.name)]?'#F5222D':''}">{{itemRow[filterName(item.name)] || (item.is_required ?'未填必填项':'非必填')}}</span>
                        <el-input class="elDom"
                          v-if="!item.firstName"
                          v-model="itemRow[filterName(item.name)]"
                          @input="$forceUpdate()"
                          :placeholder="item.name">
                        </el-input>
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
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnBlue"
            @click="savePro">提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { proType, product } from '@/assets/js/api'
interface SkuInfo {
  sku_id: string | number
  price: number
  store: string
  sku_info: string
  image_url: string
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
}
export default Vue.extend({
  data(): {
    table_data: { header: any[]; normal_content: any[]; mix_content: any[]; render_content: any[] }
    [propName: string]: any
  } {
    return {
      product_code: '',
      product_name: '',
      product_type: '',
      type_list: [],
      product_brand: '',
      product_image: [],
      brand_list: [],
      product_detail: [],
      from_client: '',
      client_list: [],
      desc: '',
      render_data: [],
      table_data: {
        header: [], // 存放表头
        normal_content: [], // 存放非组合项
        mix_content: [], // 存放组合项
        render_content: [] // 需要渲染的表格,实时计算
      }
    }
  },
  methods: {
    // 选取品类初始化数据
    renderDom(id: number): void {
      const finded: any = this.type_list.find((itemFind: { id: number; category_menu: string }) => itemFind.id === id)
      this.render_data = JSON.parse(finded.category_menu)
      this.render_data.forEach((item: any) => {
        if (item.is_combine) {
          if (item.category_menu.length > 0) {
            item.keyArr = {}
            item.inputValue = []
            const arr: any[] = []
            item.category_menu.forEach((itemChild: any) => {
              arr.push(itemChild.name)
            })
            arr.forEach((itemKey: string) => {
              item.keyArr[itemKey] = ''
            })
            item.inputValue.push(this.$clone(item.keyArr))
          } else {
            item.inputValue = ['']
          }
        } else {
          if (item.category_menu.length > 0) {
            item.keyArr = []
            item.inputValue = {}
            item.category_menu.forEach((itemChild: any) => {
              item.keyArr.push(itemChild.name)
            })
            item.keyArr.forEach((itemKey: string) => {
              item.inputValue[itemKey] = ''
            })
          } else {
            item.inputValue = ''
          }
        }
      })
      // 基础数据整理完毕,开始渲染表格
      this.renderTable(true)
    },
    renderTable(first?: boolean): void {
      if (first === true) {
        // 第一步,把表格标题找出来,并确定组合项,必填项
        this.render_data.forEach(
          (item: { category_menu: any[]; name: string; is_combine: boolean; is_required: boolean }) => {
            if (item.category_menu.length > 0) {
              this.table_data.header.push({
                is_combine: item.is_combine,
                is_required: item.is_required,
                name: item.category_menu.map((itemChild) => itemChild.name),
                firstName: item.name
              })
            } else {
              this.table_data.header.push({
                is_combine: item.is_combine,
                is_required: item.is_required,
                name: item.name,
                firstName: item.name
              })
            }
          }
        )
        this.table_data.header = this.table_data.header.concat([
          {
            is_combine: false,
            is_required: true,
            name: '单价'
          },
          {
            is_combine: false,
            is_required: true,
            name: '库存数'
          },
          {
            is_combine: false,
            is_required: true,
            name: '图片'
          }
        ])
        // 第二步,想办法把render_data的输入信息和table_data联系起来,用key来保存render_data的索引
        // 因为render_data一旦生成,他的数组特性保证了数据顺序不变,所以table_data只需要寻址一次就可以复用这个索引
        // 注意，单价/库存/sku编码信息的索引值为-1
        this.table_data.mix_content = this.table_data.header
          .filter((item) => item.is_combine)
          .map((item) => {
            return {
              is_required: item.is_required,
              name: item.name,
              render_index: this.render_data.findIndex((itemFind: { name: any }) => itemFind.name === item.firstName)
            }
          })
        this.table_data.normal_content = this.table_data.header
          .filter((item) => !item.is_combine)
          .map((item) => {
            return {
              is_required: item.is_required,
              name: item.name,
              render_index: this.render_data.findIndex((itemFind: { name: any }) => itemFind.name === item.firstName)
            }
          })
      }
      // 第三步，根据表头，把表格搞出来
      this.table_data.render_content = this.table_data.mix_content.reduce((totalMix: any[], currentMix: any) => {
        const multArr: any[] = []
        const currentArr: any[] = []
        const valueArr = this.render_data[currentMix.render_index].inputValue
        valueArr.forEach((itemValue: any) => {
          if (typeof itemValue === 'string') {
            currentArr.push({
              [currentMix.name]: itemValue
            })
          } else {
            let str: string = ''
            for (const key of Object.keys(itemValue)) {
              str += itemValue[key] ? itemValue[key] + ',' : ''
            }
            str = str.length > 0 ? str.substring(0, str.length - 1) : ''
            currentArr.push({
              [currentMix.name]: str
            })
          }
        })
        if (totalMix.length === 0) {
          return currentArr
        } else {
          totalMix.forEach((itemTotal) => {
            currentArr.forEach((itemCurrent) => {
              multArr.push(this.combineObject(itemTotal, itemCurrent))
            })
          })
          return multArr
        }
      }, [])
      this.table_data.normal_content.forEach((item) => {
        this.table_data.render_content.forEach((itemRender) => {
          if (item.render_index !== -1) {
            if (typeof item.name === 'string') {
              itemRender[item.name] = this.render_data[item.render_index].inputValue
            } else {
              let str: string = ''
              for (const key of Object.keys(this.render_data[item.render_index].inputValue)) {
                str += this.render_data[item.render_index].inputValue[key]
                  ? this.render_data[item.render_index].inputValue[key] + ','
                  : ''
              }
              str = str.length > 0 ? str.substring(0, str.length - 1) : ''
              itemRender[item.name.join(',')] = str
            }
          } else {
            itemRender[item.name] = ''
          }
        })
      })
    },
    combineObject(obj1: any, obj2: any): any {
      const newObj1 = this.$clone(obj1)
      const newObj2 = this.$clone(obj2)
      for (const key in newObj2) {
        if (newObj2.hasOwnProperty(key) === true) {
          newObj1[key] = newObj2[key]
        }
      }
      return newObj1
    },
    addItem(father: any[], son: any): void {
      father.push(son)
      this.$forceUpdate()
      this.renderTable()
    },
    deleteItem(father: any[], index: number) {
      father.splice(index, 1)
      this.$forceUpdate()
      this.renderTable()
    },
    savePro() {
      console.log(this.render_data)
      console.log(this.table_data)
      const formData: ProductForm = {
        name: this.product_name,
        category_id: this.product_type,
        category_info: JSON.stringify(this.render_data), // 备份render_data，在修改页还可以用，不然要根据table_data反刍一个render_data出来，太恶心了
        sku_info: this.table_data.render_content.map(
          (item, index): SkuInfo => {
            // 修复tslint不允许字符串访问对象的脑瘫设定
            const price = '单价'
            const stroe = '库存数'
            return {
              sku_id: index >= 9 ? index + 1 : '0' + (index + 1),
              price: item[price],
              store: item[stroe],
              sku_info: JSON.stringify(item),
              image_url: ''
            }
          }
        ),
        client_id: this.from_client || 1,
        brand_id: this.product_brand || 1,
        images: [],
        description: this.desc
      }
      console.log(formData)
      product.save(formData).then((res: any) => {
        if (res.data.status) {
          this.$message.success('添加成功')
        }
      })
    },
    filterName(name: string[] | string): string {
      if (typeof name === 'string') {
        return name
      } else {
        return name.join(',')
      }
    }
  },
  mounted() {
    proType.list().then((res) => {
      this.type_list = res.data.data
    })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/product/create.less';
</style>