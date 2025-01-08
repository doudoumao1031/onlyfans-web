"use server"

import { cookies } from "next/headers"
import { ENDPOINTS } from "../shared/constants"
import type { LoginReq, LoginResp, UsersReq, UserVo } from "./types"

export async function login(params: LoginReq): Promise<LoginResp> {
  // Implementation
  throw new Error("Not implemented")
}

export async function getUsers(params: UsersReq): Promise<UserVo[]> {
  // Implementation
  throw new Error("Not implemented")
}