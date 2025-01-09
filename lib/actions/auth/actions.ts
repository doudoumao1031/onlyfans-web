"use server"

import type { LoginReq, LoginResp, UsersReq, UserVo } from "./types"

export async function login(_params: LoginReq): Promise<LoginResp> {
  // Implementation
  throw new Error("Not implemented")
}

export async function getUsers(_params: UsersReq): Promise<UserVo[]> {
  // Implementation
  throw new Error("Not implemented")
}