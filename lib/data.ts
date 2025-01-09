import { getMockPostData } from "@/components/post/mock"
import { PostData } from "@/components/post/type"
// import {HttpsProxyAgent} from 'https-proxy-agent';
// import fetch, { RequestInit } from 'node-fetch';
import { BloggerInfo } from "@/lib/struct"

export async function fetchFeeds(currentPage: number) {
  // Add artificial latency
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock data generation
  const mockItems: PostData[] = Array(5)
    .fill(null)
    .map(() => getMockPostData())

  return {
    items: mockItems,
    hasMore: currentPage < 6 // Mock 6 pages of content
  }
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL
// const proxyUrl = process.env.NEXT_PROXY_URL || "http://127.0.0.1:8889";
export type PostResult<T> = {
    code: number,
    data: T,
    message: string,
}

/**
 * 分页公共请求
 */
export type CommonPageReq = {
  from_id: number | 0
  page: number | 1
  pageSize: number | 10
}
export type recomBloggerReq = CommonPageReq & {
    // 0 热门 1 新人 2人气
    type: number,
}
/**
 * list 返回结果
 */
export type PageResponse<T> = {
  list: T[]
  total: number
}
/**
 * 搜索用户请求
 */
export type SearchUserReq = CommonPageReq & {
  name: string
}
/**
 * 搜索帖子请求
 */
export type SearchPostReq = CommonPageReq & {
  title: string
}

export type UserReq = {
  user_id: number
}

/**
 * 订阅折扣
 */
export type DiscountInfo = {
  discount_end_time: number
  discount_per: number
  discount_price: number
  discount_start_time: number
  discount_status: boolean
  id: number
  month_count: number
  price: number
  user_id: number
}
/**
 * 订阅设置
 */
export type SubscribeSetting = {
  id: number
  user_id: number
  price: number
  items: DiscountInfo[]
}

export type UserProfile = {
    about: string //简介
    access_count: number //空间访客数量
    back_img: string //顶部头像
    blogger: boolean //是否博主
    collection: boolean //是否收藏
    collection_post_count: number //当前收藏/关注的帖子数量
    fans_count: number //粉丝数量
    first_name: string
    last_name: string
    following: boolean //是否关注
    following_count: number //关注其他博主的数量
    id: number
    img_count: number //图片数量
    live_certification: boolean //直播认证 0 未认证、1 已认证
    location: string //位置
    media_count: number //媒体数量
    photo: string //用户头像
    play_count: number //帖子/媒体播放数量
    post_count: number //帖子数量
    pt_user_id: number
    status: number // 1正常，2停用
    sub: boolean // 是否订阅
    sub_end_time: number //订阅结束时间
    subscribe_count: number //订阅数量
    today_add_count: number //当日新增帖子数量
    username: string
    video_count: number //媒体数量
}

export interface ReplyForm {
    sub_reply: string
}

export type UpdateUserBaseReq = {
    flags: number,
    about: string,
    photo: string,
    back_img: string,
    location: string,
}


export async function callApiUseGet<Req, Res>({ url, data, transformResponse }: {
    url: string,
    data?: Req,
    transformResponse: (response: PostResult<Res>) => Res
}): Promise<Res | null> {
  try {
    const qs = new URLSearchParams(data ?? {})
    const response = await fetch(`${apiUrl}${url}?${qs.toString()}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Token": "1"
      }
    })
    if (response.ok) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const postResult: PostResult = await response.json()
      // console.log('Success:', postResult);
      return transformResponse(postResult)
    } else {
      console.error("Error-GET-01:", response.status, response.statusText)
      const errorText = await response.text()
      console.error("Error-GET-details:", errorText)
    }
  } catch (error) {
    console.error("Error-GET-catch:", error)
  }
  return null
}


export async function callApi<T, R>(
  url: string,
  data: T,
  transformResponse: (response: PostResult<R>) => R,
): Promise<R | null> {
  /*const agent  = new HttpsProxyAgent(proxyUrl);
    const options: RequestInit = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Token': '1',
        },
        body: JSON.stringify(data),
        // agent: agent,
    };*/
  try {
    const response = await fetch(apiUrl + url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Token": "20241400"
      },
      body: JSON.stringify(data)
    })

    if (response.ok) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const postResult: PostResult = await response.json()
      // console.log('Success:', postResult);
      return transformResponse(postResult)
    } else {
      console.error("Error-01:", response.status, response.statusText)
      const errorText = await response.text()
      console.error("Error details:", errorText)
    }
  } catch (error) {
    console.error("Error-catch:", error)
  }
  return null
}

export async function postData(url: string, data: unknown) {
  try {
    const response = await fetch(apiUrl + url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Token": "20241400"
      },
      body: JSON.stringify(data)
    })

    if (response.ok) {
      const PostResult = await response.json()
      console.log("Success:", PostResult)
      return PostResult
    } else {
      console.error("Error:", response.status, response.statusText)
    }
  } catch (error) {
    console.error("Error:", error)
  }
}

/**
 * 登陆
 * @param userId
 */
export async function login(userId: number) {
  console.log("login user-id :", userId)
  const req = {
    user_id: userId
  }
  return await callApi<UserReq, string>("/auth/login", req, (response) => {
    return response.data as string
  })
}

/**
 * 关注用户帖子
 */
export async function followUserPosts(
  req: CommonPageReq
): Promise<PageResponse<PostData> | null> {
  return await callApi<CommonPageReq, PageResponse<PostData>>(
    "/index/followUserPosts",
    req,
    (response) => {
      return response.data as PageResponse<PostData>
    }
  )
}

/**
 * 已经关注博主发布的贴子动态
 */
export async function followUserUpdate() {
  return await postData("/index/followUserUpdate", {})
}

/**
 * 推荐博主
 */
export async function recomBlogger(
  req: recomBloggerReq
): Promise<PageResponse<BloggerInfo> | null> {
  return await callApi<CommonPageReq, PageResponse<BloggerInfo>>(
    "/index/recomBlogger",
    req,
    (response) => {
      return response.data as PageResponse<BloggerInfo>
    }
  )
}

/**
 * 热门贴子
 */
export async function systemPost(
  req: CommonPageReq
): Promise<PageResponse<PostData> | null> {
  return await callApi<CommonPageReq, PageResponse<PostData>>(
    "/index/systemPost",
    req,
    (response) => {
      return response.data as PageResponse<PostData>
    }
  )
}

/**
 * 已订阅博主列表
 */
export async function userCollectionUsers(
  req: CommonPageReq
): Promise<PageResponse<BloggerInfo> | null> {
  return await callApi<CommonPageReq, PageResponse<BloggerInfo>>(
    "/user/userCollectionUsers",
    req,
    (response) => {
      return response.data as PageResponse<BloggerInfo>
    }
  )
}

/**
 * 搜索用户
 */
export async function searchUser(
  req: SearchUserReq
): Promise<PageResponse<BloggerInfo> | null> {
  return await callApi<SearchUserReq, PageResponse<BloggerInfo>>(
    "/user/search",
    req,
    (response) => {
      return response.data as PageResponse<BloggerInfo>
    }
  )
}

/**
 * 搜索帖子
 */
export async function searchPost(
  req: SearchPostReq
): Promise<PageResponse<PostData> | null> {
  return await callApi<SearchPostReq, PageResponse<PostData>>(
    "/post/search",
    req,
    (response) => {
      return response.data as PageResponse<PostData>
    }
  )
}

/**
 * 查看用户订阅设置
 */
export async function viewUserSubscribeSetting(
  req: UserReq
): Promise<SubscribeSetting | null> {
  return await callApi<UserReq, SubscribeSetting>(
    "/user/viewUserSubscribeSetting",
    req,
    (response) => {
      return response.data as SubscribeSetting
    }
  )
}
export type PostId = {
    post_id: number
}
/**
 * 添加帖子分享记录
 * @param req
 */
export async function postSharLog(
  req: PostId
): Promise<unknown | null> {
  return await callApi<PostId, PostResult<unknown>>(
    "/post/postSharLog",
    req,
    (response) => {
      return response.data
    }
  )
}


// 文件上传
// export const mediaUpload = (data: FormData) => postData('/media/upload', data)
// export const mediaUpload = (data: FormData) => {
//   return fetch(apiUrl + "/media/upload", {
//     headers: {
//       "X-Token": "1"
//     },
//     method: "post",
//     body: data
//   }).then(res => res.json())
// }

//
// export const userProfile = () => callApiUseGet<undefined, UserProfile>({
//   url: "/user/me",
//   transformResponse: response => response.data
// })
//
// export const setReply = (data: ReplyForm) => callApiUseGet<ReplyForm, unknown>({
//   url: "/user/getUserExtend",
//   data,
//   transformResponse: response => response.data
// })
//
// export const updateUserBaseInfo = (data: UpdateUserBaseReq) => callApi<UpdateUserBaseReq, unknown>("/user/updateUserBase", data, response => response.data)