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
 * Get hot bloggers list
 */
export async function getHotBloggers() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.RECOM.RECOM_BLOGGER}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Token": process.env.NEXT_PUBLIC_TOKEN ?? ""
      },
      body: JSON.stringify({ from_id: 0, page: 1, pageSize: 20, type: 0 }),
      next: {
        tags: ["hot-bloggers"]
      }
    })

    if (!res.ok) throw new Error(`API Error: ${res.status}`)
    const data = await res.json()
    return data?.data?.list || []
  } catch (error) {
    console.error("Error fetching hot bloggers:", error)
    return []
  }
}

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

export const followedList = async (page: number, fromId: number = 0) => {
  const pageSize = 3
  const response = await getFollowUserPosts({
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

  if (!list) {
    return {
      items: [],
      hasMore: false
    }
  }

  const hasMore = page * pageSize < total
  return {
    items: list,
    hasMore
  }
}