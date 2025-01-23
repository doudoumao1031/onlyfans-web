// import {HttpsProxyAgent} from 'https-proxy-agent';
// import fetch, { RequestInit } from 'node-fetch';

const apiUrl = process.env.NEXT_PUBLIC_API_URL
// const proxyUrl = process.env.NEXT_PROXY_URL || "http://127.0.0.1:8889";
export type PostResult<T> = {
  code: number
  data: T
  message: string
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
  flags: number
  about: string
  photo: string
  back_img: string
  location: string
}

export async function callApiUseGet<Req, Res>({
  url,
  data,
  transformResponse
}: {
  url: string
  data?: Req
  transformResponse: (response: PostResult<Res>) => Res
}): Promise<Res | null> {
  try {
    const qs = new URLSearchParams(data ?? {})
    const response = await fetch(`${apiUrl}${url}?${qs.toString()}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
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
  transformResponse: (response: PostResult<R>) => R
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
        "X-Token": "1"
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
