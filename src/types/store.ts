export interface SkuStoreSave {
  sku_code: string
  number: number | string
  stock_id: number | string
  type: number | string // 1入库，2出库
  order_id: number | string
  price: number | string
  client_name?: string
  desc: string
}

export interface StoreInfo {
  name: string
  id?: number | string
  type?: number | string
  checked?: boolean
}
