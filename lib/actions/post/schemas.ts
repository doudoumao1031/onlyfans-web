import { z } from "zod"

export const postInfoReqSchema = z.object({
  title: z.string().optional(),
  content: z.string(),
  postType: z.number(),
  postStatus: z.number(),
  fileIds: z.array(z.string()).optional(),
  voteTitle: z.string().optional(),
  voteOptions: z.array(z.string()).optional()
})

export const deletePostFileReqSchema = z.object({
  postId: z.string(),
  fileId: z.string()
})

export const deleteVoteReqSchema = z.object({
  postId: z.string()
})

export const mePostMediasReqSchema = z.object({
  userId: z.string(),
  page: z.number().min(1),
  limit: z.number().min(1).max(100),
  lastId: z.string().optional()
})

export const postMeReqSchema = z.object({
  userId: z.string(),
  page: z.number().min(1),
  limit: z.number().min(1).max(100),
  lastId: z.string().optional()
})

export const postFilePlayLogSchema = z.object({
  postId: z.string(),
  fileId: z.string(),
  playDuration: z.number().min(0)
})

export const postShareLogSchema = z.object({
  postId: z.string(),
  shareType: z.number()
})

export const postViewReqSchema = z.object({
  postId: z.string()
})

export const postSearchReqSchema = z.object({
  keyword: z.string(),
  page: z.number().min(1),
  limit: z.number().min(1).max(100),
  lastId: z.string().optional()
})

export const postStarReqSchema = z.object({
  postId: z.string(),
  star: z.boolean()
})

export const userPostsReqSchema = z.object({
  userId: z.string(),
  page: z.number().min(1),
  limit: z.number().min(1).max(100),
  lastId: z.string().optional()
})

export const userVoteReqSchema = z.object({
  postId: z.string(),
  optionId: z.string()
})
