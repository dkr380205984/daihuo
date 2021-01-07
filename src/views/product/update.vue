<template>
  <div id="productCreate"
    class="createCtnNoRepeat"
    v-loading="loading">
    <div class="header">
      <div class="title">产品修改</div>
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
            <div class="label must">产品名称：</div>
            <div class="line">
              <div class="eldom">
                <el-input placeholder="请输入产品名称"
                  v-model="product_name"></el-input>
              </div>
            </div>
          </div>
          <div class="lineCtn">
            <div class="label must">产品品类：</div>
            <div class="line">
              <div class="eldom">
                <el-select placeholder="请选择产品品类"
                  v-model="product_type"
                  disabled>
                  <el-option v-for="item in type_list"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="lineCtn">
            <div class="label must">产品类型：</div>
            <div class="line">
              <div class="eldom"
                style="line-height:32px">
                <el-switch v-model="type"
                  active-text="现货"
                  inactive-text="期货">
                </el-switch>
              </div>
            </div>
          </div>
          <div class="lineCtn">
            <div class="label must">来源单位：</div>
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
            <div class="label">图片信息：</div>
            <div class="line">
              <el-upload class="upload"
                action="https://upload.qiniup.com/"
                accept="image/jpeg,image/gif,image/png,image/bmp"
                :before-upload="beforeAvatarUpload"
                :data="post_data"
                :file-list="product_image"
                :on-success="successFile"
                :before-remove="beforeRemove"
                ref="uploada"
                list-type="picture">
                <div class="uploadBtn">
                  <i class="el-icon-upload"></i>
                  <span style="margin-left:8px">点击上传图片</span>
                </div>
                <div slot="tip"
                  class="el-upload__tip">只能上传jpg/png图片文件，且不超过10M</div>
              </el-upload>
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
              content="注意：修改非表格信息会重置表格的单价信息，请务必在填写完其他信息后再填写单价信息"
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
                  <el-autocomplete v-for="(itemChild,indexChild) in item.category_menu"
                    :key="indexChild"
                    class="eldom"
                    :placeholder="'请输入'+itemChild.name"
                    v-model="itemOnce[itemChild.name]"
                    :fetch-suggestions="function(str,callback){querySearch(str,callback,itemChild.commonUse)}"
                    @select="renderTable"
                    @input="$forceUpdate()"
                    @change="renderTable"></el-autocomplete>
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
                    <el-autocomplete :placeholder="'请输入'+item.name"
                      v-model="item.inputValue[indexOnce]"
                      :fetch-suggestions="function(str,callback){querySearch(str,callback,item.commonUse)}"
                      @select="renderTable"
                      @input="$forceUpdate()"
                      @change="renderTable"></el-autocomplete>
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
                <el-autocomplete v-for="(itemChild,indexChild) in item.category_menu"
                  :key="indexChild"
                  class="eldom"
                  :placeholder="'请输入'+itemChild.name"
                  v-model="item.inputValue[itemChild.name]"
                  :fetch-suggestions="function(str,callback){querySearch(str,callback,itemChild.commonUse)}"
                  @select="renderTable"
                  @input="$forceUpdate()"
                  @change="renderTable"></el-autocomplete>
              </div>
              <div class="line"
                v-else>
                <div class="eldom">
                  <el-autocomplete :placeholder="'请输入'+item.name"
                    v-model="item.inputValue"
                    @input="$forceUpdate()"
                    :fetch-suggestions="function(str,callback){querySearch(str,callback,item.commonUse)}"
                    @select="renderTable"
                    @change="renderTable"></el-autocomplete>
                </div>
              </div>
            </template>
          </div>
          <div class="lineCtn">
            <div class="label must">表格信息：</div>
            <div class="line">
              <div class="eldom overHeight">
                <div class="tableCtn">
                  <div class="normalTb">
                    <div class="thead">
                      <div class="trow">
                        <div class="tcolumn min120"
                          v-for="(item,index) in table_data.header"
                          :key="index">{{filterName(item.name)}}</div>
                      </div>
                    </div>
                    <div class="tbody">
                      <div class="trow"
                        v-for="(itemRow,indexRow) in table_data.render_content"
                        :key="indexRow">
                        <div class="tcolumn min120"
                          v-for="(item,index) in table_data.header"
                          :key="index">
                          <span v-if="item.firstName"
                            :style="{'color':item.is_required &&!itemRow[filterName(item.name)]?'#F5222D':''}">{{itemRow[filterName(item.name)] || (item.is_required ?'未填必填项':'非必填')}}</span>
                          <el-input class="elDom"
                            v-if="!item.firstName && item.name!=='图片'"
                            v-model="itemRow[filterName(item.name)]"
                            @input="$forceUpdate()"
                            :placeholder="item.name">
                            <template v-if="item.name==='成本价'||item.name==='零售价'"
                              slot="append">元</template>
                          </el-input>
                          <el-upload v-if="!item.firstName && item.name==='图片'"
                            class="avatar-uploader"
                            action="https://upload.qiniup.com/"
                            accept="image/jpeg,image/gif,image/png,image/bmp"
                            :data="post_data"
                            :show-file-list="false"
                            :on-success="function (res, file) { return handleImgSuccess(res, file, itemRow,item.name)}"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="itemRow[filterName(item.name)]"
                              :src="itemRow[filterName(item.name)]"
                              class="avatar">
                            <i v-else
                              class="el-icon-plus avatar-uploader-icon"></i>
                          </el-upload>
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
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnBlue"
            @click="savePro">修改</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { proType, product, getToken, client } from '@/assets/js/api'
