// Post related types and interfaces
import type { PageInfo } from "../recom/types"

export interface PostInfoReq {
  title?: string
  content: string
  postType: number
  postStatus: number
  fileIds?: string[]
  voteTitle?: string
  voteOptions?: string[]
}

export interface DeletePostFileReq {
  postId: string
  fileId: string
}

export interface DeleteVoteReq {
  postId: string
}

export interface MePostMediasReq extends PageInfo {
  userId: string
}

export interface PostMeReq extends PageInfo {
  userId: string
}

export interface PostFilePlayLogVo {
  postId: string
  fileId: string
  playDuration: number
}

export interface PostShareLogVo {
  postId: string
  shareType: number
}

export interface PostViewReq {
  postId: string
}

export interface PostSearchReq extends PageInfo {
  keyword: string
}

export interface PostStarReq {
  postId: string
  star: boolean
}

export interface UserPostsReq extends PageInfo {
  userId: string
}

export interface UserVoteReq {
  postId: string
  optionId: string
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
  files?: {
    id: string
    url: string
    type: string
    size: number
    width?: number
    height?: number
    duration?: number
  }[]
  vote?: {
    id: string
    title: string
    options: {
      id: string
      content: string
      count: number
    }[]
    totalCount: number
    isVoted: boolean
    myVoteOptionId?: string
  }
}
