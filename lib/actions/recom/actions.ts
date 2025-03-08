import {
  BloggerInfo,
  PageInfo,
  ENDPOINTS,
  fetchWithPost,
  PageResponse,
  PostData,
  RecomBloggerReq,
  BloggerType
} from "@/lib"

/**
 * 推荐博主-热门推荐
 */
export async function getHotBloggers(params: RecomBloggerReq) {
  try {
    if (params.type !== BloggerType.Hot) {
      throw new Error(`Type Must Be ${BloggerType.Hot}`)
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.RECOM.RECOM_BLOGGER}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Token": process.env.NEXT_PUBLIC_TOKEN ?? ""
      },
      body: JSON.stringify(params),
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
 * 推荐博主-新人推荐
 */
export async function getNewBloggers(params: RecomBloggerReq) {
  try {
    if (params.type !== BloggerType.New) {
      throw new Error(`Type Must Be ${BloggerType.New}`)
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.RECOM.RECOM_BLOGGER}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Token": process.env.NEXT_PUBLIC_TOKEN ?? ""
      },
      body: JSON.stringify(params),
      next: {
        tags: ["new-bloggers"]
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
 * 推荐博主-人气博主
 */
export async function getPopularBloggers(params: RecomBloggerReq) {
  try {
    if (params.type !== BloggerType.Popular) {
      throw new Error(`Type Must Be ${BloggerType.Popular}`)
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.RECOM.RECOM_BLOGGER}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Token": process.env.NEXT_PUBLIC_TOKEN ?? ""
      },
      body: JSON.stringify(params),
      next: {
        tags: ["popular-bloggers"]
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
export const getFollowUserPosts = (params: PageInfo) =>
  fetchWithPost<PageInfo, PageResponse<PostData>>(ENDPOINTS.RECOM.FOLLOW_USER_POSTS, params).then(
    (res) => {
      if (res && res.code === 0) {
        return res.data
      } else {
        return null
      }
    }
  )

/**
 * 推荐博主
 */
export const getRecomBlogger = (params: RecomBloggerReq) =>
  fetchWithPost<RecomBloggerReq, PageResponse<BloggerInfo>>(
    ENDPOINTS.RECOM.RECOM_BLOGGER,
    params
  ).then((res) => {
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
export const getSystemPosts = (params: PageInfo) =>
  fetchWithPost<PageInfo, PageResponse<PostData>>(ENDPOINTS.RECOM.SYSTEM_POST, params).then(
    (res) => {
      if (res && res.code === 0) {
        return res.data
      } else {
        return null
      }
    }
  )

// export const fetchFeeds = async (page: number, fromId: number = 0) => {
//   const pageSize = 3
//   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.RECOM.SYSTEM_POST}`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "X-Token": process.env.NEXT_PUBLIC_TOKEN ?? ""
//     },
//     body: JSON.stringify({
//       from_id: fromId,
//       page,
//       pageSize
//     }),
//     next: {
//       tags: ["explore-feeds"]
//     }
//   })
//   if (!response || !response.ok) {
//     return {
//       items: [],
//       hasMore: false
//     }
//   }
//   const data = await response.json()
//   const { list, total } = data?.data || { list: [], total: 0 }
//   const hasMore = page * pageSize < total
//   return {
//     items: list,
//     hasMore
//   }
// }

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
