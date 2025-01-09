import {
  BloggerInfo,
  CommonPageReq,
  ENDPOINTS,
  fetchWithPost,
  PageResponse,
  PostData,
  RecomBloggerReq
} from "@/lib"
import type {
  PageInfo,
  FollowUserUpdateResp
} from "@/lib"

/**
 * 关注用户帖子
 */
export const getFollowUserPosts =
  (params: PageInfo) => fetchWithPost<PageInfo, PageResponse<PostData>>(ENDPOINTS.RECOM.FOLLOW_USER_POSTS, params)
    .then((res) => {
      if (res && res.code === 0) {
        return res.data
      } else {
        return null
      }
    })
export async function getFollowUserUpdate(): Promise<FollowUserUpdateResp> {
  // Implementation
  throw new Error("Not implemented")
}

/**
 * 推荐博主
 */
export const getRecomBlogger =
  (params: RecomBloggerReq) => fetchWithPost<RecomBloggerReq, PageResponse<BloggerInfo>>(ENDPOINTS.RECOM.RECOM_BLOGGER, params)
    .then((res) => {
      if (res && res.code === 0) {
        return res.data
      } else {
        return null
      }
    })


/**
 * 热门贴子
 */
export const getSystemPosts =
  (params: CommonPageReq) => fetchWithPost<CommonPageReq, PageResponse<PostData>>(ENDPOINTS.RECOM.SYSTEM_POST, params)
    .then((res) => {
      if (res && res.code === 0) {
        return res.data
      } else {
        return null
      }
    })