import { CommonPageReq, ENDPOINTS } from "@/lib"
import {
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
  UserVoteReq, fetchWithPost, PostId, SearchPostReq, PageResponse, PostData
} from "@/lib"
import type { PostInfoVo } from "@/lib"

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

export const starPost = (
  params: PostStarReq
) => fetchWithPost<PostStarReq, unknown>(ENDPOINTS.POST.STAR, params)
  .then((res) => {
    return !!(res && res.code === 0)
  })

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


/**
 * 添加帖子分享记录
 * @param params
 */
export const postSharLog = (
  params: PostId
) => fetchWithPost<PostId, unknown>(ENDPOINTS.POST.SHARE_LOG, params)
  .then((res) => {
    if (res && res.code === 0) {
      return true
    } else {
      return false
    }
  })

/**
 * 搜索帖子
 */
export const searchPost = (
  params: SearchPostReq
) => fetchWithPost<SearchPostReq, PageResponse<PostData>>(ENDPOINTS.POST.SEARCH, params)
  .then((res) => {
    if (res && res.code === 0) {
      return res.data
    } else {
      return null
    }
  })


/**
 * 我的帖子
 * @param params
 */
export const myPosts = (
  params: SearchPostReq
) => fetchWithPost<SearchPostReq, PageResponse<PostData>>(ENDPOINTS.POST.ME_POSTS, params)
  .then((res) => {
    if (res && res.code === 0) {
      return res.data
    }
    return null
  })

/**
 * 待定
 * @param params
 */
export const myMediaPosts = (params:CommonPageReq) => fetchWithPost<CommonPageReq,PageResponse<unknown>>(ENDPOINTS.POST.ME_MEDIAS,params).then(response => {
  if (response?.code === 0) {
    return response.data
  }
  return null
})
