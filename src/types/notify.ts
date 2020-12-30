export interface NotifyInfo {
  type: string
  title: string
  content: HTMLElement
  receive_user: Array<string | number>
  id?: number
  status?: number
}
