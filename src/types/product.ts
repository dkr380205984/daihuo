export interface SkuInfo {
  sku_id: string | number
  price: number
  sku_info: string
  image_url: string
  [propName: string]: any
}

export interface ProductForm {
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
  [propName: string]: any
}

export interface ProductSave {
  name: string
  category_id: number | string
  category_info: string
  sku_info: SkuInfo[]
  client_id: number | string
  brand_id: number | string
  images: string[]
  description: string
}
