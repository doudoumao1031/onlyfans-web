// Comment related types and interfaces

import { User } from "@/lib"

export interface CommentReq {
  post_id: number
  content: string
}

export interface CommentReplyReq {
  postId: string
  commentId: string
  content: string
  replyUserId: string
}

export interface CommentUpVo {
  commentId: string
  up: boolean
}

export interface CommentDelReq {
  commentId: string
}

export interface CommentPageReq {
  post_id: number
  from_id: number
  page: number
  page_size: number
}

export interface CommentReplayPageReq {
  commentId: string
  page: number
  limit: number
}

export interface CommentInfo {
  content: string
  id: number
  postId: number
  reply_arr: CommentReplyInfo[]
  replay_count: number
  thumbs_up_count: number
  user: User
}

export interface CommentReplyInfo {
  comment_id: number
  content: string
  id: number
  reply_user: User
  thumbs_up_count: number
  user: User
}
