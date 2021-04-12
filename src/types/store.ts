import { ProductForm, SkuInfo } from './product'
export interface SkuStoreSave {
  sku_code: string
  number: number | string
  stock_id: number | string
  stock_number?: number | string // 出库选择仓库的库存数字段
  type: number | string // 1入库，2出库
  order_id: number | string
  price: number | string
  client_name?: string
  desc: string
  price_type?: 1 | 2 | 3 // 1零售价2线上价3线下价
  priceArr?: Array<{ name: string, price: number }>
}

export interface StoreInfo {
  name: string
  id?: number | string
  type?: number | string
  product_info?: ProductForm
  sku?: SkuInfo
  number?: number | string
  price?: number | string
  client_name?: string
  stock_name?: string
  user_name?: string
  create_time?: string
  checked?: boolean
}
