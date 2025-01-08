// Post related types and interfaces
import type { PageInfo } from "@/lib"

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

export interface PostData {
  collection: boolean
  star: boolean
  mention_user: User[]
  post: {
    id: number
    title: string
  }
  post_attachment: Attachment[]
  post_metric: {
    collection_count: number
    comment_count: number
    share_count: number
    thumbs_up_count: number
    tip_count: number
  }
  post_vote: Vote
  user: User
  comments: Comment[]
}
export interface Comment {
  content: string
  id: number
  reply_arr?: Comment[]
  reply_count?: number
  thumbs_up_count: number
  user: User
}
export interface Vote {
  items: VoteItem[]
  title: string
  stop_time: number
}
export interface VoteItem {
  content: string
  id: number
  vote_count: number
}
export interface Attachment {
  file_id: string
  file_type: FileType
  thumb_id: string
}

export enum FileType {
  Image = 1,
  Video = 2,
  Other = 3,
}
export interface User {
  back_img: string
  first_name: string
  id: number
  last_name: string
  photo: string
  username: string
}

