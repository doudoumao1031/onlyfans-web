import { cookies } from "next/headers"
import { LoginReq, LoginResp, LoginTokenResp, PageInfo, PageResponse, UserListResp } from "@/lib"
import { ENDPOINTS, fetchWithPost } from "@/lib"

/**
 * 登陆
 * @param userId
 */
export const login = async (params: LoginReq) => {
  const res = await fetchWithPost<LoginReq, LoginResp>(ENDPOINTS.AUTH.LOGIN, params)
  if (res && res.code === 0) {
    return res.data
  }
  return null
}

/**
 * 用户列表
 * @param params
 */
export const users = async (params: PageInfo) => {
  const res = await fetchWithPost<PageInfo, PageResponse<UserListResp>>(ENDPOINTS.AUTH.USERS, params)
  if (res && res.code === 0) {
    return res.data
  }
  return null
}

/**
 * 登录token
 * @param params
 */
export const loginToken = async (params: string) => {
  const res = await fetchWithPost<{
    token: string
  }, LoginTokenResp | null>(ENDPOINTS.AUTH.LOGIN_TOKEN, {
    token: params
  })
  console.log(res, "res--loginToken")

  if (res && res.code === 0) {
    return res.data
  }
  return null
}