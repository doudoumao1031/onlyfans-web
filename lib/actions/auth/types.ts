// Auth related types and interfaces
export interface LoginReq {
  user_id: number  // pt的user_id
}

export interface LoginResp {
  token: string
  user_id: number
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

export interface UserListResp {
  id: number
  first_name: string
  last_name: string
  username: string
  pt_user_id: number
  blogger: boolean
}