import {
  BloggerInfo, CollectionPostReq, CommonPageReq,
  ENDPOINTS, FansPageReq,
  fetchWithPost,
  PageResponse, PostData, SubscribeUserInfo
} from "@/lib"
import { SearchUserReq, SubscribeSetting, UserReq } from "@/lib/actions/users/types"

/**
 * 搜索用户
 */
export const searchUser =
  (params: SearchUserReq) => fetchWithPost<SearchUserReq, PageResponse<BloggerInfo>>(ENDPOINTS.USERS.SEARCH, params)
    .then((res) => {
      if (res && res.code === 0) {
        return res.data
      } else {
        return null
      }
    })

/**
 * 已收藏博主列表
 */
export const userCollectionUsers =
  (params: CommonPageReq) => fetchWithPost<CommonPageReq, PageResponse<BloggerInfo>>(ENDPOINTS.USERS.COLLECTION_USERS, params)
    .then((res) => {
      if (res && res.code === 0) {
        return res.data
      } else {
        return null
      }
    })
/**
 * 查看用户订阅设置
 */
export const viewUserSubscribeSetting =
  (params: UserReq) => fetchWithPost<UserReq, SubscribeSetting>(ENDPOINTS.USERS.VIEW_SUBSCRIBE_SETTING, params)
    .then((res) => {
      if (res && res.code === 0) {
        return res.data
      } else {
        return null
      }
    })

/**
 * 收藏文章/帖子
 * @param params
 */
export const userCollectionPost =
  (params: CollectionPostReq) => fetchWithPost<CollectionPostReq, unknown>(ENDPOINTS.USERS.COLLECTION_POST, params)
    .then((res) => {
      return !!(res && res.code === 0)
    })

export const userCollectionPosts = (params:CommonPageReq) =>
  fetchWithPost<CommonPageReq,PageResponse<PostData>>(ENDPOINTS.USERS.COLLECTION_POSTS,params)
    .then((response) => {
      return response?.code == 0 ? response?.data : null
    })

/**
 * 订阅博主列表
 * @param params
 */
export const getSubscribeUsers =
  (params: CommonPageReq) => fetchWithPost<CommonPageReq, PageResponse<SubscribeUserInfo>>(ENDPOINTS.USERS.GET_SUBSCRIBE_USERS, params)
    .then((res) => {
      if (res && res.code === 0) {
        return res.data
      } else {
        return null
      }
    })

/**
 * 获取关注我的用户
 * @param params
 */
export const getFollowedUsers = (params: FansPageReq) => fetchWithPost<FansPageReq, PageResponse<SubscribeUserInfo>>(ENDPOINTS.USERS.GET_FOLLOWED_USERS, params).then(response => {
  if (response && response.code === 0) {
    return response.data
  } else {
    return null
  }
})

export const infiniteGetFollowedUsers = async (page:number) => {
  const data = await getFollowedUsers({ page, pageSize: 10, from_id: 0 })
  return {
    items: data?.list || [],
    hasMore: !data?.list ? false : page < Math.ceil(data.total / page)
  }
}

/**
 * 订阅我的用户
 * @param params
 */
export const getSubscribedUsers = (params: FansPageReq) => fetchWithPost<FansPageReq, PageResponse<SubscribeUserInfo>>(ENDPOINTS.USERS.GET_SUBSCRIBED_USERS, params).then(response => {
  if (response && response.code === 0) {
    return response.data
  } else {
    return null
  }
})