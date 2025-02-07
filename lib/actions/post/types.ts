// Post related types and interfaces
import { TPost } from "@/components/post/types"
import { PageInfo, FileType } from "@/lib"
import { User } from "@/lib/actions/users/types"

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

/**
 * 帖子点赞
 */
export interface PostStarReq {
  deleted: boolean //0-点赞 1-点踩
  post_id: number
}

export interface UserPostsReq extends PageInfo {
  userId: string
}

export interface UserVoteReq {
  postId: string
  optionId: string
}

export interface PostData {
  collection: boolean
  star: boolean
  mention_user: User[]
  post: TPost
  post_attachment: Attachment[]
  post_metric: {
    collection_count: number
    comment_count: number
    share_count: number
    thumbs_up_count: number
    tip_count: number
    play_count: number
  }
  user: User
  post_vote: Vote
  comments: Comment[]
  post_price: {
    id: number
    price: number
    user_type: number
    visibility: boolean
  }[]
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

export interface PostId {
  post_id: number
}

/**
 * 搜索帖子请求
 */
export type SearchPostReq = PageInfo & {
  title: string
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
