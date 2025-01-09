// Auth related types and interfaces
export interface LoginReq {
  user_id: string  // pt的user_id
}

export interface LoginResp {
  token: string
  user: UserVo
}

export interface UsersReq {
  // Based on vo.UsersReq
  userId: string
  page: number
  limit: number
}

export interface UserVo {
  id: string
  username: string
  name: string
  // Add other users fields based on API response
}