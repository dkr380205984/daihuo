export interface UserInfo {
  id?: string | number // 修改时候用
  phone: string
  name: string
  user_name: string
  type: string // 管理权限
  status?: boolean // 状态
  client_id?: string | number // 主播有隶属运营商
  desc?: string
}

export interface TypeForm {
  id?: number | null | string
  name: string
  unit?: string
  is_required?: boolean
  is_combine?: boolean
  commonUse?: any[]
  category_menu?: TypeForm[] | string | undefined
}

export interface ServiceInfo {
  id?: string | number
  phone: string
  name: string
  user_name: string,
  desc: string
}
