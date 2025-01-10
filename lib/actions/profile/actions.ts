"use server"

import { ENDPOINTS, fetchWithGet } from "@/lib"
import { fetchWithPost } from "@/lib"
import { ApiResponse } from "@/lib"
import { iPost, ReplyForm, UpdateUserBaseReq, UserProfile } from "./types"

export async function addPost(params: iPost) {
  // Implementation
  return fetchWithPost<iPost, ApiResponse<unknown>>(ENDPOINTS.POST.ADD, params)
}

export async function userProfile() {
  return fetchWithGet<undefined, UserProfile>(ENDPOINTS.USERS.ME, undefined)
}

export async function getUserReply() {
  return fetchWithGet<undefined, ReplyForm>(ENDPOINTS.USERS.GET_USER_EXTEND, undefined)
}

export async function setUserReply(params: ReplyForm) {
  return fetchWithPost<ReplyForm>(ENDPOINTS.USERS.GET_USER_EXTEND, params)
}

export async function updateUserBaseInfo(params: UpdateUserBaseReq) {
  const { top_info, location, back_img, photo, about } = params
  const arr = [top_info, location, back_img, photo, about]
  const defaultHexValue = new Array(arr.length).fill(0)
  const updateHexValue = defaultHexValue
    .map((_, index) => {
      const updateValue = arr[index]
      if (updateValue) {
        return 1
      }
      return 0
    })
    .join("")
  const flags = parseInt(updateHexValue, 2)
  return fetchWithPost<UpdateUserBaseReq, unknown>(ENDPOINTS.USERS.UPDATE_BASE, {
    ...params,
    flags
  })
}
