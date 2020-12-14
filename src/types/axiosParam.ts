export interface ListParam {
  page: number
  limit: number
  [propName: string]: any
}
export interface DeatailParam {
  id: number | string,
  [propName: string]: any
}
