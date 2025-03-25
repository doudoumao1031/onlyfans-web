"use server"

import { ENDPOINTS, fetchWithGet, fetchWithPost, ApiResponse } from "@/lib"

import { iPost, ReplyForm, UpdateUserBaseReq, UserProfile } from "./types"
import { commonWithGet } from "../server-actions"

export async function addPost(params: iPost) {
  // Implementation
  return fetchWithPost<iPost, iPost>(ENDPOINTS.POST.ADD, params)
}

export async function pubPost(id: number) {
  return fetchWithPost<{ post_id: number }>(ENDPOINTS.POST.PUBLISH, { post_id: id })
}

export async function postDetail(id: number) {
  return fetchWithGet<unknown, iPost>(`${ENDPOINTS.POST.VIEW}/${id}`, null)
}
export async function commonPostDetail(id: number) {
  return commonWithGet<unknown, iPost>(`${ENDPOINTS.COMMON.POST}/${id}`, null)
}

export async function userProfile() {
  return fetchWithGet<undefined, UserProfile>(ENDPOINTS.USERS.ME, undefined)
}

export async function getUserReply() {
  return fetchWithGet<undefined, ReplyForm>(ENDPOINTS.USERS.GET_USER_EXTEND, undefined)
}

export async function setUserReply(params: ReplyForm) {
  return fetchWithPost<ReplyForm>(ENDPOINTS.USERS.UPDATE_SUB_REPLAY, params)
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
