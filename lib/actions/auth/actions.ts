
import type { LoginReq, LoginResp } from "@/lib"
import { ENDPOINTS, fetchWithPost } from "@/lib"

/**
 * 登陆
 * @param userId
 */
export const login = (params: LoginReq) =>
  fetchWithPost<LoginReq, LoginResp>(ENDPOINTS.AUTH.LOGIN, params)
    .then((res) => {
      if (res && res.code === 0) {
        return res.data
      } else {
        return null
      }
    })
