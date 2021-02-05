import http from './http'
import { ListParam, DetailParam, DeleteParam } from '@/types/axiosParam'
const baseUrl = '/api'


// 登录
const login = (params: any) => http.post(`${baseUrl}/auth/login`, params, 'application/json')
const getToken = () => http.get(`${baseUrl}/upload/token`)
// 品类设置
import { CategroySave } from '@/types/categroy'
const proType = {
  save: (params: CategroySave) => http.post(`${baseUrl}/category/save`, params, 'application/json'),
  list: (params?: ListParam) => http.get(`${baseUrl}/category/lists`, params),
  delete: (params: DeleteParam) => http.post(`${baseUrl}/category/delete`, params, 'application/json')
}

// 产品
import { ProductSave } from '@/types/product'
const product = {
  save: (params: ProductSave) => http.post(`${baseUrl}/product/save`, params, 'application/json'),
  list: (params: ListParam) => http.get(`${baseUrl}/product/lists`, params),
  detail: (params: DetailParam) => http.get(`${baseUrl}/product/detail`, params),
  deleteSku: (params: DeleteParam) => http.post(`${baseUrl}/product/sku/delete`, params, 'application/json'),
  delete: (params: DeleteParam) => http.post(`${baseUrl}/product/delete`, params, 'application/json'),
  recommendPro: (params: DeleteParam) => http.post(`${baseUrl}/product/recommend`, params, 'application/json'),
  recommand: () => http.get(`${baseUrl}/index/recommend`) // 首页产品推荐
}

// 订单
import { PrintParam } from '@/types/order'
const order = {
  import: (params: any) => http.post(`${baseUrl}/order/import`, params, 'form-data'),
  list: (params: ListParam) => http.get(`${baseUrl}/order/lists`, params),
  delete: (params: DeleteParam) => http.post(`${baseUrl}/order/delete`, params, 'application/json'),
  getPrint: (params: PrintParam) => http.get(`${baseUrl}/order/sku/num`, params)
}

// 库存
import { SkuStoreSave, StoreInfo } from '@/types/store'
const store = {
  list: (params?: ListParam) => http.get(`${baseUrl}/edit/store/lists`, params),
  skuDelete: (params: DeleteParam) => http.post(`${baseUrl}/sku/store/log/delete`, params, 'application/json'),
  skuLog: (params: DetailParam) => http.get(`${baseUrl}/sku/store/logs`, params),
  getLogById: (params: DetailParam) => http.get(`${baseUrl}/sku/store/log/detail`, params),
  storeSave: (params: StoreInfo) => http.post(`${baseUrl}/edit/store/save`, params, 'application/json'),
  skuSave: (params: SkuStoreSave) => http.post(`${baseUrl}/sku/store/save`, params, 'application/json')
}

// 单位
import { ClientInfo } from '@/types/client'
const client = {
  save: (params: ClientInfo) => http.post(`${baseUrl}/edit/client/save`, params, 'application/json'),
  list: (params?: ListParam) => http.get(`${baseUrl}/edit/client/lists`, params)
}

// 用户
import { UserInfo } from '@/types/setting'
const user = {
  save: (params: UserInfo) => http.post(`${baseUrl}/user/save`, params, 'application/json'),
  list: (params?: ListParam) => http.get(`${baseUrl}/user/lists`, params),
  ban: (params: DeleteParam) => http.post(`${baseUrl}/user/check/status`, params, 'application/json'),
  detail: () => http.get(`${baseUrl}/user/info`)
}

// 统计
const statistics = {
  stockNumber: () => http.get(`${baseUrl}/index/order/total`), // 首页库存数据统计
  orderNumber: () => http.get(`${baseUrl}/index/order/number`), // 首页订单数据统计
  dispatchSts: (params: ListParam) => http.get(`${baseUrl}/order/dispatch/lists`, params) // 订单发货统计
}

// 搜索
const serach = {
  mainSearch: (params: { keyword: string }) => http.get(`${baseUrl}/index/search`, params)
}

// 通知
import { NotifyInfo } from '@/types/notify'
const notify = {
  send: (params: NotifyInfo) => http.post(`${baseUrl}/notify/save`, params, 'application/json'),
  list: (params: ListParam) => http.get(`${baseUrl}/notify/lists`, params),
  read: (params: DetailParam) => http.post(`${baseUrl}/notify/read`, params, 'application/json')
}

// 运营商
import { ServiceInfo } from '@/types/setting'
const service = {
  save: (params: ServiceInfo) => http.post(`${baseUrl}/edit/operator/save`, params, 'application/json'),
  list: (params: ListParam) => http.get(`${baseUrl}/edit/operator/lists`, params),
  ban: (params: DeleteParam) => http.post(`${baseUrl}//edit/operator/status/check`, params, 'application/json')
}
export {
  service,
  notify,
  serach,
  statistics,
  user,
  client,
  store,
  order,
  product,
  proType,
  login,
  getToken
}
