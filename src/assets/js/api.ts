import http from './http'
const baseUrl = '/api'

// 列表公共信息
interface ListParam {
  page?: number
  limit?: number
  [propName: string]: any
}

// 登录
const login = (params: any) => http.post(`${baseUrl}/auth/login`, params, 'application/json')

// 品类设置
interface CategroySave {
  id: number | null,
  name: string,
  category_menu: string | undefined
}
const proType = {
  save: (params: CategroySave) => http.post(`${baseUrl}/category/save`, params, 'application/json'),
  list: (params?: ListParam) => http.get(`${baseUrl}/category/lists`, params)
}

// 产品
interface SkuInfo {
  sku_id: string | number
  price: number | string
  store: string | string
  sku_info: string
  image_url: string
}
interface ProductSave {
  name: string
  category_id: number | string
  category_info: string
  sku_info: SkuInfo[]
  client_id: number | string
  brand_id: number | string
  images: string[]
  description: string
}
const product = {
  save: (params: ProductSave) => http.post(`${baseUrl}/product/save`, params, 'application/json')
}
export {
  product,
  proType,
  login
}
