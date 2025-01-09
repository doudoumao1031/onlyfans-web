// Shared types and interfaces

export enum FileType {
  Image = 1,
  Video = 2,
  Other = 3
}

export interface PostInfoVo {
  id: string
  userId: string
  content: string
  title?: string
  postType: number
  postStatus: number
  mediaCount: number
  commentCount: number
  starCount: number
  viewCount: number
  shareCount: number
  createdAt: string
  updatedAt: string
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  code: number;
}

/**
 * list 返回结果
 */
export type PageResponse<T> = {
  list: T[]
  total: number
}


export type FetchTransformResponse<Res> = (response: ApiResponse<Res>) => Res

export type FetchOptions<Res> = {
  headers?: Record<string, unknown>,
  transformResponse?: FetchTransformResponse<Res>,
}