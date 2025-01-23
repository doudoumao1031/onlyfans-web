import {
  BloggerInfo,
  PageInfo,
  ENDPOINTS,
  fetchWithPost,
  PageResponse,
  PostData,
  RecomBloggerReq
} from "@/lib"
import type {
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
/**
 * 获取热门贴子
 * @param params 分页参数
 * @returns 热门贴子列表
 */
export const getSystemPosts =
  (params: PageInfo) => fetchWithPost<PageInfo, PageResponse<PostData>>(ENDPOINTS.RECOM.SYSTEM_POST, params)
    .then((res) => {
      if (res && res.code === 0) {
        return res.data
      } else {
        return null
      }
    })

export const fetchFeeds = async (page: number, fromId: number = 0) => {
  const pageSize = 3
  const response = await getSystemPosts({
    from_id: fromId,
    page,
    pageSize: pageSize
  })

  if (!response) {
    return {
      items: [],
      hasMore: false
    }
  }

  const { list, total } = response

  const hasMore = page * pageSize < total
  return {
    items: list,
    hasMore
  }
}