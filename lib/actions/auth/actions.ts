import { cookies } from "next/headers"
import type { LoginReq, LoginResp } from "@/lib"
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
