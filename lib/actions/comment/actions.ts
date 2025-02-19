"use server"

import { ApiResponse, fetchWithPost, PageResponse } from "@/lib"
import { ENDPOINTS } from "../shared/constants"
import type {
  CommentReq,
  CommentReplyReq,
  CommentUpVo,
  CommentDelReq,
  CommentPageReq,
  CommentReplyPageReq,
  CommentInfo,
  CommentReplyInfo
} from "./types"

export async function addComment(params: CommentReq): Promise<boolean> {
  const res = await fetchWithPost<CommentReq, ApiResponse>(ENDPOINTS.COMMENT.ADD, params)
  return !!res && res.code === 0
}

export async function replyComment(params: CommentReplyReq): Promise<boolean> {
  const res = await fetchWithPost<CommentReplyReq, ApiResponse>(ENDPOINTS.COMMENT.REPLY, params)
  return !!res && res.code === 0
}

export async function upComment(params: CommentUpVo): Promise<boolean> {
  const res = await fetchWithPost<CommentUpVo, ApiResponse>(ENDPOINTS.COMMENT.UP, params)
  return !!res && res.code === 0
}

export async function deleteComment(params: CommentDelReq): Promise<boolean> {
  const res = await fetchWithPost<CommentDelReq, ApiResponse>(ENDPOINTS.COMMENT.DELETE, params)
  return !!res && res.code === 0
}

export async function getPostComments(params: CommentPageReq) {
  const res = await fetchWithPost<CommentPageReq, PageResponse<CommentInfo>>(
    ENDPOINTS.COMMENT.GET_COMMENTS,
    params
  )
  return res && res.code === 0 ? res.data : null
}

export async function fetchPostComments(post_id: number) {
  const res = await getPostComments({
    post_id,
    from_id: 0,
    page: 1,
    page_size: 100
  })

  return res?.list || []
}

export async function getCommentReplies(params: CommentReplyPageReq) {
  const res = await fetchWithPost<CommentReplyPageReq, PageResponse<CommentReplyInfo>>(
    ENDPOINTS.COMMENT.GET_REPLIES,
    params
  )
  return res && res.code === 0 ? res.data : null
}

export async function fetchCommentReplies(comment_id: number, post_id: number) {
  const res = await getCommentReplies({
    post_id,
    comment_id,
    from_id: 0,
    page: 1,
    pageSize: 100
  })

  return res?.list || []
}