import { SkuInfo, ProductForm } from '@/types/product'
export default Vue.extend({
  data(): {
    table_data: {
      header: any[]
      normal_content: any[]
      mix_content: any[]
      render_content: any[]
      old_render_content: any[]
    }
    [propName: string]: any
  } {
    return {
      loading: true,
      file_arr: [],
      post_data: { token: '' },
      product_name: '',
      type: '',
      product_type: '',
      type_list: [],
      product_brand: '',
      product_image: [],
      brand_list: [],
      product_detail: [],
      from_client: 1,
      client_list: [],
      desc: '',
      render_data: [],
      table_data: {
        header: [], // 存放表头
        normal_content: [], // 存放非组合项
        mix_content: [], // 存放组合项
        render_content: [], // 需要渲染的表格,实时计算
        old_render_content: [] // 保留一份原始数据用于匹配价格，库存，sku信息
      }
    }
  },
  methods: {
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
            name: '零售价'
          },
          {
            is_combine: false,
            is_required: true,
            name: '成本价'
          },
          {
            is_combine: false,
            is_required: true,
            name: '图片'
          }
        ])
        this.table_data.header.unshift({
          firstName: 'sku编码',
          is_combine: false,
          is_required: false,
          name: 'sku编码'
        })
        // 第二步,想办法把render_data的输入信息和table_data联系起来,用key来保存render_data的索引
        // 因为render_data一旦生成,他的数组特性保证了数据顺序不变,所以table_data只需要寻址一次就可以复用这个索引
        // 注意，单价/库存的索引值为-1
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
      this.getOldData()
      this.$forceUpdate()
    },
    // 由于渲染生成表的时候会重置填写项，所以我们将填写项的信息通过匹配旧值的方式匹配回去
    getOldData(justSave?: boolean): void {
      if (justSave === true) {
        this.table_data.old_render_content = this.$clone(this.table_data.render_content)
        return
      }
      this.table_data.render_content.forEach((itemNew) => {
        this.table_data.old_render_content.forEach((itemOld) => {
          let ifEqual = true
          for (const key of Object.keys(itemNew)) {
            if (key !== '成本价' && key !== '零售价' && key !== 'sku编码' && key !== '图片') {
              if (itemNew[key] !== itemOld[key]) {
                ifEqual = false
              }
            }
          }
          if (ifEqual) {
            for (const key of Object.keys(itemNew)) {
              itemNew[key] = itemOld[key]
            }
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
    deleteItem(father: any[], index: number): void {
      father.splice(index, 1)
      this.$forceUpdate()
      this.renderTable()
    },
    formCheck(): boolean {
      let msg: string = ''
      if (!this.product_name) {
        msg = '请输入产品名称'
      } else if (!this.product_type) {
        msg = '请选择产品品类'
      } else if (!this.from_client) {
        msg = '请选择来源单位'
      } else {
        this.render_data.forEach((item: any) => {
          if (item.is_required) {
            const dataType = this.$getDataType(item.inputValue)
            if (dataType === 'String') {
              msg = item.inputValue ? msg : item.name + '未填写'
            } else if (dataType === 'Object') {
              for (const key of Object.keys(item.inputValue)) {
                msg = item.inputValue[key] ? msg : key + '未填写'
              }
            } else if (dataType === 'Array') {
              item.inputValue.forEach((itemChild: any) => {
                const dataTypeChild = this.$getDataType(itemChild)
                if (dataTypeChild === 'String') {
                  msg = itemChild ? msg : item.name + '未填写'
                } else if (dataTypeChild === 'Object') {
                  for (const key of Object.keys(itemChild)) {
                    msg = itemChild[key] ? msg : key + '未填写'
                  }
                } else {
                  msg = '未知错误，请联系工作人员'
                }
              })
            } else {
              msg = '未知错误，请联系工作人员'
            }
          }
        })
        // 修复tslint不允许字符串访问对象的脑瘫设定
        const price = '零售价'
        const costPrice = '成本价'
        this.table_data.render_content.forEach((item: any) => {
          if (!item[price] && Number(item[price] !== 0)) {
            msg = '零售价未填写，零售价可填0'
          }
          if (!item[costPrice] && Number(item[costPrice] !== 0)) {
            msg = '成本价未填写，成本价可填0'
          }
        })
      }
      if (msg) {
        this.$message.error(msg)
        return false
      } else {
        return true
      }
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
        returnArr.push(key + ':' + skuInfoSelf[key])
      })
      return returnArr
    },
    savePro() {
      if (!this.formCheck()) {
        return
      }
      // 修复tslint不允许字符串访问对象的脑瘫设定
      const price = '零售价'
      const costPrice = '成本价'
      const image = '图片'
      const sku = 'sku编码'
      let maxSku = 0
      this.table_data.render_content.forEach((item) => {
        if (item[sku] && Number(item[sku].substring(item[sku].length - 2, item[sku].length)) > maxSku) {
          maxSku = Number(item[sku].substring(item[sku].length - 2, item[sku].length))
        }
      })
      const formData: ProductForm = {
        id: this.$route.params.id,
        name: this.product_name,
        category_id: this.product_type,
        type: this.type ? '现货' : '期货',
        category_info: JSON.stringify(this.render_data), // 备份render_data，在修改页还可以用，不然要根据table_data反刍一个render_data出来，太恶心了
        sku_info: this.table_data.render_content.map(
          (item, index): SkuInfo => {
            return {
              sku_id: item[sku]
                ? item[sku].substring(item[sku].length - 2, item[sku].length)
                : maxSku >= 9
                ? (++maxSku).toString()
                : '0' + ++maxSku,
              price: item[price],
              cost_price: item[costPrice],
              sku_info: JSON.stringify(item),
              image_url: item[image],
              pda_sku_info: this.getSkuName(JSON.stringify(item), JSON.stringify(this.render_data)).join('\n')
            }
          }
        ),
        min_price: this.$clone(this.table_data.render_content).sort(
          (a: any, b: any): any => Number(a[price]) - Number(b[price])
        )[0][price],
        max_price: this.$clone(this.table_data.render_content).sort(
          (a: any, b: any): any => Number(b[price]) - Number(a[price])
        )[0][price],
        client_id: this.from_client || 1,
        brand_id: this.product_brand || 1,
        images: this.product_image.map((item: any) => item.url),
        description: this.desc
      }
      product.save(formData).then((res: any) => {
        if (res.data.status) {
          this.$message.success('修改成功')
          this.$router.push('/product/detail/' + res.data.data)
        }
      })
    },
    handleImgSuccess(res: any, file: any, itemRow: any, name: any) {
      console.log(itemRow, name)
      itemRow[name] = 'https://zhihui.tlkrzf.com/' + res.key
      this.$forceUpdate()
    },
    beforeAvatarUpload(file: any) {
      const fileName = file.name.lastIndexOf('.') // 取到文件名开始到最后一个点的长度
      const fileNameLength = file.name.length // 取到文件名长度
      const fileFormat = file.name.substring(fileName + 1, fileNameLength) // 截
      this.post_data.key = Date.parse(new Date().toString()) + '.' + fileFormat
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isJPG && !isPNG) {
        this.$message.error('图片只能是 JPG/PNG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 10MB!')
        return false
      }
    },
    successFile(response: any, file: any, fileList: any[]) {
      this.product_image.push({ id: null, url: 'https://zhihui.tlkrzf.com/' + response.key })
    },
    beforeRemove(file: any, fileList: any[]) {
      let deleteIndex = 0
      fileList.forEach((item, index) => {
        if (file.response) {
          if (item.response && item.response.key === file.response.key) {
            deleteIndex = index
          }
        } else {
          if (item.url === file.url) {
            deleteIndex = index
          }
        }
      })
      fileList.splice(deleteIndex, 1)
      this.product_image.splice(deleteIndex, 1)
      this.$forceUpdate()
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      // return false 禁用自带的删除功能
      return false
    },
    filterName(name: string[] | string): string {
      if (typeof name === 'string') {
        return name
      } else {
        return name.join(',')
      }
    },
    // 初始化数据
    getInfo(data: ProductForm) {
      this.product_name = data.name
      this.product_type = data.category_id
      this.type = data.type === '现货' ? true : false
      this.product_image = data.images.map((item) => {
        return {
          id: item.id,
          url: item.image_url
        }
      })
      this.render_data = JSON.parse(data.category_info)
      this.renderTable(true)
      this.table_data.render_content = data.sku_info.map((item) => {
        const obj = JSON.parse(item.sku_info)
        const skuCode = 'sku编码'
        obj[skuCode] = item.sku_code
        return obj
      })
      this.table_data.old_render_content = this.$clone(this.table_data.render_content)
    },
    querySearch(str: string, cb: (data: any) => void, commonUse: string[]): void {
      const data = commonUse.map((item) => {
        return {
          value: item
        }
      })
      cb(str ? data.filter(this.createFilter(str)) : data)
    },
    createFilter(queryString: string) {
      return (data: any) => {
        return data.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    }
  },
  mounted() {
    Promise.all([proType.list(), product.detail({ id: this.$route.params.id }), getToken(), client.list()]).then(
      (res) => {
        this.type_list = res[0].data.data
        this.getInfo(res[1].data.data)
        this.post_data.token = res[2].data.data
        this.client_list = res[3].data.data
        this.loading = false
      }
    )
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/product/create.less';
</style>