import { CommonPageReq, ENDPOINTS, fetchWithGet, fetchWithPost, PageResponse, PostData } from "@/lib"
import { TFeeListItem } from "./types"

//我的帖子
export const getMyFeeds = (params: CommonPageReq) => fetchWithPost<CommonPageReq, PageResponse<PostData>>(ENDPOINTS.POST.ME_POSTS, params).then((res) => {
  if (res && res.code === 0) {
    return res.data
  } else {
    return null
  }
})

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