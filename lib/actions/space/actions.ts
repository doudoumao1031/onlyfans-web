import {
  CommonPageReq,
  ENDPOINTS,
  fetchWithGet,
  fetchWithPost,
  PageResponse,
  PostData
} from "@/lib"
import { UserProfile } from "../profile/types"

//我的帖子
export const getMyFeeds = (params: CommonPageReq) =>
  fetchWithPost<CommonPageReq, PageResponse<PostData>>(ENDPOINTS.POST.ME_POSTS, params).then(
    (res) => {
      if (res && res.code === 0) {
        return res.data
      } else {
        return null
      }
    }
  )
//用户的帖子
export const getUserPosts = (params: CommonPageReq & { user_id?: number }) =>
  fetchWithPost<CommonPageReq & { user_id?: number }, PageResponse<PostData>>(
    ENDPOINTS.POST.USER_POSTS,
    params
  ).then((res) => {
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

//resetPost
export const fetchUserPosts = async (page: number, fromId: number = 0, pageSize: number = 10) => {
  const response = await getUserPosts({
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

//用户信息
export async function getUserById(params: { id?: string; username?: string }) {
  return fetchWithGet<{ user_id?: string; username?: string }, UserProfile>(
    `${ENDPOINTS.USERS.GET_BY_ID}/${params.id}`,
    params
  )
}

/**
 * 用户的媒体
 * @param params
 */
export const userMediaPosts = (params: CommonPageReq & { user_id?: number }) =>
  fetchWithPost<CommonPageReq & { user_id?: number }, PageResponse<PostData>>(
    ENDPOINTS.POST.USER_MEDIAS,
    params
  ).then((response) => {
    if (response?.code === 0) {
      return response.data
    }
    return null
  })
