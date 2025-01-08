"use server"

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

export async function addComment(params: CommentReq): Promise<void> {
  // Implementation
  throw new Error("Not implemented")
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

export async function getPostComments(params: CommentPageReq): Promise<CommentInfo[]> {
  // Implementation
  throw new Error("Not implemented")
}

export async function getCommentReplies(params: CommentReplayPageReq): Promise<CommentReplyInfo[]> {
  // Implementation
  throw new Error("Not implemented")
}
