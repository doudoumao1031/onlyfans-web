import {
  User,
  CollectionPostReq,
  PageInfo,
  DiscountInfo,
  ENDPOINTS,
  FansPageReq,
  fetchWithGet,
  fetchWithPost,
  PageResponse,
  PostData,
  SubscribeUserInfo,
  UserMetricDay,
  UserMetricDayReq,
  WalletInfo,
  PtWalletInfo,
  StatementReq,
  StatementResp,
  FansFollowItem,
  FansSubscribeItems, WithdrawOrder
} from "@/lib"
import { SearchUserReq, SubscribeSetting, UserReq } from "@/lib/actions/users/types"

/**
 * 搜索用户
 */
export const searchUser = (params: SearchUserReq) =>
  fetchWithPost<SearchUserReq, PageResponse<User>>(ENDPOINTS.USERS.SEARCH, params).then(
    (res) => {
      if (res && res.code === 0) {
        return res.data
      } else {
        return null
      }
    }
  )

/**
 * 收藏/取消收藏博主
 * @param params
 */
export const collecTionUser = (params: { collection_id: number; collection: boolean }) =>
  fetchWithPost<{ collection_id: number; collection: boolean }, unknown>(
    ENDPOINTS.USERS.COLLECTION_USER,
    params
  ).then((res) => {
    return !!(res && res.code === 0)
  })

/**
 * 已收藏博主列表
 */
export const userCollectionUsers = (params: PageInfo) =>
  fetchWithPost<PageInfo, PageResponse<User>>(ENDPOINTS.USERS.COLLECTION_USERS, params).then(
    (res) => {
      if (res && res.code === 0) {
        return res.data
      } else {
        return null
      }
    }
  )
/**
 * 查看用户订阅设置
 */
export const viewUserSubscribeSetting = (params: UserReq) =>
  fetchWithPost<UserReq, SubscribeSetting>(ENDPOINTS.USERS.VIEW_SUBSCRIBE_SETTING, params).then(
    (res) => {
      if (res && res.code === 0) {
        return res.data
      } else {
        return null
      }
    }
  )

export const getSubscribeSetting = () =>
  fetchWithGet<unknown, SubscribeSetting>(ENDPOINTS.USERS.GET_SUBSCRIBE_SETTING, {}).then(
    (response) => {
      if (response?.code === 0) {
        return response.data
      }
      return null
    }
  )

export const updateSubscribeSettingItem = (params: Partial<DiscountInfo>) =>
  fetchWithPost<Partial<DiscountInfo>, unknown>(ENDPOINTS.USERS.ADD_SUBSCRIBE_SETTING_ITEM, {
    ...params,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    discount_price: String(params.discount_price)
  }).then((response) => {
    if (response?.code === 0) {
      return response.data
    }
    return null
  })

export const addSubscribeSetting = (params: { price: number | string; id?: number }) =>
  fetchWithPost<{
    price: number | string
    id?: number
  }>(ENDPOINTS.USERS.ADD_SUBSCRIBE_SETTING, params).then((response) => {
    if (response?.code === 0) {
      return response.data
    }
    return null
  })

/**
 * 收藏文章/帖子
 * @param params
 */
export const userCollectionPost = async (params: CollectionPostReq) => {
  const result = await fetchWithPost<CollectionPostReq, unknown>(ENDPOINTS.USERS.COLLECTION_POST, params)
  return !!(result && result.code === 0)
}

export const userCollectionPosts = (params: PageInfo) =>
  fetchWithPost<PageInfo, PageResponse<PostData>>(ENDPOINTS.USERS.COLLECTION_POSTS, params).then(
    (response) => {
      return response?.code == 0 ? response?.data : null
    }
  )

/**
 * 订阅博主列表
 * @param params
 */
export const getSubscribeUsers = (params: PageInfo) =>
  fetchWithPost<PageInfo, PageResponse<SubscribeUserInfo>>(
    ENDPOINTS.USERS.GET_SUBSCRIBE_USERS,
    params
  ).then((res) => {
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
export const getFollowedUsers = (params: FansPageReq) =>
  fetchWithPost<FansPageReq, PageResponse<FansFollowItem>>(
    ENDPOINTS.USERS.GET_FOLLOWED_USERS,
    params
  ).then((response) => {
    if (response && response.code === 0) {
      return response.data
    } else {
      return null
    }
  })

/**
 * 订阅我的用户
 * @param params
 */
export const getSubscribedUsers = (params: FansPageReq) =>
  fetchWithPost<FansPageReq, PageResponse<FansSubscribeItems>>(
    ENDPOINTS.USERS.GET_SUBSCRIBED_USERS,
    params
  ).then((response) => {
    if (response && response.code === 0) {
      return response.data
    } else {
      return null
    }
  })

/**
 * 获取钱包信息
 */
export async function userWallet() {
  return fetchWithPost<undefined, WalletInfo>(ENDPOINTS.USERS.WALLET, undefined)
}

/**
 * 获取pt钱包信息（充值时使用）
 */
export async function userPtWallet() {
  return fetchWithPost<undefined, PtWalletInfo>(ENDPOINTS.USERS.PT_WALLET, undefined)
}

/**
 * 收支明细
 */
export const userStatement = (params: StatementReq) =>
  fetchWithPost<StatementReq, PageResponse<StatementResp>>(ENDPOINTS.USERS.STATEMENT, params).then(
    (res) => {
      if (res && res.code === 0) {
        return res.data
      } else {
        return null
      }
    }
  )

/**
 * 提现记录
 */
export const userWalletDownOrder = (params: StatementReq) =>
  fetchWithPost<StatementReq, PageResponse<WithdrawOrder>>(ENDPOINTS.USERS.WALLET_DOWN_ORDER, params).then(
    (res) => {
      if (res && res.code === 0) {
        return res.data
      } else {
        return null
      }
    }
  )

//支出记录
export const getExpenses = (params: PageInfo & { start_time?: number; end_time?: number }) =>
  fetchWithPost<PageInfo, PageResponse<StatementResp>>(ENDPOINTS.USERS.PAT_STATEMENT, params).then(
    (res) => {
      if (res && res.code === 0) {
        return res.data
      } else {
        return null
      }
    }
  )

//收益明细
export const getWalletStatement = (params: PageInfo & { start_time?: number; end_time?: number }) =>
  fetchWithPost<PageInfo, PageResponse<StatementResp>>(ENDPOINTS.USERS.WALLET_STATEMENT, params).then(
    (res) => {
      if (res && res.code === 0) {
        return res.data
      } else {
        return null
      }
    }
  )

/**
 * 成为博主
 */
export async function userApplyBlogger() {
  return fetchWithPost(ENDPOINTS.USERS.APPLY_BLOGGER, undefined)
}

export const getUserMetricDay = (params: UserMetricDayReq) =>
  fetchWithPost<UserMetricDayReq, PageResponse<UserMetricDay>>(
    ENDPOINTS.USERS.STAT_DAY_METRIC,
    params
  ).then((response) => {
    return response?.code === 0 ? response.data : null
  })

export const getUserStatIncome = (params: UserMetricDayReq) =>
  fetchWithPost<UserMetricDayReq, number>(ENDPOINTS.USERS.STAT_INCOME, params).then((response) =>
    response?.code === 0 ? response.data : null
  )

/**
 * 保存用户空间浏览记录
 * @param blogger_id
 */
export const addSpaceLog = (blogger_id: number) =>
  fetchWithPost(ENDPOINTS.USERS.VIEW_LOG, { blogger_id })
