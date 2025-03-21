import { UserProfile } from "@/lib/actions/profile"

import { User } from "../users"

/**
 * 分页公共请求
 */
export type PageInfo = {
  from_id: number | 0
  page: number | 1
  pageSize: number | 10
}
export enum BloggerType {
  Hot = 0,
  New = 1,
  Popular = 2
}
export interface RecomBloggerReq extends PageInfo {
  // 0 热门 1 新人 2人气
  type: BloggerType
}

export type FansPageReq = PageInfo & {
  desc?: boolean
  name?: string
}

/**
 * 已订阅博主列表返回结果
 */
export interface SubscribeUserInfo {
  user: User //博主信息
  start_time: number //开始时间
  end_time: number // 结束时间
}

export interface FansFollowItem {
  user: UserProfile
  following_time: number
}

export interface FansSubscribeItems {
  user: UserProfile
  start_time: number
  end_time: number
}

export interface UserInfoVo {
  id: string
  username: string
  name: string
  photoUrl?: string
  bio?: string
  followerCount: number
  postCount: number
  isFollowing: boolean
}

