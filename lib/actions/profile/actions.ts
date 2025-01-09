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

export async function updateUserBaseInfo (params:UpdateUserBaseReq) {
  return fetchWithPost<UpdateUserBaseReq,unknown>(ENDPOINTS.USERS.UPDATE_BASE,params)
}
