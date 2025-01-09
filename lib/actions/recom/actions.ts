"use server"

import { ENDPOINTS, fetchWithPost, PageResponse, PostData } from "@/lib"
import type {
  PageInfo,
  FollowUserPostsResp,
  FollowUserUpdateResp,
  RecomBloggerResp,
  SystemPostResp
} from "@/lib"
import { iPost } from "@/lib/post"
import { CommonPageReq } from "@/lib/data"

/**
 * 关注用户帖子
 */
export const getFollowUserPosts = (data: PageInfo) => fetchWithPost<PageInfo, PageResponse<PostData>>(ENDPOINTS.RECOM.FOLLOW_USER_POSTS, data)

export async function getFollowUserUpdate(): Promise<FollowUserUpdateResp> {
  // Implementation
  throw new Error("Not implemented")
}

export async function getRecomBlogger(params: PageInfo): Promise<RecomBloggerResp> {
  // Implementation
  throw new Error("Not implemented")
}

export async function getSystemPosts(params: PageInfo): Promise<SystemPostResp> {
  // Implementation
  throw new Error("Not implemented")
}