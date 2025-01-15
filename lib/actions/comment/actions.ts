"use server"

import { ApiResponse, fetchWithPost, PageResponse } from "@/lib"
import { ENDPOINTS } from "../shared/constants"
import type {
  CommentReq,
  CommentReplyReq,
  CommentUpVo,
  CommentDelReq,
  CommentPageReq,
  CommentReplayPageReq,
  CommentInfo,
  CommentReplyInfo
} from "./types"

export async function addComment(params: CommentReq): Promise<boolean> {
  const res = await fetchWithPost<CommentReq, ApiResponse>(ENDPOINTS.COMMENT.ADD, params)
  return !!res && res.code === 0
}

export async function replyComment(params: CommentReplyReq): Promise<void> {
  // Implementation
  throw new Error("Not implemented")
}

export async function upComment(params: CommentUpVo): Promise<void> {
  // Implementation
  throw new Error("Not implemented")
}

export async function deleteComment(params: CommentDelReq): Promise<void> {
  // Implementation
  throw new Error("Not implemented")
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

export async function getCommentReplies(params: CommentReplayPageReq): Promise<CommentReplyInfo[]> {
  // Implementation
  throw new Error("Not implemented")
}
