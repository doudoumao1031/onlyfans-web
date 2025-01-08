// Recom related types and interfaces

export interface PageInfo {
  page: number
  limit: number
  lastId?: string
}

export interface PostInfoVo {
  id: string
  userId: string
  content: string
  title?: string
  postType: number
  postStatus: number
  mediaCount: number
  commentCount: number
  starCount: number
  viewCount: number
  shareCount: number
  createdAt: string
  updatedAt: string
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