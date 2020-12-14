export interface UserInfo {
  id?: string | number // 修改时候用
  telephone: string
  name: string
  username: string
  type: string // 管理权限
  state?: boolean // 状态
  desc?: string
}
