import { CommonPageReq } from "@/lib"

/**
 * 搜索用户请求
 */
export type SearchUserReq = CommonPageReq & {
  name: string
}

export type UserReq = {
  user_id: number
}

/**
 * 订阅折扣
 */
export type DiscountInfo = {
  discount_end_time: number
  discount_per: number
  discount_price: number
  discount_start_time: number
  discount_status: boolean
  id: number
  month_count: number
  price: number
  user_id: number
}
/**
 * 订阅设置
 */
export type SubscribeSetting = {
  id: number
  user_id: number
  price: number
  items: DiscountInfo[]
}

/**
 * 收藏文章/帖子请求
 */
export interface CollectionPostReq {
  collection: boolean // 0-取消收藏 1-收藏
  post_id: number
  user_id: number
}

export interface User {
  about: string
  back_img: string
  blogger: boolean
  first_name: string
  id: number
  last_name: string
  live_certification: boolean
  location: string
  photo: string
  pt_user_id: number
  status: number
  top_info: string
  username: string
}
