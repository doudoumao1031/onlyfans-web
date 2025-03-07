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
  comment_time: number
  content: string
  id: number
  is_self: boolean
  post_id: number
  reply_arr: CommentReplyInfo[]
  reply_count: number
  thumb_down: boolean
  thumb_up: boolean
  thumbs_up_count: number
  user: User
}

export interface CommentReplyInfo {
  comment_time: number
  comment_id: number
  content: string
  id: number
  is_self: boolean
  reply_user: User
  thumb_down: boolean
  thumb_up: boolean
  thumbs_up_count: number
  user: User
}
