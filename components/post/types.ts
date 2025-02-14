export interface Vote {
  items: VoteItem[]
  title: string
  stop_time: number
  mu_select: boolean
}
export interface VoteItem {
  content: string
  id: number
  select: boolean
  vote_count: number
}

export interface VoteParams {
  item_ids: number[]
  post_id: number
}

export interface Attachment {
  file_id: string
  file_type: FileType
  thumb_id: string
}

export enum FileType {
  Image = 1,
  Video = 2,
  Other = 3
}

export type TPost = {
  id: number //id
  notice: boolean //是否发送通知
  post_status: number //发布状态 0 草稿状态 1发布 2审核中 3未通过
  pub_time: number //发布时间
  title: string //主题
  visibility: number //可见性: 0 可浏览 1 订阅可浏览 2支付可浏览
  last_update_time: number
}
