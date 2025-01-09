import { z } from "zod"

export const commentReqSchema = z.object({
  postId: z.string(),
  content: z.string().min(1),
  replyUserId: z.string().optional()
})

export const commentReplyReqSchema = z.object({
  postId: z.string(),
  commentId: z.string(),
  content: z.string().min(1),
  replyUserId: z.string()
})

export const commentUpSchema = z.object({
  commentId: z.string(),
  up: z.boolean()
})

export const commentDelReqSchema = z.object({
  commentId: z.string()
})

export const commentPageReqSchema = z.object({
  postId: z.string(),
  page: z.number().min(1),
  limit: z.number().min(1).max(100)
})

export const commentReplyPageReqSchema = z.object({
  commentId: z.string(),
  page: z.number().min(1),
  limit: z.number().min(1).max(100)
})
