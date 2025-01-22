import { PageInfo, ENDPOINTS, fetchWithPost, PageResponse, PostData } from "@/lib"

//我的帖子
export const getMyFeeds = (params: PageInfo) =>
  fetchWithPost<PageInfo, PageResponse<PostData>>(ENDPOINTS.POST.ME_POSTS, params).then(
    (res) => {
      if (res && res.code === 0) {
        return res.data
      } else {
        return null
      }
    }
  )

//resetPost
export const fetchMyPosts = async (page: number, fromId: number = 0, pageSize: number = 10) => {
  const response = await getMyFeeds({
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

//关注博主
export async function userFollowing(params: { follow_id: number; following_type: number }) {
  return fetchWithPost<{ follow_id: number; following_type: number }, undefined>(
    ENDPOINTS.USERS.FOLLOWING,
    params
  )
}
//取消关注
export async function userDelFollowing(params: { follow_id: number; following_type: number }) {
  return fetchWithPost<{ follow_id: number; following_type: number }, undefined>(
    ENDPOINTS.USERS.DELETE_FOLLOWING,
    params
  )
}
