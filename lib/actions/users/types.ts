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
  discount_status: boolean // 促销开关状态
  item_status: boolean // 捆绑开关状态
  id: number
  month_count: number
  price: number
  user_id: number
}

export type AddBundleDiscount = Pick<DiscountInfo, "month_count" | "price" | "user_id"> & { id?: number }
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

export interface UserMetricDayReq {
  start: string
  end: string
}
export interface UserMetricDay {
  access_count:number
  day: string
  following_all_count: number
  following_count: number
  following_del_count: number
  income: number
  play_count: number
  post_count: number
  subscribe_count: number
  user_id: number
}