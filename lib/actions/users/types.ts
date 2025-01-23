import { PageInfo } from "@/lib"

/**
 * 搜索用户请求
 */
export type SearchUserReq = PageInfo & {
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
  discount_status: boolean //折扣信息状态（false可用｜true不可用）
  id: number
  item_status: boolean  //捆绑信息状态（false可用｜true不可用）
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

/**
 * 钱包信息
 */
export interface WalletInfo {
  id: number
  user_id: number
  amount: number
  freeze: number
  pt_wallet: string
}

/**
 * pt钱包信息返回
 */
export interface PtWalletInfo extends WalletInfo
{
  proportion: string
}

/**
 * 收支明细请求
 */
export interface StatementReq extends PageInfo {
  change_type?: number  // 1 充值 2购买会员 3 打赏 4 帖子付费 5 提现
  start_time?: number
  end_time?: number
}

/**
 * 收支明细返回
 */
export interface StatementResp {
  balance_snapshot: number //资金快照
  change_amount: number // 变动金额
  change_type: number // 1 充值 2购买会员 3 打赏 4 帖子付费 5 提现
  id: number
  reason: string // 变动原因
  user_id: number
  trade_time: number // 交易时间
  trade_status: number // 0 成功 1 审核中 2 失败
}

export interface UserMetricDayReq {
  start?: string
  end?: string
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