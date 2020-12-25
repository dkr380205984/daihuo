export interface OrderInfo {
  address: string
  addressee: string
  addressee_phone: string
  area: string
  city: string
  province: string
  product_name: string | null
  local_product_name: string | null
  presenter: string
  order_code: string
  sku_code: string
  desc: string
  create_user: string
  create_time: string
  sku_info?: string
  id?: string | number
  [propName: string]: any
}

export interface PrintParam {
  client_id: number
  start_time: string
  end_time: string
}
