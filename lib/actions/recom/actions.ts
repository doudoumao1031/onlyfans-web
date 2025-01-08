"use server"

import { ENDPOINTS } from "../shared/constants"
import type {
  PageInfo,
  FollowUserPostsResp,
  FollowUserUpdateResp,
  RecomBloggerResp,
  SystemPostResp
} from "./types"

export async function getFollowUserPosts(params: PageInfo): Promise<FollowUserPostsResp> {
  // Implementation
  throw new Error("Not implemented")
}

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