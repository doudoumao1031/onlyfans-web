// Recom related types and interfaces
import { PostInfoVo } from "../shared/types"

export interface PageInfo {
  from_id: number | 0
  page: number | 1
  pageSize: number | 10
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