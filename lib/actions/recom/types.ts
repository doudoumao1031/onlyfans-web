import { PostInfoVo } from "@/lib"

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
}

/**
 * 博主信息
 */
export type BloggerInfo = {
  id: number
  pt_user_id: number
  first_name: string
  last_name: string
  username: string
  status: number
  photo: string
  back_img: string
  about: string
  location: string
  live_certification: boolean
  blogger: boolean
  post_count: number
  media_count: number
  video_count: number
  img_count: number
  fans_count: number
  subscribe_count: number
  following_count: number
  collection_post_count: number
  today_add_count: number
  access_count: number
  play_count: number
  sub: boolean // 是否已经订阅
  sub_price: number // 订阅基础价格
  sub_end_time: number
  collection: boolean
  following: boolean
  top_info: string
}

/**
 * 已订阅博主列表返回结果
 */
export interface SubscribeUserInfo {
  user: BloggerInfo //博主信息
  start_time: number //开始时间
  end_time: number // 结束时间
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

export interface UserPostVo {
  user: UserInfoVo
  posts: PostInfoVo[]
}

// Response types
export type FollowUserPostsResp = PostInfoVo[]
export type FollowUserUpdateResp = UserPostVo[]
export type RecomBloggerResp = UserInfoVo[]
export type SystemPostResp = PostInfoVo[]
