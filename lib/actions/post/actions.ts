"use server"

import { ENDPOINTS } from "../shared/constants"
import type {
  PostInfoReq,
  DeletePostFileReq,
  DeleteVoteReq,
  MePostMediasReq,
  PostMeReq,
  PostFilePlayLogVo,
  PostShareLogVo,
  PostViewReq,
  PostSearchReq,
  PostStarReq,
  UserPostsReq,
  UserVoteReq,
  PostInfoVo
} from "./types"

export async function addPost(params: PostInfoReq): Promise<PostInfoVo> {
  // Implementation
  throw new Error("Not implemented")
}

export async function deletePostFile(params: DeletePostFileReq): Promise<void> {
  // Implementation
  throw new Error("Not implemented")
}

export async function deleteVote(params: DeleteVoteReq): Promise<void> {
  // Implementation
  throw new Error("Not implemented")
}

export async function getMePostMedias(params: MePostMediasReq): Promise<PostInfoVo[]> {
  // Implementation
  throw new Error("Not implemented")
}

export async function getMePosts(params: PostMeReq): Promise<PostInfoVo[]> {
  // Implementation
  throw new Error("Not implemented")
}

export async function addPostFilePlayLog(params: PostFilePlayLogVo): Promise<void> {
  // Implementation
  throw new Error("Not implemented")
}

export async function addPostShareLog(params: PostShareLogVo): Promise<void> {
  // Implementation
  throw new Error("Not implemented")
}

export async function addPostViewLog(params: PostViewReq): Promise<void> {
  // Implementation
  throw new Error("Not implemented")
}

export async function publishPost(params: PostInfoReq): Promise<PostInfoVo> {
  // Implementation
  throw new Error("Not implemented")
}

export async function searchPosts(params: PostSearchReq): Promise<PostInfoVo[]> {
  // Implementation
  throw new Error("Not implemented")
}

export async function starPost(params: PostStarReq): Promise<void> {
  // Implementation
  throw new Error("Not implemented")
}

export async function getUserPosts(params: UserPostsReq): Promise<PostInfoVo[]> {
  // Implementation
  throw new Error("Not implemented")
}

export async function votePost(params: UserVoteReq): Promise<void> {
  // Implementation
  throw new Error("Not implemented")
}

export async function getPost(id: string): Promise<PostInfoVo> {
  // Implementation
  throw new Error("Not implemented")
}
