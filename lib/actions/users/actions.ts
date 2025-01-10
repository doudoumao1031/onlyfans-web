import {
  BloggerInfo, CommonPageReq,
  ENDPOINTS,
  fetchWithPost,
  PageResponse
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
 * 已订阅博主列表
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