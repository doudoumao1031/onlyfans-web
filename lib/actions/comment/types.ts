// Comment related types and interfaces

import { User } from "@/lib"

export interface CommentReq {
  post_id: number
  content: string
}

export interface CommentReplyReq {
  comment_id: number
  content: string
  parent_reply_id?: number
}

export interface CommentUpVo {
  comment_id: number
  post_id: number
  comment_type: boolean
}

export interface CommentDelReq {
  id: number
  post_id: number
  comment_type: boolean
}

export interface CommentPageReq {
  post_id: number
  from_id: number
  page: number
  page_size: number
}

export interface CommentReplyPageReq {
  comment_id: number
  from_id: number
  page: number
  pageSize: number
  post_id: number
}

export interface CommentInfo {
  id: number
  comment_id: number
  content: string
  thumbs_up_count: number
  thumb_up: boolean
  user: User
  is_self: boolean
  post_id: number
  reply_arr: CommentReplyInfo[]
  reply_count: number
}

export interface CommentReplyInfo {
  id: number
  comment_id: number
  content: string
  thumbs_up_count: number
  thumb_up: boolean
  reply_user: User
  is_self: boolean
  user: User
}
