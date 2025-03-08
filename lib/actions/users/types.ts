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
  item_status: boolean //捆绑信息状态（false可用｜true不可用）
  month_count: number
  price: number
  user_id: number
}

export type AddBundleDiscount = Pick<DiscountInfo, "month_count" | "price" | "user_id"> & {
  id?: number
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
  collection: boolean
  post_id: number
}

export interface User {
  about: string // 简介
  access_count?: number // 空间访客数量
  back_img: string // 顶部头像
  blogger: boolean // 是否博主
  collection?: boolean // 是否收藏
  collection_post_count?: number // 当前收藏/关注的帖子数量
  fans_count?: number // 粉丝数量
  first_name: string // 昵称
  following?: boolean // 是否关注
  following_count?: number // 关注其他博主的数量
  id: number // 用户ID
  img_count?: number // 图片数量
  last_name: string // 昵称
  live_certification: boolean // 直播认证 0 未认证、1 已认证
  location: string // 位置
  media_count?: number // 媒体数量
  photo: string // 用户头像
  play_count?: number // 帖子/媒体播放数量
  post_count?: number // 帖子数量
  pt_user_id: number // pt用户ID
  status: number // 状态，1正常，2停用
  sub?: boolean // 是否订阅
  sub_price: number
  sub_end_time?: number // 订阅结束时间
  subscribe_count?: number // 订阅数量
  today_add_count?: number // 当日新增帖子数量
  top_info: string // 顶部信息
  username: string // 用户名
  video_count?: number // 媒体数量
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
export interface PtWalletInfo extends WalletInfo {
  proportion: string
}

/**
 * 收支明细请求
 */
export type StatementReq = PageInfo & {
  change_type?: number // 1 充值 2购买会员 3 打赏 4 帖子付费 5 提现
  start_time?: number
  end_time?: number
}
export enum ChangeType {
  RECHARGE = 1,
  BUY_VIP = 2,
  REWARD = 3,
  PAY_POST = 4,
  WITHDRAW = 5
}

export type ChangeTypeDesc = {
  type: number
  desc: string
}

/**
 * 收支明细返回
 */
export interface StatementResp {
  balance_snapshot: number //资金快照
  change_amount: number // 变动金额
  change_type: number // 1 充值 2订阅 3 打赏 4 帖子付费 5 提现
  id: number
  reason: string // 变动原因
  user_id: number
  trade_time: number // 交易时间
  trade_status: number // 0 成功 1 审核中 2 失败
  from_user: string // 交易方
  post_id?: number //帖子id
  user_base_vo?: {
    first_name: string
    id: number
    last_name: number
    photo: number
    pt_user_id: number
    username: string
  }
}

export interface UserMetricDayReq {
  start?: string
  end?: string
}
export interface UserMetricDay {
  access_count: number
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
